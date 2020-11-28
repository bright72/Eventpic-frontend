import React, { Component, Fragment } from 'react'
import { Link, withRouter, Redirect } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap'
import Nevbar from './Nevbar.js'
import Loading from './Loading.js'
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
            firebase.database().ref("organizers").orderByChild("email").equalTo(user.email)
                .on("child_added", function (snapshot) {
                    const itemsRef = firebase.database().ref(`/organizers/${snapshot.key}/events`)
                    itemsRef.child(self.props.match.params.id).on("value", (snapshot) => {
                        let value = snapshot.val()
                        self.setState({
                            event_id: self.props.match.params.id,
                            name: value.name,
                            detail: value.detail,
                            start_date: value.start_date,
                            end_date: value.end_date,
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
        const { name, start_date, end_date, detail, event_id, dateline } = this.state
        if (name && start_date && end_date && detail === '') {
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
            firebase.database().ref("organizers").orderByChild("email").equalTo(this.state.currentUser.email)
                .on("child_added", function (snapshot) {
                    keypath = snapshot.key
                })
            const itemsRef = firebase.database().ref(`organizers/${keypath}/events`)
            const item = {
                name,
                detail,
                start_date,
                end_date,
                dateline
            }
            itemsRef.push(item)
            this.setState({
                event_id: '',
                name: '',
                detail: '',
                start_date: '',
                end_date: '',
                dateline: ''
            })

        }
    }

    handleUpdate = (event_id = null, name = null, start_date = null, end_date = null, detail = null, dateline = null) => {
        this.setState({ event_id, name, start_date, end_date, detail, dateline })
    }

    updateItem = () => {
        const { name, start_date, end_date, detail, dateline } = this.state
        const obj = {
            name,
            start_date,
            end_date,
            detail,
            dateline
        }

        let keypath = ""
        firebase.database().ref("organizers").orderByChild("email").equalTo(this.state.currentUser.email)
            .on("child_added", function (snapshot) {
                keypath = snapshot.key
            })
        const itemsRef = firebase.database().ref(`organizers/${keypath}/events`)
        itemsRef.child(this.state.event_id).update(obj);

        this.setState({
            event_id: '',
            name: '',
            detail: '',
            start_date: '',
            end_date: '',
            dateline: ''
        })
        this.props.history.push('/MoreDetail/' + this.state.event_id);
    }


    render() {
        const { currentUser, auth } = this.state
        if (auth) {
            if (currentUser) {
                return (
                    <Fragment>
                        <Nevbar />
                        <Container fluid >
                            <Row>
                                <Col
                                    xs={12}
                                    sm={{ span: 10, offset: 1 }}
                                    md={{ span: 8, offset: 2 }}
                                    lg={{ span: 4, offset: 4 }}
                                    style={{ marginTop: 20 }}
                                >
                                    <Card className="form-card p-2">
                                        <h1 className="title-lable my-4 text-center text-uppercase">แก้ไขกิจกรรม </h1>
                                        <Form onSubmit={this.handleSubmit} className="form px-4">
                                            <Label className="title-lable text-center text-uppercase">ชื่อกิจกรรม</Label>
                                            <Group>
                                                <Control className="form form-input" id="form-input" name="name" value={this.state.name} onChange={this.handleChange} type="text" placeholder="ชื่อกิจกรรม" />
                                            </Group>
                                            <Form.Group controlId="exampleForm.ControlTextarea1">
                                                <Form.Label className="title-lable text-center text-uppercase">รายละเอียดกิจกรรม</Form.Label>
                                                <Form.Control className="form form-input" id="form-input" name="detail" value={this.state.detail} onChange={this.handleChange} type="text" placeholder="รายละเอียดกิจกรรม" as="textarea" rows="5" />
                                            </Form.Group>
                                            <Form.Row>
                                                <Col>
                                                    <Label className="title-lable text-center text-uppercase">วันเริ่มงาน</Label>
                                                    <Group>
                                                        <Control className="form form-input" id="form-input" name="start_date" value={this.state.start_date} onChange={this.handleChange} type="date" placeholder="วันเริ่มงาน" />
                                                    </Group>
                                                </Col>
                                                <Col>
                                                    <Label className="title-lable text-center text-uppercase">วันสิ้นสุดงาน</Label>
                                                    <Group>
                                                        <Control className="form form-input" id="form-input" name="end_date" value={this.state.end_date} onChange={this.handleChange} type="date" placeholder="วันสิ้นสุดงาน" />
                                                    </Group>
                                                </Col>
                                            </Form.Row>
                                            <Label className="title-lable text-center text-uppercase">วันสิ้นสุดการขออนุญาตภาพถ่าย</Label>
                                            <Group>
                                                <Control className="form form-input" id="form-input" name="dateline" value={this.state.dateline} onChange={this.handleChange} type="date" placeholder="วันสิ้นสุดการขออนุญาตภาพถ่าย" />
                                            </Group>
                                            <Row className="mb-4 text-center" style={{ marginTop: "35px" }}>
                                                <Col>
                                                    <Link to={"/MoreDetail/" + this.state.event_id} >
                                                        <Button className="btn-custom text-uppercase m-1" id="secondary" >
                                                            ยกเลิก
                                                                    </Button>
                                                    </Link>
                                                    <Button variant="dark" className="btn-custom text-uppercase m-1" id="primary" onClick={this.handleSubmit} >
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
                <Loading/>
            )
        }

    }
}


export default withRouter(EditEvent);



