import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Container, Row, Col, Input, label, Alert } from 'react-bootstrap'
import Nevbar from './Nevbar.js'
import './Style.css'
import List from './List';
import firebase, { database } from './firebase/index';



class ListofEvent extends Component {

    constructor() {
        super();
        this.state = {
            events: [],
            event_id: '',
            name: '',
            detail: '',
            date: '',
            dateline: ''
        }

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
                    date: events[item].date,
                    dateline: events[item].dateline
                })
            }
            this.setState({
                events: newState
            })
        })

    }

    handleUpdate = (event_id = null, name = null, date = null, detail = null, dateline = null) => {
        this.setState({ event_id, name, date, detail, dateline })
    }

    updateItem() {

        var obj = { name: this.state.name, date: this.state.date, detail: this.state.detail, dateline: this.state.dateline }

        const itemsRef = firebase.database().ref('/events')

        itemsRef.child(this.state.event_id).update(obj);

        this.setState({
            event_id: '',
            name: '',
            detail: '',
            date: '',
            dateline: ''
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
                <Row className=" m-4">
                    <Col
                        xs={12}
                        sm={{ span: 10 }}
                        md={{ span: 4, offset: 2 }}
                        lg={{ span: 10, offset: 1 }}
                        className="p-5 Loginbox">

                        <h1 className="text-center mt-3 ">List of Event</h1>

                        <table className="table table-sm table-bordered" ท5>
                            <tr className="thead-dark">
                                <th width="20%">Name</th>
                                <th width="50%">Detail</th>
                                <th width="10%">Date</th>
                                <th width="10%">Dateline</th>
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
                                            <td>{item.dateline}</td>
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

export default ListofEvent;



