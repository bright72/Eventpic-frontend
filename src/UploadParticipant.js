import React, { Component, Fragment } from 'react'
import { Redirect } from 'react-router-dom'
import { Form, Container, Row, Col, Card } from 'react-bootstrap'

import './Style.css'
import Nevbar from './Nevbar'
import Loading from './Loading.js'
import firebase from './firebase'
import WebcamCapture from './CaptureParticipant'


class UploadParticipant extends Component {

    state = {
        event_id: this.props.match.params.id,
        organize_id: '',
        email: '',
        currentUser: null,
        auth: false,
        validate: false,
        showAlert: false,
        participant: {},
        files: [],
        image: {}
    }

    async componentWillMount() {

        let user = await this.getUser();
        let key = await this.getKey(user)
        this.setState({
            currentUser: user,
            organize_id: key,
            auth: true
        })

    }

    setFile = (file) => {
        this.setState({
            files: file
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

    handleChange = e => {
        const { name, value } = e.target
        this.setState({
            [name]: value
        })
    }

    handleSubmit = async e => {
        const { event_id, files, organize_id, email } = this.state
        e.preventDefault()
        const form = e.currentTarget
        if (form.checkValidity() === true) {
            const participantRef = firebase.database().ref(`organizers/${organize_id}/events/${event_id}/participants`)
            let object_1 = {
                email: email,
                panticipant_picture_confirm: false,
                organize_picture_confirm:false,
            }
            let x = participantRef.push(object_1)
            let participant_id = x.key
            let headshots_url = []

            for (let i = 0; i < files.length; i++) {
                let img = files[i]
                let storageRef = await firebase.storage().ref(`headshot/${participant_id}/${img.lastModified}.jpg`)
                await storageRef.put(img)
                let downloadUrl = await storageRef.getDownloadURL()
                headshots_url.push(downloadUrl)
            }
            participantRef.child(`${participant_id}/headshots_url`).update(headshots_url)

        } else {
            this.setState({
                validate: true
            })
            e.stopPropagation()
        }
        this.props.history.push(`/MoreDetail/${event_id}`)
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


    render() {
        const { currentUser, auth, validate } = this.state

        if (auth) {
            if (currentUser) {
                return (
                    <Fragment>
                        <Nevbar />
                        <Container fluid>
                            <Row>
                                <Col
                                    xs={12}
                                    sm={{ span: 10, offset: 1 }}
                                    md={{ span: 10, offset: 1 }}
                                    lg={{ span: 10, offset: 1 }}
                                    style={{ marginTop: 20 }}
                                >
                                    <Card className="form-card" className="py-4">
                                        <h2 className="title-lable mt-4 pt-3 text-center" id="card-title">เพิ่มผู้เข้าร่วมกิจกรรม</h2>
                                        <Form noValidate validated={validate} onSubmit={this.handleSubmit} className="form px-4 mx-4">
                                            <Row className="mt-4">
                                                <Col
                                                    s={12}
                                                    sm={{ span: 10, offset: 1 }}
                                                    md={{ span: 8, offset: 2 }}
                                                    lg={{ span: 6, offset: 3 }}
                                                >
                                                    <Form.Label className="title-lable">อีเมล์</Form.Label>
                                                    <Form.Group controlId="formBasicEmail" >
                                                        <Form.Control className="form form-input" name="email" onChange={this.handleChange} type="email" placeholder="อีเมล์" required />
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                            <WebcamCapture setFile={this.setFile} />
                                        </Form>
                                    </Card>
                                </Col>
                            </Row>
                        </Container>
                    </Fragment>
                )
            }
            if (!currentUser) {
                return (
                    <Redirect to="/Login" />
                )
            }
        } else {
            return (
               <Loading/>
            )
        }

    }
}

export default UploadParticipant;