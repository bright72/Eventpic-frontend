import React, { Component, useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { Button, Container, Col, Card, } from 'react-bootstrap'
import Nevbar from './Nevbar.js'
import './Style.css'
import firebase from './firebase'

class ListofEvent extends Component {

    constructor(props) {
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
            check: false,
            currentUser: null,
            auth: false
        }

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
                .on("child_added", async function (snapshot) {
                    const itemsRef = firebase.database().ref(`/user/${snapshot.key}/event`);
                    itemsRef.on('value', (snapshot) => {
                        let events = snapshot.val();
                        let newState = [];
                        for (let item in events) {
                            if (item) {
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

                        }
                        console.log("new", newState)
                        self.setState({
                            events: newState
                        })
                    })
                })
        })

    }
    render() {
        const { currentUser, auth } = this.state
        if (auth) {
            if (currentUser) {
                return (
                    <div>
                    <Nevbar/>
                    <Container fluid >
                        {
                            this.state.events.map((item) => {
                                return (
                                    <Col
                                        xs={12}
                                        sm={{ span: 10 }}
                                        md={{ span: 8, offset: 2 }}
                                        lg={{ span: 8, offset: 2 }}
                                        className="p-3 Loginbox mt-3"
                                    >
                                        <Card>
                                            <Card.Body>
                                                <Card.Title>{item.name}</Card.Title>
                                                <Card.Text>{item.detail}</Card.Text>
                                                <Card.Text>{item.start_date}</Card.Text>
                                                <Link to={"/MoreDetail/" + item.event_id} >
                                                    <Button variant="dark m-1" >View Detail</Button>
                                                </Link>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                )
                            })
                        }
                    </Container >
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

export default ListofEvent;