import React, { Component, Fragment } from 'react';
import { Redirect } from 'react-router-dom'
import { Container, ProgressBar, Spinner, Row, Col } from 'react-bootstrap'
import firebase from './firebase';
import Nevbar from './Nevbar.js'
import * as faceapi from 'face-api.js'
import Loading from './Loading.js'

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
        progress: 0,
        countData: 0,
        allDataLength: 0,
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

    componentDidUpdate(prevProps, prevState) {
        const { countData, allDataLength } = this.state
        if (countData !== prevState.countData) {
            console.log(countData)
            this.setState({
                progress: Math.floor(countData * 100 / allDataLength)
            })
        }
    }

    componentWillUnmount() {

    }

    fetcheventimg = async () => {
        const { keypath, event_id } = this.state
        await faceapi.nets.ssdMobilenetv1.load("/weights")
        await faceapi.nets.faceRecognitionNet.load("/weights")
        await faceapi.nets.faceLandmark68Net.load("/weights")
        const itemRefPic = await firebase.database().ref(`organizers/${keypath}/events/${event_id}/event_pics`)
        let val
        await itemRefPic.on("value", (snapshot) => {
            val = snapshot.val()
            console.log(val)
            this.setState({
                allDataLength: Object.keys(val).length
            })
        })
        for (var key in val) {
            console.log(val[key])
            const picid = key
            let original_url
            const eventRefPic = await firebase.database().ref(`organizers/${keypath}/events/${event_id}/event_pics/${picid}/metadataFile`)
            await eventRefPic.once('value').then((snapshot) => {
                original_url = snapshot.val().downloadURLs
            })

            let image, canvas
            if (image) image.remove()
            if (canvas) canvas.remove()
            image = await faceapi.fetchImage(`${original_url}`)
            canvas = await faceapi.createCanvasFromMedia(image)
            const displaySize = { width: image.width, height: image.height }
            faceapi.matchDimensions(canvas, displaySize)
            const detections = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors()
            const resizedDetections = faceapi.resizeResults(detections, displaySize)

            let all_label = await this.loadLabeledImages()

            await all_label.forEach(label_descriptor => {
                const labeledFaceDescriptors = label_descriptor
                const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.5)

                const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))

                // loop ตามจำนวนคนในรูป => หาว่ามีเจ้าของอยู่ในรูปไหม คือ result._label
                results.forEach((result, i) => {
                    if (result._label !== "unknown") {
                        const participantRef = firebase.database().ref(`organizers/${keypath}/events/${event_id}/participants/${result._label}/processed_pic`)
                        let printname = {
                            original_pic_id: picid,
                            original_pic_url: original_url,
                            processed_pic_url: original_url,
                            is_allow: false,
                        }
                        participantRef.push(printname)
                    }
                })
            })
            this.setState({
                countData: this.state.countData + 1
            })
        }
        const eventRef = firebase.database().ref(`organizers/${keypath}/events/${event_id}`)
        eventRef.update({ is_pic_processed: true })
        this.props.history.push(`/ListofParticipant/${event_id}`)
    }

    loadLabeledImages = async () => {
        const itemRefPar = await firebase.database().ref(`organizers/${this.state.keypath}/events/${this.state.event_id}/participants`)
        let val = null
        let label = ""
        let descriptions = []
        let label_descriptors = []
        itemRefPar.on("value", (snapshot) => {
            val = snapshot.val()
        })
        //panticipants
        for (var key in val) {
            let temp = val[key].headshots_url
            label = key
            // 3 image of panticipant
            for (var i in temp) {
                const img = await faceapi.fetchImage(`${temp[i]}`)

                const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
                descriptions.push(detections.descriptor)
            }
            label_descriptors.push(new faceapi.LabeledFaceDescriptors(label, descriptions))
            descriptions = []
        }
        return label_descriptors
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
        const { currentUser, auth, progress } = this.state
        if (auth) {
            if (currentUser) {
                return (
                    <Fragment>
                        <Nevbar />
                        <Container fluid>
                            <Row>
                                <Col
                                    xs={{ span: 12 }}
                                    sm={{ span: 8, offset: 2 }}
                                    md={{ span: 8, offset: 2 }}
                                    lg={{ span: 8, offset: 2 }}
                                    className="text-center"
                                    style={{ marginTop: 150 }}
                                >
                                    <h2 className="mb-4">
                                        <Spinner animation="grow" variant="primary" className="mr-4 mb-2" />
                                        กำลังประมวลผลภาพ...
                                    </h2>
                                    <h5>ห้ามปิดหน้าต่างนี้จนกว่าจะทำการประมวลผลเสร็จสมบูรณ์</h5>
                                    <ProgressBar striped animated variant="info" now={progress} label={`${progress}%`} />
                                </Col>
                            </Row>
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
                <Loading />
            )
        }
    }

}
export default Process;