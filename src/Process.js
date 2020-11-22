import React, { Component, Fragment } from 'react';
import { Link, Redirect } from 'react-router-dom'
import { Form, Row, Col, Button, Spinner, Card, Container } from 'react-bootstrap'
import firebase from './firebase';
import Nevbar from './Nevbar.js'
import * as faceapi from 'face-api.js'

class Process extends Component {

    state = {
        event_id: this.props.match.params.id,
        currentUser: null,
        auth: false,
        email: [],
        keypath: '',
        imageAsFile: "",
        emailPaticipant: "",
        processimg: {},
        original_url:""
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
        console.log(faceapi) //เทส model
    }


    fetcheventimg = async () => {
        const itemRefPic = await firebase.database().ref(`user/${this.state.keypath}/event/${this.state.event_id}/eventpic`)
        //console.log(itemRefPic)
        await itemRefPic.on("value", (snapshot) => {

            snapshot.forEach(async par => { //ดึงรูปมาเทียบรายรูป
                const picid = await par.key
                this.loadModel()// โหลด Model
                
                const eventRefPic = await firebase.database().ref(`user/${this.state.keypath}/event/${this.state.event_id}/eventpic/${picid}/metadataFile`)

                
                await eventRefPic.once('value').then((snapshot) => {
                    const url = snapshot.val() && snapshot.val().downloadURLs 
                    this.setState({
                        original_url : url
                    })
                })
                console.log(this.state.original_url)

                const printname = []
                const container = document.createElement('div')
                container.style.position = 'relative'
                document.body.append(container)
                document.getElementById("text").innerText = 'กำลัง Process'
        
                const labeledFaceDescriptors = await this.loadLabeledImages()
        
                console.log("label: ", labeledFaceDescriptors)
        
                document.getElementById("text").innerText = 'Process เสร็จแล้ว'
                const faceMatcher = await new faceapi.FaceMatcher(labeledFaceDescriptors, 0.5)
        
                let image, canvas
                if (image) image.remove()
                if (canvas) canvas.remove()
    
                image = await faceapi.fetchImage(`${this.state.original_url}`) //ไฟล์ที่เอาไปเช็ค
                console.log(image)
                document.getElementById("output").append(image)
                canvas = faceapi.createCanvasFromMedia(image)
                container.append(canvas)
                const displaySize = { width: image.width, height: image.height }
                faceapi.matchDimensions(canvas, displaySize)
                const detections = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors()
                const resizedDetections = await faceapi.resizeResults(detections, displaySize)
                const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))
        
                results.forEach((result, i) => {
                    const box = resizedDetections[i].detection.box
                    const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() })
                    console.log(result._label)
                    if (result._label != "unknown") {
                        document.body.append(" \n " + result._label + " \n ") //ปริ้นชื่อคนในภาพ
                        document.getElementById("printname").innerText = " \n " + result._label + " \n "
                        printname.push({ 
                            name: result._label, 
                            status : true
                        })
                        console.log('work')
                    } else {
                        console.log('not do anything')
                    }
                    drawBox.draw(canvas)
                })
                console.log(printname)

                
                //console.log(pardata)

                //const itemRefPic = await firebase.database().ref(`user/${this.state.keypath}/event/${this.state.event_id}/eventpic`)

            })

        })
        
    }

    loadLabeledImages = async () => {
        await faceapi.nets.ssdMobilenetv1.load("/weights")
        await faceapi.nets.faceRecognitionNet.load("/weights")
        await faceapi.nets.faceLandmark68Net.load("/weights")

        // console.log(this.state.keypath)
        // console.log(this.state.event_id)
        const itemRefPar = await firebase.database().ref(`user/${this.state.keypath}/event/${this.state.event_id}/participant`)
        console.log(itemRefPar)

        // await itemRefPar.on("value", (snapshot) => {
        //     snapshot.forEach(async par => {


        //     })

        
        const labels = []
        await itemRefPar.on("value", (snapshot) => {

            snapshot.forEach(async par => {
                const pardata = par.val()
                console.log(pardata)
                labels.push(pardata.email)
                console.log(pardata.email)
            })

        });
        console.log("=====label=====")
        console.log(labels)
        return Promise.all(
            labels.map(async labels => {
                const descriptions = []
                for (let i = 1; i <= 3; i++) {
                    const img = await faceapi.fetchImage("https://firebasestorage.googleapis.com/v0/b/test-file-store-d0505.appspot.com/o/headshot%2F0.jpg?alt=media&token=008e6ab5-108a-4e46-84fd-4bb807400d9e")
                    console.log("Img: ", img)
                    const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
                    console.log('descriptor: ', detections)
                    descriptions.push(detections.descriptor)
                }
                console.log('List of Descriptor: ', descriptions)
                console.log("List of Label: ", labels)
                return await new faceapi.LabeledFaceDescriptors(labels, descriptions)
            })
        )
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
            firebase.database().ref("user").orderByChild("email").equalTo(user.email)
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
                            <h2 id="printname" >ใครอยู่ในรูปภาพ</h2>
                            <Button onClick={this.onclickrespond} className="btn-custom mt-3" id="primary" style={{ width: 300, height: 55, fontSize: "20px", borderRadius: 30 }}>
                                ดูผลลัพธ์
                                    </Button>
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