import React, { Component, Fragment } from 'react'
import { Redirect } from 'react-router-dom'
import { Button, Card, Container, Row, Col, Modal, CardColumns, Image } from 'react-bootstrap'
import firebase from './firebase/index'
import Nevbar from './Nevbar.js'
import Loading from './Loading.js'

class DownloadPictureOfEvent extends Component {

    state = {
        user_id: '',
        event_id: this.props.match.params.event_id,
        currentUser: null,
        auth: false,
        pictures: [],
        participants: {},
        event_name: "",
        original_pics: [],
        show: false,
        confirm_all_panticipant: false,
        num_of_panticipant: 0,
        count_panticipant_confirm: 0,


    }

    async componentWillMount() {
        let user = await this.getUser();
        let key = await this.getKey(user)
        this.setState({
            currentUser: user,
            user_id: key,
            auth: true
        })
        this.getParticipants()
        if (this.state.confirm_all_panticipant) {
            this.fetchEvent()
        }

    }

    componentDidUpdate(prevProps, prevState) {
        const { participants, confirm_all_panticipant } = this.state
        if (Object.keys(participants).length !== Object.keys(prevState.participants).length) {
            this.setState({
                num_of_panticipant: Object.keys(participants).length
            })
            this.CheckParticipantsConfirm()
        }

        if (confirm_all_panticipant !== prevState.confirm_all_panticipant) {
            this.fetchEvent()
        }
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

    CheckParticipantsConfirm() {
        const { participants } = this.state
        let count = 0
        let is_confirm = true
        for (const key in participants) {
            if (participants[key].panticipant_picture_confirm) {
                count++
            } else {
                is_confirm = false
            }
        }
        this.setState({
            count_panticipant_confirm: count,
            confirm_all_panticipant: is_confirm
        })
    }

    getParticipants() {
        const { user_id, event_id } = this.state
        const participantRef = firebase.database().ref(`organizers/${user_id}/events/${event_id}/participants`)
        participantRef.on("value", (snapshot) => {
            let val = snapshot.val()
            this.setState({
                participants: val
            })
        })
    }

    fetchEvent() {
        const { user_id, event_id } = this.state
        const eventRef = firebase.database().ref(`organizers/${user_id}/events/${event_id}`)
        eventRef.on("value", (snapshot) => {
            let event = snapshot.val()
            this.setState({
                event_name: event.name,
            })
        })

        this.filterPicture()
    }



    handleSubmit = () => {
        const { participants, user_id, event_id } = this.state
        const participantRef = firebase.database().ref(`organizers/${user_id}/events/${event_id}/participants`)
        for (const key in participants) {
            participantRef.child(key).update({ panticipant_picture_confirm: true })
        }
        this.setState({
            confirm_all_panticipant: true
        })
        this.handleClose()
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

    filterPicture = () => {
        const { participants } = this.state
        let key_pic_not_allow = []
        let key_pic_allow = []
        for (const i in participants) {
            let processed_pic = participants[i].processed_pic
            for (const key in processed_pic) {
                if (!processed_pic[key].is_allow) {
                    key_pic_not_allow.push(processed_pic[key])
                } else {
                    key_pic_allow.push(processed_pic[key])

                }
            }
        }

        let pic_of_process = key_pic_allow.concat(key_pic_not_allow)

        // เอารูปที่ไม่อนุญาตออก
        key_pic_not_allow.forEach(x => {
            pic_of_process = pic_of_process.filter(y => y.original_pic_id !== x.original_pic_id)
        })

        // คัดรูปซ้ำออก
        const seen = new Set()
        let results = pic_of_process.filter(el => {
            const duplicate = seen.has(el.original_pic_id);
            seen.add(el.original_pic_id);
            return !duplicate;
        })

        this.setState({
            original_pics: results
        })
    }


    downloadFiles = async () => {
        // urls.forEach(function (url) {
        //     var filename = "filename";
        //     // loading a file and add it in a zip file
        //     JSZipUtils.getBinaryContent(url, function (err, data) {
        //         if (err) {
        //             throw err; // or handle the error
        //         }
        //         zip.file(filename, data, { binary: true });
        //         count++;
        //         if (count == urls.length) {
        //             zip.generateAsync({ type: 'blob' }).then(function (content) {
        //                 saveAs(content, zipFilename);
        //             });
        //         }
        //     });
        // });

    }



    render() {
        const { currentUser, auth, show, event_name, original_pics, confirm_all_panticipant, count_panticipant_confirm, num_of_panticipant } = this.state
        // เปลี่ยน original_pics.map เป็น medthod ที่คัดรูปเรียบร้อยเเล้ว return array นะ
        let getAllPicture = original_pics.map((pic, index) => {
            return (
                <Image
                    src={pic.original_pic_url}
                    key={index}
                    className="mb-2"
                    fluid
                    rounded
                />
            )
        })

        if (auth) {
            if (currentUser) {
                return (
                    <Fragment>
                        <Nevbar />
                        <Container fluid>
                            <Row className="mb-4">
                                {confirm_all_panticipant ?
                                    <Fragment>
                                        <Col
                                            xs={{ span: 12 }}
                                            sm={{ span: 12 }}
                                            md={{ span: 10, offset: 1 }}
                                            lg={{ span: 10, offset: 1 }}
                                            className="text-center mb-2"
                                        >
                                            <h3>ภาพถ่ายทั้งหมดในกิจกรรม </h3>
                                            <h5>{event_name}</h5>
                                            <p>ภาพถ่ายทั้งหมดได้รับการอนุญาตจากผู้เข้าร่วมงาน ผู้จัดกิจกรรมสามารถนำภาพถ่ายไปใช้งานตามวัตถุประสงค์ได้</p>
                                        </Col>
                                        <Col
                                            xs={{ span: 12 }}
                                            sm={{ span: 12 }}
                                            md={{ span: 10, offset: 1 }}
                                            lg={{ span: 10, offset: 1 }}
                                            className="text-center mb-4"
                                        >
                                            <CardColumns style={{ columnCount: 5 }}>
                                                {getAllPicture}
                                            </CardColumns>
                                        </Col>
                                        <Col
                                            xs={{ span: 12 }}
                                            sm={{ span: 12 }}
                                            md={{ span: 10, offset: 1 }}
                                            lg={{ span: 10, offset: 1 }}
                                            className="text-right"
                                        >
                                            <Button className="btn-custom mr-2" id="primary" onClick={this.downloadFiles}  >
                                                ดาวน์โหลดทั้งหมด
                                            </Button>

                                        </Col>

                                    </Fragment>
                                    :
                                    <Fragment>
                                        <Col
                                            xs={{ span: 12 }}
                                            sm={{ span: 12 }}
                                            md={{ span: 10, offset: 1 }}
                                            lg={{ span: 10, offset: 1 }}
                                            className="text-center mt-4 mb-2"
                                        >
                                            <h2>รอการตรวจสอบภาพถ่ายจากผู้เข้าร่วม</h2>
                                            <p>ไม่สามารถเเสดงภาพถ่ายได้ เนื่องจากผู้เข้าร่วมบางคนยังไม่ได้ทำการยืนยันภาพถ่ายของตนเอง</p>

                                            <div style={{ margin: "50px 0" }}>
                                                <h4 className="mb-3">
                                                    ผู้เข้าร่วมทั้งหมด: {num_of_panticipant} คน |
                                                        ตรวจสอบเเล้ว: {count_panticipant_confirm} คน
                                                </h4>
                                                <p>สามารถกดปุ่มด้านล่างเพื่อสิ้นสุดกระบวนการขออนุญาตจากผู้เข้าร่วมได้ โดยรูปที่รอการตรวจสอบจะถือว่าผู้เข้าร่วมไม่อนุญาตให้ใช้ภาพถ่ายนั้นๆ</p>
                                            </div>
                                            <Button className="btn-custom py-3 px-4" id="primary" onClick={this.handleShow} style={{ fontSize: 18 }} >
                                                สิ้นสุดกระบวนการ
                                            </Button>
                                        </Col>

                                        <Modal show={show} onHide={this.handleClose}>
                                            <Modal.Header closeButton>
                                                <Modal.Title>ยืนยันการสิ้นสุดกระบวนการ</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body>
                                                <p>คุณต้องการสิ้นสุดกระบวนการขออนุญาตขออนุญาตใช้ภาพถ่ายใช่หรือไม่ (ไม่สามารถแก้ไขภายหลังได้)</p>
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
                                    </Fragment>
                                }
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
                <Loading />
            )
        }
    }
}
export default DownloadPictureOfEvent