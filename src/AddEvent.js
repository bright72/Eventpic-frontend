import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap'
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
                    <Container fluid >
                        <Nevbar />
                        <Row className=" m-4">
                            <Col
                                xs={12}
                                sm={{ span: 10 }}
                                md={{ span: 4, offset: 2 }}
                                lg={{ span: 6, offset: 3 }}
                                className="p-5 Loginbox"
                            >
                                <h2 className="text-center mt-2"> Add Event</h2>
                                <Form noValidate validated={validate} onSubmit={this.handleSubmit} className="mt-4">
                                    <Label>Name of Event</Label>
                                    <Form.Group >
                                        <Form.Control name="name" value={this.state.name} onChange={this.handleChange} type="text" placeholder="Name of Event" required />
                                        <Form.Control.Feedback type="invalid">
                                            Please Enter Name of Event
                                    </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group controlId="exampleForm.ControlTextarea1">
                                        <Form.Label>Detail of event</Form.Label>
                                        <Form.Control name="detail" value={this.state.detail} onChange={this.handleChange} type="text" placeholder="Detail of event" as="textarea" rows="3" required />
                                        <Form.Control.Feedback type="invalid">
                                            Please Enter Detail of event
                                    </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Row>
                                        <Col>
                                            <Label>Start Date of Event</Label>
                                            <Form.Group >
                                                <Form.Control name="start_date" value={this.state.start_date} onChange={this.handleChange} type="date" placeholder="Date of Event" required />
                                                <Form.Control.Feedback type="invalid">
                                                    Please Select Start Date of Event
                                    </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Label>End Date of Event</Label>
                                            <Form.Group >
                                                <Form.Control name="end_date" value={this.state.end_date} onChange={this.handleChange} type="date" placeholder="Date of Event" required />
                                                <Form.Control.Feedback type="invalid">
                                                    Please Select End Date of Event
                                    </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                    </Form.Row>
                                    <Form.Row>
                                        <Col>
                                            <Label>Start Time of Event</Label>
                                            <Form.Group >
                                                <Form.Control name="start_time" value={this.state.start_time} onChange={this.handleChange} type="time" placeholder="Date of Event" required />
                                                <Form.Control.Feedback type="invalid">
                                                    Please Select Start Time of Event
                                    </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Label>End Time of Event</Label>
                                            <Form.Group >
                                                <Form.Control name="end_time" value={this.state.end_time} onChange={this.handleChange} type="time" placeholder="Date of Event" required />
                                                <Form.Control.Feedback type="invalid">
                                                    Please Select End Time of Event
                                    </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                    </Form.Row>
                                    <Label>Dateline</Label>
                                    <Form.Group >
                                        <Form.Control name="dateline" value={this.state.dateline} onChange={this.handleChange} type="date" placeholder="Dateline" required />
                                        <Form.Control.Feedback type="invalid">
                                            Please Select Dateline
                                    </Form.Control.Feedback>
                                    </Form.Group>
                                    <Button variant="dark" block className=" mt-4 btn-custom" type="submit" >
                                        Submit Event
                                    </Button>
                                </Form>
                            </Col>
                        </Row>
                    </Container>
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




