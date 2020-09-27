import React, { Component } from 'react'
import { Link, withRouter, Redirect } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap'
import Nevbar from './Nevbar.js'
import './Style.css'
import firebase from './firebase'

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
        firebase.auth().onAuthStateChanged(user => {
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
        if (name && start_date && end_date && start_time && end_time && detail === '') {
            // return this.updateItem();
            alert("กรุณากรอกรายละเอียดให้ครบถ้วน :)")
        } else if (event_id !== '') {
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
                    <div>
                        <Nevbar />
                        <Container fluid >
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
                                                <h2 className="title-lable mt-6 mb-5 text-center text-uppercase" id="card-title"> Edit Event</h2>
                                                <Form onSubmit={this.handleSubmit} className="form ml-4 mr-4 mb-5 pl-5 pr-5">
                                                    <Label className="title-lable mt-5 text-center text-uppercase">Name of Event</Label>
                                                    <Group>
                                                        <Control className="form" id="form-input" name="name" value={this.state.name} onChange={this.handleChange} type="text" placeholder="Name of Event" />
                                                    </Group>
                                                    <Form.Group controlId="exampleForm.ControlTextarea1">
                                                        <Form.Label className="title-lable text-center text-uppercase">Detail of event</Form.Label>
                                                        <Form.Control className="form" id="form-input" name="detail" value={this.state.detail} onChange={this.handleChange} type="text" placeholder="Detail of event" as="textarea" rows="5" />
                                                    </Form.Group>
                                                    <Form>
                                                        <Form.Row>
                                                            <Col>
                                                                <Label className="title-lable text-center text-uppercase">Start date of Event</Label>
                                                                <Control className="form" id="form-input" name="start_date" value={this.state.start_date} onChange={this.handleChange} type="date" placeholder="Date of Event" />
                                                            </Col>
                                                            <Col>
                                                                <Label className="title-lable text-center text-uppercase">End date of Event</Label>
                                                                <Control className="form" id="form-input" name="end_date" value={this.state.end_date} onChange={this.handleChange} type="date" placeholder="Date of Event" />
                                                            </Col>
                                                        </Form.Row>
                                                    </Form>
                                                    <Form>
                                                        <Form.Row>
                                                            <Col>
                                                                <Label className="title-lable text-center text-uppercase">Start time of Event</Label>
                                                                <Control className="form" id="form-input" name="start_time" value={this.state.start_time} onChange={this.handleChange} type="time" placeholder="Date of Event" />
                                                            </Col>
                                                            <Col>
                                                                <Label className="title-lable text-center text-uppercase">End time of Event</Label>
                                                                <Control className="form" id="form-input" name="end_time" value={this.state.end_time} onChange={this.handleChange} type="time" placeholder="Date of Event" />
                                                            </Col>
                                                        </Form.Row>
                                                    </Form>
                                                    <Label className="title-lable text-center text-uppercase">Dateline</Label>
                                                    <Group >
                                                        <Control className="form" id="form-input" name="dateline" value={this.state.dateline} onChange={this.handleChange} type="date" placeholder="Dateline" />
                                                    </Group>
                                                    <div className="text-center">
                                                        <Row>
                                                            <Col className="text-right">
                                                                <Link to={"/MoreDetail/" + this.state.event_id} className="btn-link">
                                                                    <Button className="btn-custom mt-5 mb-4 text-uppercase" id="secondary" >
                                                                        CANCLE
                                                                    </Button>
                                                                </Link>
                                                            </Col>
                                                            <Col className="text-left">
                                                                <Button variant="dark" className="btn-custom mt-5 mb-4 text-uppercase" id="primary" onClick={this.handleSubmit} >
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
                <div> Loading</div>
            )
        }

    }
}


export default withRouter(EditEvent);



