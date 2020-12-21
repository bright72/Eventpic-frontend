import React, { Component, Fragment } from 'react'
import { Redirect } from 'react-router-dom'
import { Card, Container, Row, Col, CardColumns } from 'react-bootstrap'
import firebase from './firebase/index'
import Nevbar from './Nevbar.js'
import Loading from './Loading'

class ViewPicture extends Component {

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

    async componentWillMount() {
        let user = await this.getUser();
        let key = await this.getKey(user)
        this.setState({
            currentUser: user,
            user_id: key,
            auth: true
        })
        this.getParticipant()
        this.getAllPictureOfPaticipant()
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

    getAllPictureOfPaticipant() {
        const { user_id, event_id, participant_id } = this.state
        const databaseRef = firebase.database().ref(`organizers/${user_id}/events/${event_id}/participants/${participant_id}/processed_pic`)
        databaseRef.on('value', snapshot => {
            let pictures = snapshot.val()
            let tempRows = []
            for (const key in pictures) {
                let row = {
                    original_id: pictures[key].original_pic_id,
                    processed_id: key,
                    processed_url: pictures[key].processed_pic_url,
                    is_allow: pictures[key].is_allow
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

    render() {
        const { pictures, currentUser, auth, participant } = this.state
        //รูปทั้งหมดในอีเว่น
        let ListCheckPicture = pictures.map((pic, index) => {
            return (
                <Card border={pic.is_allow ? "success" : "danger "}>
                    <Card.Img variant="top" src={pic.processed_url} />
                    {participant.panticipant_picture_confirm ?
                        <Card.Body>
                            {pic.is_allow ?
                                <div className="text-center" style={{ color: "green" }}>
                                    <Card.Title>อนุญาต</Card.Title>
                                    <Card.Text>
                                        สามารถนำรูปไปใช้สำหรับประชาสัมพันธ์ต่อไปได้
                                    </Card.Text>
                                </div>
                                :
                                <div className="text-center" style={{ color: "red" }}>
                                    <Card.Title>ไม่อนุญาต</Card.Title>
                                    <Card.Text>
                                        ไม่สามารถนำรูปนี้ไปใช้ประสัมพันธ์ต่อได้
                                    </Card.Text>
                                </div>
                            }
                        </Card.Body>
                        :
                        null
                    }
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
                                    <h2>ภาพถ่ายทั้งหมดของ {participant.email}</h2>
                                    {participant.panticipant_picture_confirm ?
                                        <p>ผู้เข้าร่วมได้ทำการคัดเลือกรูปภาพเรียบร้อยเเล้ว โดยเเสดงตามรูป ดังนี้</p>
                                        :
                                        <p>ระบบได้ทำการส่ง email เพื่อขออนุญาตใช้งานภาพถ่ายจากผู้ใช้งานคนนี้เรียบร้อยเเล้ว โปรดรอการตอบกลับจากผู้เข้าร่วม</p>
                                    }
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
export default ViewPicture