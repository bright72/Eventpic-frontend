import React, { Component, Fragment } from 'react'
import { Redirect } from 'react-router-dom'
import { Button, Card, Container, Row, Col, Modal, CardColumns, Form } from 'react-bootstrap'
import firebase from './firebase/index'
import Nevbar from './Nevbar.js'

class ChoosePicture extends Component {

    state = {
        user_id: '',
        event_id: this.props.match.params.event_id,
        participant_id: this.props.match.params.participant_id,
        currentUser: null,
        auth: false,
        pictures: [],
        participant: {},
        selectPictures: [],
        show: false
    }

    //ใช้ตอนที่ยังไม่ Mount DOM
    async componentWillMount() {
        let user = await this.getUser();
        let key = await this.getKey(user)
        this.setState({
            currentUser: user,
            user_id: key,
            auth: true
        })
        this.getParticipant()
        this.getAllPictureOfEvent()
    }

    getUser = () => {
        return new Promise((resolve, reject) => {
            firebase.auth().onAuthStateChanged(function (user) {
                if (user) {
                    resolve(user)
                } else {
                    // No user is signed in.
                }
            })
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

    getAllPictureOfEvent() {
        const { user_id, event_id } = this.state
        const databaseRef = firebase.database().ref(`organizers/${user_id}/events/${event_id}/event_pics`)
        databaseRef.on('value', snapshot => {
            let pictures = snapshot.val()
            let tempRows = []
            for (const property in pictures) {
                let row = {
                    id: property,
                    metadata: pictures[property].metadataFile
                }
                tempRows.push(row)
            }
            this.setState({
                pictures: tempRows
            })
        })
    }

    getParticipant() {
        const { user_id, event_id, participant_id } = this.state
        const participantRef = firebase.database().ref(`organizers/${user_id}/events/${event_id}/participants/${participant_id}`)
        participantRef.on("value", (snapshot) => {
            let participant = snapshot.val()
            this.setState({
                participant: participant
            })
        })
    }

    handleChange = e => {
        const { selectPictures } = this.state
        const { value } = e.target
        let temp = selectPictures.filter(id => id === value)
        if (temp === 0) {
            // not dupilcate
            selectPictures.push(value)
        } else {
            // dupilcate
            this.setState({
                selectPictures: selectPictures.filter(id => id !== value)
            })
        }
    }

    handleSubmit = (e) => {
        const { user_id, event_id, participant_id, selectPictures } = this.state
        e.preventDefault()
        const participantRef = firebase.database().ref(`organizers/${user_id}/events/${event_id}/participants`)
        const participant = {
            is_select_image: true
        }
        if (selectPictures.length !== 0) {
            const imageRef = firebase.database().ref(`organizers/${user_id}/events${event_id}/participants/${participant_id}/processed_pic`)
            selectPictures.forEach(pic => {
                let index = pic.indexOf(",")
                let image = {
                    id: pic.slice(0, index),
                    orginal_image_url: pic.slice(index + 1),
                    processed_image_url: "",
                    is_allow: true,
                }
                imageRef.push(image)
            })
        }
        participantRef.child(participant_id).update(participant)
        this.handleClose()
        this.props.history.push(`/ListofParticipant/${event_id}`)
    }

    handleClose = () => {
        this.setState({
            show: false
        })
    }

    handleShow = () => {
        this.setState({
            show: true
        })
    }

    render() {
        const { pictures, currentUser, auth, participant, selectPictures, show } = this.state
        //รูปทั้งหมดในอีเว่น
        let ListCheckPicture = pictures.map((pic, index) => {
            return (
                <Card>
                    <Card.Img variant="top" src={pic.metadata.downloadURLs} />
                    <Card.Body>
                        <Card.Text>
                            <Form.Check inline type="checkbox" name={"checkbox-" + index} value={[pic.id, pic.metadata.downloadURLs]} onChange={this.handleChange} />
                            {pic.metadata.name}
                        </Card.Text>
                    </Card.Body>
                </Card>
            )
        })

        if (auth) {
            if (currentUser) {
                return (
                    <Fragment>
                        <Nevbar />
                        <Container fluid>
                            <Row className="mb-4">
                                <Col
                                    xs={{ span: 12 }}
                                    sm={{ span: 8, offset: 2 }}
                                    md={{ span: 8, offset: 2 }}
                                    lg={{ span: 8, offset: 2 }}
                                >
                                    <h2 className="mb-4">กรุณาเลือกรูปของ {participant.email}</h2>
                                </Col>
                                <Col
                                    xs={{ span: 12 }}
                                    sm={{ span: 8, offset: 2 }}
                                    md={{ span: 8, offset: 2 }}
                                    lg={{ span: 8, offset: 2 }}
                                >
                                    <CardColumns>
                                        {ListCheckPicture}
                                    </CardColumns>
                                </Col>
                                <Col
                                    xs={{ span: 12 }}
                                    sm={{ span: 8, offset: 2 }}
                                    md={{ span: 8, offset: 2 }}
                                    lg={{ span: 8, offset: 2 }}
                                    className="text-center"
                                >
                                    <Button className="btn-custom mt-3" id="primary" onClick={this.handleShow}>
                                        OK
                                    </Button>
                                    <Modal show={show} onHide={this.handleClose}>
                                        <Modal.Header closeButton>
                                            <Modal.Title>Confirm Send Email</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            {selectPictures.length !== 0 ? `คุณต้องการยืนยันการส่งอีกเมลให้แก่ผู้เข้าร่วมใช่หรือไม่ (หากยืนยันเเล้วไม่สามารถแก้ไขภายหลังได้)` : `ผู้เข้าร่วมคนนี้ไม่มีรูปภาพใช่หรือไม่ (หากยืนยันเเล้วไม่สามารถแก้ไขภายหลังได้)`}
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <Button variant="secondary" className="btn-custom" onClick={this.handleClose}>
                                                Close
                                            </Button>
                                            <Button className="btn-custom" id="primary" onClick={this.handleSubmit} >
                                                Confirm
                                            </Button>
                                        </Modal.Footer>
                                    </Modal>
                                </Col>
                            </Row>
                        </Container>
                    </Fragment >
                )
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
export default ChoosePicture