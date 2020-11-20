import React, { Component, Fragment } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { Form, Button, Container, Row, Col, Modal, Card } from 'react-bootstrap'

import './Style.css'
import Nevbar from './Nevbar'
import firebase from './firebase'
import WebcamCapture from './CaptureParticipapnt'


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
        file: {},
        headshot_url:''
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

    setFile = async (file)  => {
        this.setState({
            file: file
        })
        console.log(file)
        const num = 0
        let storageRef = firebase.storage().ref('headshot').child(`${num}.jpg`);
        storageRef.put(file).then(function(snapshot) {
            console.log('Uploaded file done!');
          });
        const headshot_url = await storageRef.getDownloadURL()

        this.setState({
            headshot_url:headshot_url
        })
        console.log(this.state.headshot_url)

        const itemRef = await firebase.database().ref(`user/${this.state.organize_id}/event/${this.state.event_id}/participant`)

        let item = {
            email: this.state.email,
            is_select_image:false,
            participant_picture_confirm : false,
            image: [this.state.headshot_url]
        }
        await itemRef.push(item)        
        //await itemRef.child(`${participant_id}/image`).push(image)
        console.log('อัพดาต้าเบสแล้วเว้ยยย')

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

    handleChange = e => {
        const { name, value } = e.target
        this.setState({
            [name]: value
        })
    }

    handleSubmit = e => {
        const { event_id, file, email, organize_id } = this.state
        e.preventDefault()
        const form = e.currentTarget
        if (form.checkValidity() === true) {

            const itemsRef = firebase.database().ref(`user/${organize_id}/event/${event_id}/participant`)
            let item = {
                email: email,
                is_select_image: false,
                panticipant_picture_confirm: false
            }
            itemsRef.push(item)

            // console.log(file)
            // let storageRef = firebase.storage().ref(`images/`)
            // storageRef.put(file)
            // let downloadUrl = storageRef.getDownloadURL()
            // console.log(downloadUrl)
            // this.props.history.push('/MoreDetail/' + event_id)
        } else {
            this.setState({
                validate: true
            })
            e.stopPropagation()
        }
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
                                        <h2 className="title-lable mt-4 pt-3 text-center" id="card-title">PARTICIPANT</h2>
                                        <Form noValidate validated={validate} onSubmit={this.handleSubmit} className="form px-4 mx-4">
                                            <Row className="mt-4">
                                                <Col
                                                    s={12}
                                                    sm={{ span: 10, offset: 1 }}
                                                    md={{ span: 8, offset: 2 }}
                                                    lg={{ span: 6, offset: 3 }}
                                                >
                                                    <Form.Label className="title-lable">EMAIL</Form.Label>
                                                    <Form.Group controlId="formBasicEmail" >
                                                        <Form.Control className="form form-input" name="email" onChange={this.handleChange} type="email" placeholder="Email" required />
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
                <div>Loading</div>
            )
        }

    }
}

export default UploadParticipant;