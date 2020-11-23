import React, { Component, Fragment } from 'react'
import { Button, Card, Container, Row, Col, Modal, CardColumns, Form } from 'react-bootstrap'
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
        this.checkPanticipantPictureConfirm()
        this.getAllPictureOfPaticipant()
    }

    checkPanticipantPictureConfirm() {
        const { event_id, organize_id, participant_id } = this.state
        const databaseRef = firebase.database().ref(`user/${organize_id}/event/${event_id}/participant/${participant_id}`)
        databaseRef.on('value', snapshot => {
            let values = snapshot.val()
            this.setState({
                pictureChecked: values.panticipant_picture_confirm
            })
        })
    }

    getAllPictureOfPaticipant() {
        const { event_id, organize_id, participant_id } = this.state
        const databaseRef = firebase.database().ref(`user/${organize_id}/event/${event_id}/participant/${participant_id}/images`)
        databaseRef.on('value', snapshot => {
            let pictures = snapshot.val()
            let tempRows = []
            for (const property in pictures) {
                let row = {
                    id: property,
                    metadata: pictures[property]
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
        const { organize_id, event_id, participant_id, selectPictures } = this.state
        e.preventDefault()
        if (selectPictures.length !== 0) {
            const ImageRef = firebase.database().ref(`user/${organize_id}/event/${event_id}/images`)
            const panticipantImageRef = firebase.database().ref(`user/${organize_id}/event/${event_id}/participant/${participant_id}/images`)
            const panticipantComfirm = firebase.database().ref(`user/${organize_id}/event/${event_id}/participant`)
            let panticipantImage = {
                is_allow: false,
            }
            let image = {
                is_allow_all_panticipant: false,
            }
            let confirm = {
                panticipant_picture_confirm: true,
            }
            selectPictures.forEach(pic => {
                let index = pic.indexOf(",")
                let imageOfPanticipant = pic.slice(0, index)
                let rootImage = pic.slice(index + 1)
                ImageRef.child(rootImage).update(image)
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
        const { pictures, pictureChecked, selectPictures, show } = this.state
        //รูปทั้งหมดในอีเว่น
        let ListCheckPicture = pictures.map((pic, index) => {
            return (
                <Card key={index} >
                    <Card.Img variant="top" src={pic.metadata.orginal_image_url} />
                    <div id="picture-panticipant">
                        <Form.Check type="checkbox" id="panticipant" name={"checkbox-" + index} value={[pic.id, pic.metadata.id]} onChange={this.handleChange} />
                    </div>
                </Card>
            )
        })

        return (
            <Fragment>
                {/* <Nevbar /> */}
                <Container fluid>
                    <Row className="mb-4">
                        {pictureChecked ?
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
                                    <h2 className="text-center mb-4">กรุณาเลือกรูปที่ท่าน "ไม่อนุญาต" ให้นำไปใช้ในการประชาสัมพันธ์</h2>
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
                            </Fragment>
                        }
                    </Row>
                </Container>
            </Fragment >
        )
    }
}
export default AllowsPictures