import React, { Component, Fragment } from 'react';
import { Link, Redirect } from 'react-router-dom'
import { Form, Row, Col, Button, Spinner, Card, Container } from 'react-bootstrap'
import firebase from './firebase';
import Nevbar from './Nevbar.js'
import * as faceapi from 'face-api.js'
//import axios from "axios";

class Process extends Component {

    state = {
        event_id: this.props.match.params.id,
        currentUser: null,
        auth: false,
        email: [],
        keypath: '',
        imageAsFile: "",
        emailPaticipant: "",
        processimg: {}
    }

    async componentWillMount() {
        let user = await this.getUser();
        let key = await this.getKey(user)
        this.setState({
            currentUser: user,
            keypath: key,
            auth: true
        })
        this.start()
    }

    start = async () => {
        Promise.all([
            faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
            faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
            faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
        ])

        console.log(this.state.keypath)
        console.log(this.state.event_id)
        const itemRefPar = await firebase.database().ref(`user/${this.state.keypath}/event/${this.state.event_id}/participant`)
        console.log(itemRefPar)

        await itemRefPar.on("value", (snapshot) => {
            snapshot.forEach(async par => {
                const descriptions = []
                const pardata = par.val()
                console.log(pardata)
                this.state.email.push(pardata.email)

                const img = await faceapi.fetchImage("https://i0.wp.com/mtmstudioclub.com/wp-content/uploads/2019/05/maxresdefault.jpg?fit=1280%2C720&ssl=1")
                console.log(img)

                // pardata.map((img)=>{
                //     console.log(img.image.img1)
                // })

                //const size = Object.size(pardata.image);
                //console.log(size)

                // const img = faceapi.fetchImage(`${pardata.image.img1}`) //ไฟล์ที่เอาไป Process 

                //const imga = await faceapi.fetchImage(`${pardata.image.img1}`)
                //const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
                //descriptions.push(detections.descriptor)
            });
        });

        //ใส่ตรงนี้เ้วย
    
    }

    
    
    //console.log(faceapi)

    // const container = document.createElement('div')
    // container.style.position = 'relative'
    // document.body.append(container)
    // document.getElementById("text").innerText = 'กำลัง Process'
    // console.log("กำลัง Process")
    // const labeledFaceDescriptors = await loadLabeledImages()

    // function loadLabeledImages() {

    //     const labels = ['bright@gmail.com', 'earn@gmail.com', 'earth@gmail.com']
    //     return Promise.all(
    //         labels.map(async label => {
    //             const descriptions = []
    //             for (let i = 1; i <= 3; i++) {
    //                 console.log('เทส ๆ')
    //                 const img = await faceapi.fetchImage(`/.trainfacemodel/${label}/${i}.jpg`) //ไฟล์ที่เอาไป Process 
    //                 console.log(img)
    //                 const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
    //                 descriptions.push(detections.descriptor)

    //             }

    //             return new faceapi.LabeledFaceDescriptors(label, descriptions)
    //         })
    //     )
    // }


    // console.log('เทส 1232425')
    // console.log(labeledFaceDescriptors)
    // //document.getElementById("text").innerText = 'Process เสร็จแล้ว'
    // console.log("Process เสร็จแล้ว")
    // const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.5)
    // console.log(faceMatcher)
    // let image, canvas

    // if (image) image.remove()
    // if (canvas) canvas.remove()
    // //image = await faceapi.bufferToImage(imageUpload.files[0])
    // image = faceapi.fetchImage('./eventpicture/test3.jpg') //ไฟล์ที่เอาไปเช็ค
    // console.log(image)
    // console.log(image)
    // container.append(image) //ปริ้นรูป
    // canvas = faceapi.createCanvasFromMedia(image)
    // container.append(canvas)
    // const displaySize = { width: image.width, height: image.height }
    // faceapi.matchDimensions(canvas, displaySize)
    // const detections = faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors()
    // const resizedDetections = faceapi.resizeResults(detections, displaySize)
    // const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))
    // const printname = []
    // results.forEach((result, i) => {
    //     const box = resizedDetections[i].detection.box
    //     const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() })
    //     console.log(result._label)
    //     if (result._label != "unknown") {
    //         document.body.append(result._label) //ปริ้นชื่อคนในภาพ
    //         printname.push({ name: result._label })
    //         console.log('work')
    //     } else {
    //         console.log('not do anything')
    //     }
    //     drawBox.draw(canvas)
    // })
    // console.log(printname)
    // 


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
                            <div>
                                <h1 id="text">กำลังประมวลผลภาพถ่าย</h1>
                                <h2>ใครอยู่ในรูปภาพ</h2>
                            </div>
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