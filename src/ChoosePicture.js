import React, { Component, Fragment } from 'react'
import { Redirect } from 'react-router-dom'
import { Button, Card, Container, Row, Col, Modal, CardColumns, Form, Image } from 'react-bootstrap'
import firebase from './firebase/index'
import Nevbar from './Nevbar.js'
import Loading from './Loading.js'
import emailjs from 'emailjs-com';

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
        show: false,
        visibleButton: true,
        threeShot: [],
        templateParams: {}


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
        this.FetchHeadshot()

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
        const { user_id, event_id, participant_id } = this.state
        const databaseRef = firebase.database().ref(`organizers/${user_id}/events/${event_id}/participants/${participant_id}/processed_pic`)
        databaseRef.on('value', snapshot => {
            let pictures = snapshot.val()
            let tempRows = []
            for (const key in pictures) {
                let row = {
                    original_id: pictures[key].original_pic_id,
                    processed_id: key,
                    processed_url: pictures[key].processed_pic_url
                }
                tempRows.push(row)
            }
            this.setState({
                pictures: tempRows
            })
        })
    }

    FetchHeadshot = () => {
        let headshots = this.state.participant.headshots_url
        let temp = headshots.map((url, index) => {
            return (
                <Image
                    src={url}
                    rounded
                    height={200}
                    width={200}
                    key={index}
                    style={{ marginRight: 20, marginBottom: 15, objectFit: "cover" }}
                />
            )
        })
        console.log(temp)
        this.setState({
            threeShot: temp
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
        if (temp.length === 0) {
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
        const participantImageRef = firebase.database().ref(`organizers/${user_id}/events/${event_id}/participants/${participant_id}`)
        selectPictures.forEach(key => {
            participantImageRef.child(`/processed_pic/${key}`).remove()
        })
        this.setState({
            visibleButton: false
        })
        this.handleClose()
    }

    sendEmail = () => {
        // ส่ง email ไปเเล้ว ต้องเซต organize_picture_confirm: true ด้วยนะ
        console.log("test")
        const { participant, event_id, user_id, templateParams, participant_id } = this.state

        console.log(templateParams)

        const event = firebase.database().ref(`organizers/${user_id}/events/${event_id}`)
        event.on("value", (snapshot) => {
            let eventdetail = snapshot.val()
            console.log(eventdetail)
            let templateParams = {
                to_email: participant.email,
                event_name: eventdetail.name,
                event_date: eventdetail.start_date,
                event_dateline: eventdetail.dateline,
                event_url: `https://eventpic.tk/allow/${user_id}/${event_id}/${participant_id}`
            }
            console.log(templateParams)
            emailjs.send(
                'EventPic',
                'template_p1ojhve',
                templateParams,
                'user_taSKZdwaRwk1j4rwI0eXi'
            )
        })

        let confirm = {
            organize_picture_confirm: true,
        }

        const organizeConfirm = firebase.database().ref(`organizers/${user_id}/events/${event_id}/participants/${participant_id}`)
        organizeConfirm.update(confirm)
        console.log("finish")
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
        const { pictures, currentUser, auth, participant, selectPictures, show, visibleButton, threeShot } = this.state
        let ListCheckPicture = pictures.map((pic, index) => {
            return (
                <Card>
                    <Card.Img variant="top" src={pic.processed_url} />
                    <div id="picture-panticipant">
                        <Form.Check type="checkbox" id="panticipant" name={"checkbox-" + index} value={pic.processed_id} onChange={this.handleChange} />
                    </div>
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
                                    sm={{ span: 12 }}
                                    md={{ span: 10, offset: 1 }}
                                    lg={{ span: 10, offset: 1 }}
                                    className="text-center mb-2"
                                >
                                    {threeShot}
                                </Col>
                                <Col
                                    xs={{ span: 12 }}
                                    sm={{ span: 12 }}
                                    md={{ span: 10, offset: 1 }}
                                    lg={{ span: 10, offset: 1 }}
                                    className="text-center mb-4"
                                >
                                    <h2 >ตรวจสอบภาพถ่ายของ {participant.email}</h2>
                                    <h5>กรุณาเลือกภาพถ่ายที่ <span style={{color:"red"}}>"ไม่มี"</span> บุคคลจากภาพถ่ายใบหน้าด้านบน และทำการลบ ก่อนที่จะยืนยันทำการส่งอีเมล์</h5>
                                </Col>
                                <Col
                                    xs={{ span: 12 }}
                                    sm={{ span: 12 }}
                                    md={{ span: 10, offset: 1 }}
                                    lg={{ span: 8, offset: 2 }}
                                    className="mb-3"
                                >
                                    <CardColumns>
                                        {ListCheckPicture}
                                    </CardColumns>
                                </Col>
                                <Col
                                    xs={{ span: 12 }}
                                    sm={{ span: 12 }}
                                    md={{ span: 10, offset: 1 }}
                                    lg={{ span: 8, offset: 2 }}
                                    className="text-right"
                                >
                                    <Button className="btn-custom mr-2" id="primary" onClick={this.handleShow} disabled={!visibleButton} >
                                        ยืนยัน และ ลบภาพถ่าย
                                    </Button>
                                    <Button className="btn-custom" id="primary" onClick={this.sendEmail} disabled={visibleButton} >
                                       ส่งอีเมล์
                                    </Button>
                                </Col>
                                <Modal show={show} onHide={this.handleClose}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>การตรวจสอบรูปภาพ</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        {selectPictures.length !== 0 ?
                                            <p>ต้องการลบภาพถ่ายที่คุณเลือกใช่หรือไม่ (หากยืนยันเเล้วไม่สามารถแก้ไขภายหลังได้)</p>
                                            :
                                            <p>คุณไม่ได้เลือกภาพถ่าย ภาพถ่ายทั้งหมดถูกต้องเเล้วใช่หรือไม่ (หากยืนยันเเล้วไม่สามารถแก้ไขภายหลังได้)</p>
                                        }
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" className="btn-custom" onClick={this.handleClose}>
                                            ปิด
                                            </Button>
                                        <Button className="btn-custom" id="primary" onClick={this.handleSubmit} >
                                            ยืนยัน
                                            </Button>
                                    </Modal.Footer>
                                </Modal>
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
               <Loading/>
            )
        }
    }
}
export default ChoosePicture