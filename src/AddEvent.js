import React, { Component, Fragment } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap'
import Nevbar from './Nevbar.js'
import Loading from './Loading.js'
import './Style.css'
import firebase from './firebase'
import { withRouter } from 'react-router-dom'

class AddEvent extends Component {
    constructor() {
        super();
        this.state = {
            event_id: '',
            name: '',
            detail: '',
            start_date: '',
            end_date: '',
            dateline: '',
            currentUser: null,
            auth: false,
            validate: false,
            showAlert: false
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.setState({
                    currentUser: user
                })
            }
            this.setState({
                auth: true
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
        e.preventDefault()
        const { name, start_date, end_date, detail, dateline } = this.state
        const form = e.currentTarget
        if (form.checkValidity() === true) {
            if (start_date > end_date || start_date > dateline || end_date > dateline) {
                alert("Incorrect Date!!")
            } else {
                let keypath = ""
                firebase.database().ref("organizers").orderByChild("email").equalTo(this.state.currentUser.email)
                    .on("child_added", function (snapshot) {
                        keypath = snapshot.key
                    })
                const itemsRef = firebase.database().ref(`organizers/${keypath}/events`)
                const item = {
                    name: name,
                    start_date: start_date,
                    end_date: end_date,
                    dateline: dateline,
                    detail: detail,
                }
                itemsRef.push(item)
                this.props.history.push('/ListofEvent/' + this.state.event_id)
            }
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
                                    xxs={12}
                                    sm={{ span: 10, offset: 1 }}
                                    md={{ span: 8, offset: 2 }}
                                    lg={{ span: 4, offset: 4 }}
                                    style={{ marginTop: 20 }}
                                >
                                    <Card className="form-card p-2">
                                        <h1 className="title-lable my-4 text-center text-uppercase">เพิ่มกิจกรรม</h1>
                                        <Form noValidate validated={validate} onSubmit={this.handleSubmit} className="form px-4">
                                            <Form.Label className="title-lable text-center text-uppercase">ชื่อกิจกรรม</Form.Label>
                                            <Form.Group >
                                                <Form.Control className="form form-input" id="form-input" name="name" value={this.state.name} onChange={this.handleChange} type="text" placeholder="ชื่อกิจกรรม" required />
                                                <Form.Control.Feedback type="invalid">
                                                    กรุณากรอกชื่อกิจกรรม
                                                        </Form.Control.Feedback>
                                            </Form.Group>
                                            <Form.Label className="title-lable text-center text-uppercase">รายละเอียดกิจกรรม</Form.Label>
                                            <Form.Group controlId="exampleForm.ControlTextarea1">
                                                <Form.Control className="form form-input" id="form-input" name="detail" value={this.state.detail} onChange={this.handleChange} type="text" placeholder="รายละเอียดกิจกรรม" as="textarea" rows="5" required />
                                                <Form.Control.Feedback type="invalid">
                                                    กรุณากรอกรายละเอียดกิจกรรม
                                                        </Form.Control.Feedback>
                                            </Form.Group>
                                            <Form.Row>
                                                <Col>
                                                    <Form.Label className="title-lable text-center text-uppercase">วันเริ่มงาน</Form.Label>
                                                    <Form.Group >
                                                        <Form.Control className="form form-input" id="form-input" name="start_date" value={this.state.start_date} onChange={this.handleChange} type="date" placeholder="Date of Event" required />
                                                        <Form.Control.Feedback type="invalid">
                                                            กรุณากรอกวันเริ่มงาน
                                                                </Form.Control.Feedback>
                                                    </Form.Group>
                                                </Col>
                                                <Col>
                                                    <Form.Label className="title-lable text-center text-uppercase">วันสิ้นสุดงาน</Form.Label>
                                                    <Form.Group >
                                                        <Form.Control className="form form-input" id="form-input" name="end_date" value={this.state.end_date} onChange={this.handleChange} type="date" placeholder="วันสิ้นสุดงาน" required />
                                                        <Form.Control.Feedback type="invalid">
                                                            กรุณากรอกวันสิ้นสุดงาน
                                                                </Form.Control.Feedback>
                                                    </Form.Group>
                                                </Col>
                                            </Form.Row>
                                            <Form.Label className="title-lable text-center text-uppercase">วันสิ้นสุดการขออนุญาตภาพถ่าย</Form.Label>
                                            <Form.Group >
                                                <Form.Control className="form form-input" id="form-input" name="dateline" value={this.state.dateline} onChange={this.handleChange} type="date" placeholder="วันสิ้นสุดการขออนุญาตภาพถ่าย" required />
                                                <Form.Control.Feedback type="invalid">
                                                    กรุณากรอกวันสิ้นสุดการขออนุญาตภาพถ่าย
                                                        </Form.Control.Feedback>
                                            </Form.Group>
                                            <Row className="mb-4 text-center" style={{ marginTop: "35px" }}>
                                                <Col>
                                                    <Link to="/ListofEvent"><Button className="btn-custom text-uppercase m-1" id="secondary" >
                                                        ยกเลิก
                                                                </Button></Link>
                                                    <Button className="btn-custom text-uppercase m-1" id="primary" type="submit" >
                                                        ยืนยัน
                                                                </Button>
                                                </Col>
                                            </Row>
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
                <Loading />
            )
        }

    }
}

export default withRouter(AddEvent);




