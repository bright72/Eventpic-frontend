import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Container, Row, Col } from 'react-bootstrap'
import Nevbar from './Nevbar.js'
import './Style.css'
import List from './List';
import firebase, { database } from './firebase/index';
import { withRouter } from 'react-router-dom';

const {Group, Label, Control} = Form

class AddEvent extends Component {
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
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleUpdate = this.handleUpdate.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)

    }

    componentDidMount() {
        const itemsRef = firebase.database().ref('events');
        itemsRef.on('value', (snapshot) => {
            let events = snapshot.val();
            let newState = [];
            for (let item in events) {
                newState.push({
                    event_id: item,
                    name: events[item].name,
                    detail: events[item].detail,
                    start_date: events[item].start_date,
                    end_date: events[item].end_date,
                    start_time: events[item].start_time,
                    end_time: events[item].end_time,
                    dateline: events[item].dateline
                })
            }
            this.setState({
                events: newState
            })
        })
    }

    handleChange = e => {
        const {name, value} = e.target
        this.setState({
            [name]: value
        })
    }

    handleSubmit = e => {
        e.preventDefault();
        const {name, start_date, end_date, start_time, end_time, detail, event_id, dateline} = this.state
        if (name && start_date && end_date && start_time && end_time && detail == '') {
            // return this.updateItem();
            alert("กรุณากรอกรายละเอียดให้ครบถ้วน :)")
        } else if(event_id != ''){
            if (start_date > end_date || start_date > dateline || end_date > dateline) {
                alert("กรุณากรอกวันที่ให้ถูกต้อง")
            }
            return this.updateItem();
        } else if (start_date > end_date || start_date > dateline || end_date > dateline) {
            alert("กรุณากรอกวันที่ให้ถูกต้อง")
        } else {
            const itemsRef = firebase.database().ref('events')
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

            this.props.history.push('/ListofEvent');
        }
    }

    handleUpdate = (event_id = null, name = null, start_date = null, end_date = null, start_time = null, end_time = null, detail = null, dateline = null) => {
        this.setState({ event_id, name, start_date, end_date, start_time, end_time, detail, dateline })
    }

    updateItem = () => {
        const {name, start_date, end_date, start_time, end_time, detail, dateline} = this.state
        const obj = {
            name,
            start_date,
            end_date,
            start_time,
            end_time,
            detail,
            dateline
        }

        const itemsRef = firebase.database().ref('/events')

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
    }

    removeItem = event_id => {
        const itemsRef = firebase.database().ref('/events');
        itemsRef.child(event_id).remove();
    }

    render() {
        return (
            <Container fluid >
                <Nevbar />
                <Row className=" m-4">
                    <Col
                        xs={12}
                        sm={{ span: 10 }}
                        md={{ span: 4, offset: 2 }}
                        lg={{ span: 4, offset: 4 }}
                        className="p-5 Loginbox"
                    >
                        <h1 className="text-center mt-2"> Add Event</h1>
                        <Form onSubmit={this.handleSubmit} className="mt-4">
                            <Label>Name of Event</Label>
                            <Group >
                                <Control name="name" value={this.state.name} onChange={this.handleChange} type="text" placeholder="Name of Event" />
                            </Group>
                            <Label>Detail of event</Label>
                            <Group className="mt-1">
                                <Control name="detail" value={this.state.detail} onChange={this.handleChange} type="text" placeholder="Detail of event" />
                            </Group>
                            <Label>Start date of Event</Label>
                            <Group >
                                <Control name="start_date" value={this.state.start_date} onChange={this.handleChange} type="date" placeholder="Date of Event" />
                            </Group>
                            <Label>End date of Event</Label>
                            <Group >
                                <Control name="end_date" value={this.state.end_date} onChange={this.handleChange} type="date" placeholder="Date of Event" />
                            </Group>
                            <Label>Start time of Event</Label>
                            <Group >
                                <Control name="start_time" value={this.state.start_time} onChange={this.handleChange} type="time" placeholder="Date of Event" />
                            </Group>
                            <Label>End time of Event</Label>
                            <Group >
                                <Control name="end_time" value={this.state.end_time} onChange={this.handleChange} type="time" placeholder="Date of Event" />
                            </Group>
                            <Label>Dateline</Label>
                            <Group >
                                <Control name="dateline" value={this.state.dateline} onChange={this.handleChange} type="date" placeholder="Dateline" />
                            </Group>
                            <Link to="/ListofEvent">
                                <Button variant="dark" block className=" mt-4 btn-custom" onClick={this.handleSubmit} >
                                    Submit Event
                                </Button>
                            </Link>
                        </Form>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default withRouter(AddEvent);



