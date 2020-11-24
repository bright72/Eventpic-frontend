import React, { Component, Fragment } from 'react';
import { Redirect } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import firebase from './firebase';
import Nevbar from './Nevbar.js'
import * as faceapi from 'face-api.js'

class Process extends Component {

    state = {
        event_id: this.props.match.params.event_id,
        participant_id: this.props.match.params.participant_id,
        currentUser: null,
        auth: false,
        email: [],
        keypath: '',
        imageAsFile: "",
        emailPaticipant: "",
        img_id: "",
        original_url: "",
        par_url: "",
        process_url: "",
        processimg: {},
        buttonstatus: true,
        par_key: "",
    }

    async componentWillMount() {
        let user = await this.getUser();
        let key = await this.getKey(user)
        this.setState({
            currentUser: user,
            keypath: key,
            auth: true
        })
        this.fetcheventimg()
    }

    loadModel = async () => {
        Promise.all([
            faceapi.nets.ssdMobilenetv1.load('/weights'),
            faceapi.nets.faceRecognitionNet.load('/weights'),
            faceapi.nets.faceLandmark68Net.load('/weights'),
        ])
    }


    fetcheventimg = async () => {
        this.loadModel()// โหลด Model
        const itemRefPic = await firebase.database().ref(`organizers/${this.state.keypath}/events/${this.state.event_id}/eventpics`)
        let val = null
        await itemRefPic.on("value", (snapshot) => {
            val = snapshot.val()
        })
        for (var key in val) {
            const picid = key
            const eventRefPic = await firebase.database().ref(`organizers/${this.state.keypath}/events/${this.state.event_id}/eventpics/${picid}/metadataFile`)
            await eventRefPic.once('value').then((snapshot) => {
                const url = snapshot.val() && snapshot.val().downloadURLs
                this.setState({
                    original_url: url,
                    img_id: picid
                })
            })
            const printname = {}
            document.getElementById("text").innerText = 'กำลังประมวลผลภาพถ่าย โปรดรอสักครู่...'
            const labeledFaceDescriptors = await this.loadLabeledImages()
            const faceMatcher = await new faceapi.FaceMatcher(labeledFaceDescriptors, 0.5)

            let image, canvas
            if (image) image.remove()
            if (canvas) canvas.remove()
            const oriurl = this.state.original_url
            image = await faceapi.fetchImage(`${oriurl}`) //ไฟล์ที่เอาไปเช็ค
            canvas = faceapi.createCanvasFromMedia(image)
            const displaySize = { width: image.width, height: image.height }
            faceapi.matchDimensions(canvas, displaySize)
            const detections = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors()
            const resizedDetections = await faceapi.resizeResults(detections, displaySize)
            const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))
            results.forEach((result, i) => {
                if (result._label !== "unknown") {
                    const participantRef = firebase.database().ref(`organizers/${this.state.keypath}/events/${this.state.event_id}/participants/${result._label}/processed_pic`)
                    let printname = {
                        original_pic_id: this.state.img_id,
                        status: true,
                        original_pic_url: oriurl,
                        processed_pic_url: oriurl,
                        par_key: result._label,
                    }
                    participantRef.push(printname)
                } else {
                }
            })
            this.setState({
                processimg: printname
            })
        }
        document.getElementById("text").innerText = 'Process เสร็จแล้ว'
        this.props.history.push(`/ListofParticipant/${this.state.event_id}`)
    }

    loadLabeledImages = async () => {
        this.loadModel()// โหลด Model
        await faceapi.nets.ssdMobilenetv1.load("/weights")
        await faceapi.nets.faceRecognitionNet.load("/weights")
        await faceapi.nets.faceLandmark68Net.load("/weights")
        const itemRefPar = await firebase.database().ref(`organizers/${this.state.keypath}/events/${this.state.event_id}/participants`)
        let labels = ""
        let val = null
        let descriptions = []
        itemRefPar.on("value", (snapshot) => {
            val = snapshot.val()
        })
        for (var key in val) {
            let temp = val[key].image
            labels = key
            this.setState({
                par_key: key
            })
            for (var i in temp) {
                const img = await faceapi.fetchImage(`${temp[i]}`)
                this.setState({
                    process_url: temp[i]
                })
                const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
                descriptions.push(detections.descriptor)
            }
        }
        return new faceapi.LabeledFaceDescriptors(labels, descriptions)
    }

    getUser = () => {
        return new Promise((resolve, reject) => {
            firebase.auth().onAuthStateChanged(function (user) {
                if (user) {
                    resolve(user)
                } else {
                    // No user is signed in.
                }
            });
        })
    }

    getKey = (user) => {
        return new Promise((resolve, reject) => {
            firebase.database().ref("organizers").orderByChild("email").equalTo(user.email)
                .on("child_added", function (snapshot) {
                    resolve(snapshot.key)
                })
        })
    }

    render() {
        const { currentUser, auth } = this.state;
        if (auth) {
            if (currentUser) {
                return (
                    <Fragment>
                        <Nevbar />
                        <Container fluid>
                            <h1 id="text">กำลังประมวลผลภาพถ่าย</h1>
                            <div id="output"></div>
                        </Container>
                    </Fragment>
                );
            }
            if (!currentUser) {
                return (
                    <Redirect to="/Login" />
                )
            }
        }
        else {
            return (
                <div>Loading</div>
            )
        }
    }

}
export default Process;