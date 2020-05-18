import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Container, Row, Col, Input, label, Alert } from 'react-bootstrap'
import Nevbar from './Nevbar.js'
import './Style.css'
import List from './List';
import firebase, { database } from './firebase/index';



class AddEvent extends Component {

    constructor() {
        super();
        this.state = {
            events: [],
            event_id: '',
            name: '',
            detail: '',
            date: ''
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
                    date: events[item].date
                })
            }
            this.setState({
                events: newState
            })
        })
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value

        })
    }

    handleSubmit(e) {
        e.preventDefault();

        if (this.state.event_id !== '') {
            return this.updateItem();
        }

        const itemsRef = firebase.database().ref('events')
        const item = {
            name: this.state.name,
            date: this.state.date,
            detail: this.state.detail
        }
        itemsRef.push(item)
        this.setState({
            event_id: '',
            name: '',
            date: '',
            detail: ''

        })
        

    }

    handleUpdate = (event_id = null, name = null, date = null, detail = null) => {
        this.setState({ event_id, name, date, detail })
    }

    updateItem() {

        var obj = { name: this.state.name, date: this.state.date, detail: this.state.detail }

        const itemsRef = firebase.database().ref('/events')

        itemsRef.child(this.state.event_id).update(obj);

        this.setState({
            event_id: '',
            name: '',
            date: '',
            detail: ''
        })

    }

    removeItem(event_id) {
        const itemsRef = firebase.database().ref('/events');
        itemsRef.child(event_id).remove();
    }



    render() {
        return (
            <Container fluid >
                <Nevbar />
                <Row className=" mt-5">
                    <Col
                        xs={12}
                        sm={{ span: 10 }}
                        md={{ span: 4, offset: 2 }}
                        lg={{ span: 4, offset: 1 }}
                        className="p-5 Loginbox">

                        <h1 className="text-center mt-3"> Add Event</h1>

                        <Form onSubmit={this.handleSubmit} className="mt-4">
                            <Form.Label>Name of Event</Form.Label>
                            <Form.Group >
                                <Form.Control name="name" value={this.state.name} onChange={this.handleChange} type="text" placeholder="Name of Event" />
                            </Form.Group>
                            <Form.Label>Date of Event</Form.Label>
                            <Form.Group >
                                <Form.Control name="date" value={this.state.date} onChange={this.handleChange} type="date" placeholder="Date of Event" />
                            </Form.Group>
                            <Form.Label>Detail of event</Form.Label>
                            <Form.Group className="mt-1">
                                <Form.Control name="detail" value={this.state.detail} onChange={this.handleChange} type="text" placeholder="Detail of event" />
                            </Form.Group>

                            
                                <Button variant="dark" block className=" mt-4 btn-custom" onClick={this.handleSubmit} >
                                    Submit Event
                                </Button>
                            





                        </Form>
                    </Col>
                    <Col
                        xs={12}
                        sm={{ span: 10 }}
                        md={{ span: 4, offset: 2 }}
                        lg={{ span: 6, offset: 5 }}
                        className="p-5 ml-4 Loginbox">

                        <h1 className="text-center mt-3 ">List of Event</h1>

                        <table className="table table-sm table-bordered">
                            <tr className="thead-dark">
                                <th width="20%">Name</th>
                                <th width="50%">Detail</th>
                                <th width="20%">Date</th>
                                <th width="5%">Edit</th>
                                <th width="5%">Delete</th>
                            </tr>
                            {
                                this.state.events.map((item) => {
                                    return (
                                        <tr>
                                            <td>{item.name}</td>
                                            <td>{item.detail}</td>
                                            <td>{item.date}</td>
                                            <td> <Button variant="outline-dark" size="sm" className='btn-custom-sm' onClick={() => this.handleUpdate(item.event_id, item.name, item.date, item.detail)}>Edit</Button></td>
                                            <td> <Button variant="outline-dark" size="sm" className='btn-custom-sm' onClick={() => this.removeItem(item.event_id)}>Delete</Button></td>
                                        </tr>
                                    )
                                })
                            }
                        </table>

                    </Col>




                </Row>

            </Container>
        );
    }
}

export default AddEvent;



