import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { Form, Button, Container, Row, Col, Alert, Card } from 'react-bootstrap'
import Nevbar from './Nevbar.js'
import './Style.css'
import firebase from './firebase'
import { withRouter } from 'react-router-dom'

const { Group, Label, Control } = Form

class AddEvent extends Component {
    constructor() {
        super();
        this.state = {
            event_id: '',
            name: '',
            detail: '',
            start_date: '',
            end_date: '',
            start_time: '',
            end_time: '',
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
        const { name, start_date, end_date, start_time, end_time, detail, dateline, showAlert } = this.state
        const form = e.currentTarget
        if (form.checkValidity() === true) {
            if (start_date > end_date || start_date > dateline || end_date > dateline) {
                alert("กรอกวันที่ให้ถูกต้องด้วยอิสัส")
            } else {
                let keypath = ""
                firebase.database().ref("user").orderByChild("email").equalTo(this.state.currentUser.email)
                    .on("child_added", function (snapshot) {
                        keypath = snapshot.key
                    })
                const itemsRef = firebase.database().ref(`user/${keypath}/event`)
                const item = {
                    name: name,
                    detail: detail,
                    start_date: start_date,
                    end_date: end_date,
                    start_time: start_time,
                    end_time: end_time,
                    dateline: dateline,
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
        const { currentUser, auth, validate, showAlert } = this.state
        if (auth) {
            if (currentUser) {
                return (
                    <div>
                        <Nevbar />
                        <Container fluid className="">
                            {/* <Nevbar /> */}
                            <Row className="">
                                <Col
                                    xs={12}
                                    sm={{ span: 10 }}
                                    md={{ span: 4, offset: 4 }}
                                    lg={{ span: 4, offset: 4 }}
                                    className="padding-from-nav pt-sm-5 mb-5"
                                >
                                    <Card className="form-card">
                                        <Row>
                                            <Col>
                                                <h2 className="title-lable mt-6 mb-5 text-center text-uppercase" id="card-title"> Add Event</h2>
                                                <Form noValidate validated={validate} onSubmit={this.handleSubmit} className="form ml-4 mr-4 mb-5 pl-5 pr-5">
                                                    <Form.Label className="title-lable mt-5 text-center text-uppercase">Name of Event</Form.Label>
                                                    <Form.Group >
                                                        <Form.Control className="form" id="form-input" name="name" value={this.state.name} onChange={this.handleChange} type="text" placeholder="Name of Event" required />
                                                        <Form.Control.Feedback type="invalid">
                                                            Please Enter Name of Event
                                                        </Form.Control.Feedback>
                                                    </Form.Group>
                                                    <Form.Label className="title-lable text-center text-uppercase">Detail of event</Form.Label>
                                                    <Form.Group controlId="exampleForm.ControlTextarea1">
                                                        <Form.Control className="form" id="form-input" name="detail" value={this.state.detail} onChange={this.handleChange} type="text" placeholder="Detail of event" as="textarea" rows="5" required />
                                                        <Form.Control.Feedback type="invalid">
                                                            Please Enter Detail of event
                                                        </Form.Control.Feedback>
                                                    </Form.Group>
                                                    <Form.Row>
                                                        <Col>
                                                            <Form.Label className="title-lable text-center text-uppercase">Start Date of Event</Form.Label>
                                                            <Form.Group >
                                                                <Form.Control className="form" id="form-input" name="start_date" value={this.state.start_date} onChange={this.handleChange} type="date" placeholder="Date of Event" required />
                                                                <Form.Control.Feedback type="invalid">
                                                                    Please Select Start Date of Event
                                                                </Form.Control.Feedback>
                                                            </Form.Group>
                                                        </Col>
                                                        <Col>
                                                            <Form.Label className="title-lable text-center text-uppercase">End Date of Event</Form.Label>
                                                            <Form.Group >
                                                                <Form.Control className="form" id="form-input" name="end_date" value={this.state.end_date} onChange={this.handleChange} type="date" placeholder="Date of Event" required />
                                                                <Form.Control.Feedback type="invalid">
                                                                    Please Select End Date of Event
                                                                </Form.Control.Feedback>
                                                            </Form.Group>
                                                        </Col>
                                                    </Form.Row>
                                                    <Form.Row>
                                                        <Col>
                                                            <Form.Label className="title-lable text-center text-uppercase">Start Time</Form.Label>
                                                            <Form.Group >
                                                                <Form.Control className="form" id="form-input" name="start_time" value={this.state.start_time} onChange={this.handleChange} type="time" placeholder="Date of Event" required />
                                                                <Form.Control.Feedback type="invalid">
                                                                    Please Select Start Time of Event
                                                                </Form.Control.Feedback>
                                                            </Form.Group>
                                                        </Col>
                                                        <Col>
                                                            <Form.Label className="title-lable text-center text-uppercase">End Time</Form.Label>
                                                            <Form.Group >
                                                                <Form.Control className="form" id="form-input" name="end_time" value={this.state.end_time} onChange={this.handleChange} type="time" placeholder="Date of Event" required />
                                                                <Form.Control.Feedback type="invalid">
                                                                    Please Select End Time of Event
                                                                </Form.Control.Feedback>
                                                            </Form.Group>
                                                        </Col>
                                                    </Form.Row>
                                                    <Form.Label className="title-lable text-center text-uppercase">Dateline</Form.Label>
                                                    <Form.Group >
                                                        <Form.Control className="form" id="form-input" name="dateline" value={this.state.dateline} onChange={this.handleChange} type="date" placeholder="Dateline" required />
                                                        <Form.Control.Feedback type="invalid">
                                                            Please Select Dateline
                                                        </Form.Control.Feedback>
                                                    </Form.Group>
                                                    <div className="text-center">
                                                        <Row>
                                                            <Col className="text-right">
                                                                <Link to="/ListofEvent"><Button variant="dark" id="secondary" className="btn-custom mt-5 mb-4 text-uppercase">
                                                                    Cancle
                                                                </Button></Link>
                                                            </Col>
                                                            <Col className="text-left">
                                                                <Button variant="dark" id="primary" className="btn-custom mt-5 mb-4 text-uppercase" type="submit" >
                                                                    Submit
                                                                </Button>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                </Form>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                            </Row>
                        </Container>
                    </div>
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

export default withRouter(AddEvent);




