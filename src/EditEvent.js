import React, { Component } from 'react'
import { withRouter, Redirect } from 'react-router-dom';
import { Form, Button, Container, Row, Col } from 'react-bootstrap'
import Nevbar from './Nevbar.js'
import './Style.css'
import firebase, { database } from './firebase/indexstore'
import auth from './firebase/index'
import Login from './LoginForm.js'

const { Group, Label, Control } = Form

class EditEvent extends Component {
    constructor() {
        super();
        this.state = {
            events: [],
            event_id: '',
            name: '',
            detail: '',
            start_date: '',
            end_date: '',
            start_time: '',
            end_time: '',
            dateline: '',
            currentUser: null,
            auth: false
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleUpdate = this.handleUpdate.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)

    }

    componentDidMount() {
        auth.onAuthStateChanged(user => {
            if (user) {
                this.setState({
                    currentUser: user
                })
            }
            this.setState({
                auth: true
            })
            let self = this
            firebase.database().ref("user").orderByChild("email").equalTo(user.email)
                .on("child_added", function (snapshot) {
                    const itemsRef = firebase.database().ref(`/user/${snapshot.key}/event`)
                    itemsRef.child(self.props.match.params.id).on("value", (snapshot) => {
                        let value = snapshot.val()
                        self.setState({
                            event_id: self.props.match.params.id,
                            name: value.name,
                            detail: value.detail,
                            start_date: value.start_date,
                            end_date: value.end_date,
                            start_time: value.start_time,
                            end_time: value.end_time,
                            dateline: value.dateline
                        })
                    })
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
        e.preventDefault();
        const { name, start_date, end_date, start_time, end_time, detail, event_id, dateline } = this.state
        if (name && start_date && end_date && start_time && end_time && detail == '') {
            // return this.updateItem();
            alert("กรุณากรอกรายละเอียดให้ครบถ้วน :)")
        } else if (event_id != '') {
            if (start_date > end_date || start_date > dateline || end_date > dateline) {
                alert("กรุณากรอกวันที่ให้ถูกต้อง")
            }
            return this.updateItem();
        } else if (start_date > end_date || start_date > dateline || end_date > dateline) {
            alert("กรุณากรอกวันที่ให้ถูกต้อง")
        } else {
            let keypath = ""
            firebase.database().ref("user").orderByChild("email").equalTo(this.state.currentUser.email)
                .on("child_added", function (snapshot) {
                    console.log("นี่คือคีย์")
                    console.log(snapshot.key)
                    keypath = snapshot.key
                })
            const itemsRef = firebase.database().ref(`user/${keypath}/event`)
            const item = {
                name,
                detail,
                start_date,
                end_date,
                start_time,
                end_time,
                dateline
            }
            itemsRef.push(item)
            this.setState({
                event_id: '',
                name: '',
                detail: '',
                start_date: '',
                end_date: '',
                start_time: '',
                end_time: '',
                dateline: ''
            })

        }
    }

    handleUpdate = (event_id = null, name = null, start_date = null, end_date = null, start_time = null, end_time = null, detail = null, dateline = null) => {
        this.setState({ event_id, name, start_date, end_date, start_time, end_time, detail, dateline })
    }

    updateItem = () => {
        const { name, start_date, end_date, start_time, end_time, detail, dateline } = this.state
        const obj = {
            name,
            start_date,
            end_date,
            start_time,
            end_time,
            detail,
            dateline
        }

        let keypath = ""
        firebase.database().ref("user").orderByChild("email").equalTo(this.state.currentUser.email)
            .on("child_added", function (snapshot) {
                console.log("นี่คือคีย์")
                console.log(snapshot.key)
                keypath = snapshot.key
            })
        const itemsRef = firebase.database().ref(`user/${keypath}/event`)

        itemsRef.child(this.state.event_id).update(obj);

        this.setState({
            event_id: '',
            name: '',
            detail: '',
            start_date: '',
            end_date: '',
            start_time: '',
            end_time: '',
            dateline: ''
        })
        this.props.history.push('/MoreDetail/' + this.state.event_id);
    }


    render() {
        const { currentUser, auth } = this.state
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
                                <h1 className="text-center mt-2"> Edit Event</h1>
                                <Form onSubmit={this.handleSubmit} className="mt-4">
                                    <Label>Name of Event</Label>
                                    <Group >
                                        <Control name="name" value={this.state.name} onChange={this.handleChange} type="text" placeholder="Name of Event" />
                                    </Group>
                                    <Form.Group controlId="exampleForm.ControlTextarea1">
                                        <Form.Label>Detail of event</Form.Label>
                                        <Form.Control name="detail" value={this.state.detail} onChange={this.handleChange} type="text" placeholder="Detail of event" as="textarea" rows="3" />
                                    </Form.Group>
                                    <Form>
                                        <Form.Row>
                                            <Col>
                                                <Label>Start date of Event</Label>
                                                <Control name="start_date" value={this.state.start_date} onChange={this.handleChange} type="date" placeholder="Date of Event" />
                                            </Col>
                                            <Col>
                                                <Label>End date of Event</Label>
                                                <Control name="end_date" value={this.state.end_date} onChange={this.handleChange} type="date" placeholder="Date of Event" />
                                            </Col>
                                        </Form.Row>
                                    </Form>
                                    <Form>
                                        <Form.Row>
                                            <Col>
                                                <Label>Start time of Event</Label>
                                                <Control name="start_time" value={this.state.start_time} onChange={this.handleChange} type="time" placeholder="Date of Event" />
                                            </Col>
                                            <Col>
                                                <Label>End time of Event</Label>
                                                <Control name="end_time" value={this.state.end_time} onChange={this.handleChange} type="time" placeholder="Date of Event" />
                                            </Col>
                                        </Form.Row>
                                    </Form>
                                    <Label>Dateline</Label>
                                    <Group >
                                        <Control name="dateline" value={this.state.dateline} onChange={this.handleChange} type="date" placeholder="Dateline" />
                                    </Group>

                                    <Button variant="dark" block className=" mt-4 btn-custom" onClick={this.handleSubmit} >
                                        Submit Edit Event
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
                <div> Loading</div>
            )
        }

    }
}


export default withRouter(EditEvent);



