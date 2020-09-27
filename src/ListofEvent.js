import React, { Component, useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { Button, Container, Col, Card, Row, Image, Dropdown } from 'react-bootstrap'
import Nevbar from './Nevbar.js'
import './Style.css'
import firebase from './firebase'
import ListPic from './List.png'

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
                    // <div className="bg-pic">
                    <div>
                        <Nevbar />
                        <Container fluid className="padding-page" >
                            <div className="">
                                <Row>
                                    <Col xs={12}
                                        sm={{ span: 10 }}
                                        md={{ span: 6, offset: 3 }}
                                        lg={{ span: 6, offset: 3 }}
                                        className="p-1 text-right">
                                        <Link to="/AddEvent" className="btn-link"><Button className="btn-custom mr-5" id="primary"><p className="ml-1 mr-1 text-center">+ ADD EVENT</p></Button></Link>
                                    </Col>
                                </Row>
                                {
                                    this.state.events.map((item) => {
                                        return (
                                            <Col
                                                xs={12}
                                                sm={{ span: 10 }}
                                                md={{ span: 6, offset: 3 }}
                                                lg={{ span: 6, offset: 3 }}
                                                className="p-1 pt-5"
                                            >
                                                <Card className="form-card" id="list-card">
                                                    <Container fluid>
                                                        <Row>
                                                            <Col className="">
                                                                <Card.Body>
                                                                    <Row>
                                                                        <Col md={{ span: 10 }}>
                                                                            <Card.Title className="title-event">{item.name}</Card.Title>
                                                                        </Col>
                                                                        <Col>
                                                                            <Dropdown>
                                                                            
                                                                            </Dropdown>
                                                                        </Col>
                                                                    </Row>
                                                                    <Row>
                                                                        <Col>
                                                                            <Card.Text className="form" id="show-detail"><span className="title-lable">DETAIL: </span>{item.detail}</Card.Text>
                                                                            <Card.Text className="form mt-1"><span className="title-lable">START DATE: </span>{item.start_date}</Card.Text>
                                                                            <Card.Text className="form mt-1"><span className="title-lable">END DATE: </span>{item.end_date}</Card.Text>
                                                                        </Col>
                                                                    </Row>
                                                                    <Row>
                                                                        <Col></Col>
                                                                        <Col>
                                                                            <div className="text-right">
                                                                                <Link to={"/MoreDetail/" + item.event_id} className="btn-link">
                                                                                    <Button className="btn-custom mr-0" id="secondary" >VIEW MORE</Button>
                                                                                </Link>
                                                                            </div>
                                                                        </Col>
                                                                    </Row>
                                                                </Card.Body>
                                                            </Col>
                                                        </Row>
                                                    </Container>
                                                </Card>
                                            </Col>
                                        )
                                    })
                                }
                            </div>
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