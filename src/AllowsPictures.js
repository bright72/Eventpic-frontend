import React, { Component, Fragment } from 'react'
import { Button, Card, Container, Row, Col, Modal, CardColumns, Form, Spinner } from 'react-bootstrap'
import firebase from './firebase/index'

class AllowsPictures extends Component {

    state = {
        participant_id: this.props.match.params.participant_id,
        event_id: this.props.match.params.event_id,
        organize_id: this.props.match.params.organize_id,
        pictures: [],
        selectPictures: [],
        show: false,
        pictureChecked: false,
    }

    async componentWillMount() {
        await this.checkPanticipantPictureConfirm()
        await this.getAllPictureOfPaticipant()
    }

    checkPanticipantPictureConfirm() {
        const { event_id, organize_id, participant_id } = this.state
        const databaseRef = firebase.database().ref(`organizers/${organize_id}/events/${event_id}/participants/${participant_id}`)
        databaseRef.on('value', snapshot => {
            let values = snapshot.val()
            this.setState({
                pictureChecked: values.panticipant_picture_confirm
            })
        })
    }

    getAllPictureOfPaticipant() {
        const { event_id, organize_id, participant_id } = this.state
        const databaseRef = firebase.database().ref(`organizers/${organize_id}/events/${event_id}/participants/${participant_id}/processed_pic`)
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

    handleChange = e => {
        const { selectPictures } = this.state
        const { value } = e.target
        console.log(value)
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
        const { organize_id, event_id, participant_id, selectPictures } = this.state
        e.preventDefault()
        console.log(selectPictures)
        if (selectPictures.length !== 0) {
            const panticipantImageRef = firebase.database().ref(`organizers/${organize_id}/events/${event_id}/participants/${participant_id}/processed_pic`)
            const panticipantComfirm = firebase.database().ref(`organizers/${organize_id}/events/${event_id}/participants`)
            let panticipantImage = {
                is_allow: true,
            }
            let confirm = {
                panticipant_picture_confirm: true,
            }
            selectPictures.forEach(pic => {
                let imageOfPanticipant = pic
                panticipantImageRef.child(imageOfPanticipant).update(panticipantImage)
                panticipantComfirm.child(participant_id).update(confirm)
            })
        }
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

    render() {
        const { pictures, pictureChecked, selectPictures, show, loading } = this.state
        //รูปทั้งหมดในอีเว่น
        let ListCheckPicture = pictures.map((pic, index) => {
            return (
                <Card key={index} >
                    <Card.Img variant="top" src={pic.processed_url} />
                    <div id="picture-panticipant">
                        <Form.Check type="checkbox" id="panticipant" name={"checkbox-" + index} value={pic.processed_id} onChange={this.handleChange} />
                    </div>
                </Card>
            )
        })

        return (
            <Fragment>
                <Container fluid>
                    <Row className="mb-4">
                        { pictureChecked ?
                         <Col
                                xs={{ span: 12 }}
                                sm={{ span: 8, offset: 2 }}
                                md={{ span: 8, offset: 2 }}
                                lg={{ span: 8, offset: 2 }}
                                className="text-center"
                            >
                                <h1 className="mb-4">ท่านได้ทำการคัดเลือกรูปเรียบร้อยเเล้ว</h1>
                                <h4>ขอบคุณสำหรับการอนุญาตให้นำภาพถ่ายภายในกิจกรรมไปใช้ในการประชาสัมพันธ์</h4>
                            </Col>
                            :
                            <Fragment>
                                <Col
                                    xs={{ span: 12 }}
                                    sm={{ span: 8, offset: 2 }}
                                    md={{ span: 8, offset: 2 }}
                                    lg={{ span: 8, offset: 2 }}
                                >
                                    <h2 className="text-center mb-4">กรุณาเลือกรูปที่ท่าน "อนุญาต" ให้นำไปใช้ในการประชาสัมพันธ์</h2>
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
                                        อนุญาต
                                    </Button>
                                    <Modal show={show} onHide={this.handleClose}>
                                        <Modal.Header closeButton>
                                            <Modal.Title>Confirm Your Photo</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            {selectPictures.length !== 0 ? `ทุกรูปที่ท่านเลือกอาจถูกนำไปใช้ในการประชาสัมพันธ์ ท่านตรวจสอบรูปภาพเรียบร้อยเเล้วใช่หรือไม่ (หากยืนยันเเล้วไม่สามารถแก้ไขภายหลังได้)` : `ท่านไม่อนุญาตให้ทางผู้จัดนำรูปไปใช้ในการประสัมพันธ์เลยใช่หรือไม่`}
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
                                </Col>
                            </Fragment>
                        }
                    </Row>
                </Container>
            </Fragment >
        )
    }
}
export default AllowsPictures