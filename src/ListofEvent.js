import React, { Component, Fragment } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { Button, Container, Col, Card, Row, Dropdown } from 'react-bootstrap'
import Nevbar from './Nevbar.js'
import './Style.css'
import firebase from './firebase'
import Loading from './Loading.js'

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
            auth: false,
            show: false
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
            firebase.database().ref("organizers").orderByChild("email").equalTo(user.email)
                .on("child_added", async function (snapshot) {
                    const itemsRef = firebase.database().ref(`/organizers/${snapshot.key}/events`);
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
                        self.setState({
                            events: newState
                        })
                    })
                })
        })

    }

    render() {
        const { currentUser, auth, show } = this.state
        if (auth) {
            if (currentUser) {
                return (
                    <Fragment>
                        <Nevbar />
                        <Container fluid>
                            {
                                this.state.events.map((item) => {
                                    return (
                                        <Col
                                            xs={12}
                                            sm={{ span: 10, offset: 1 }}
                                            md={{ span: 10, offset: 1 }}
                                            lg={{ span: 8, offset: 2 }}
                                            className="mt-4"
                                        >
                                            <Card className="p-2" style={{ borderRadius: 20}}>
                                                <Row>
                                                    <Col>
                                                        <Card.Body>
                                                            <Row>
                                                                <Col md={{ span: 10 }}>
                                                                    <Card.Title className="title-event pt-1">{item.name}</Card.Title>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col>
                                                                    <Card.Text className="form" id="show-detail"><span className="title-lable">รายละเอียด: </span>{item.detail}</Card.Text>
                                                                    <Card.Text className="form mt-1"><span className="title-lable">วันที่จัดงาน: </span>{item.start_date}-{item.end_date}</Card.Text>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col></Col>
                                                                <Col>
                                                                    <div className="mt-4 text-right">
                                                                        <Link to={"/MoreDetail/" + item.event_id} className="btn-link">
                                                                            <Button className="btn-custom mr-0" id="secondary" >เพิ่มเติม</Button>
                                                                        </Link>
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                        </Card.Body>
                                                    </Col>
                                                </Row>
                                            </Card>
                                        </Col>
                                    )
                                })
                            }
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
                <Loading />
            )
        }

    }
}

export default ListofEvent;