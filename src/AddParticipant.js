import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { Form, Button, Container, Row, Col } from 'react-bootstrap'
import Nevbar from './Nevbar.js'
import './Style.css'
import firebase from './firebase'
import { withRouter } from 'react-router-dom'

const { Group, Label, Control } = Form

class AddParticipant extends Component {
    constructor(props) {
        super();
        this.state = {
            event_id: props.match.params.id,
            email: '',
            currentUser: null,
            auth: false,
            participant_id :'', 
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
        // const itemsRef = firebase.database().ref(`user/${this.state.key}/event`);
        // itemsRef.on('value', (snapshot) => {
        //     let events = snapshot.val();
        //     let newState = [];
        //     for (let item in events) {
        //         newState.push({
        //             event_id: item,
        //             name: events[item].name,
        //             detail: events[item].detail,
        //             start_date: events[item].start_date,
        //             end_date: events[item].end_date,
        //             start_time: events[item].start_time,
        //             end_time: events[item].end_time,
        //             dateline: events[item].dateline
        //         })
        //     }
        //     this.setState({
        //         events: newState
        //     })
        // })
    }

    handleChange = e => {
        const { name, value } = e.target
        this.setState({
            [name]: value
        })
    }

    handleSubmit = e => {
        e.preventDefault()
        const { email} = this.state
            let keypath = ""
            firebase.database().ref("user").orderByChild("email").equalTo(this.state.currentUser.email)
                .on("child_added", function (snapshot) {
                    console.log("นี่คือคีย์")
                    console.log(snapshot.key)
                    keypath = snapshot.key
                })
            const itemsRef = firebase.database().ref(`user/${keypath}/event/${this.state.event_id}/participant`)
            const item = {
                email,
                participant_id: '',
            }
            itemsRef.push(item)
            this.setState({
                email: ''

                
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
                                <h1 className="text-center mt-2"> Add Participant</h1>
                                <Form onSubmit={this.handleSubmit} className="mt-4">
                                    <Label>Email</Label>
                                    <Group >
                                    <Form.Group controlId="formBasicEmail" >
                                        <Form.Control className="form" id="form-input" name="email" onChange={this.handleChange} type="email" placeholder="Email" required />
                                    </Form.Group>
                                    </Group>
                                    <Form.Group controlId="exampleForm.ControlTextarea1">
                                    <Button variant="dark m-1" >Upload Image</Button>
                                    </Form.Group>
                                    <Form>
                                    </Form>
                                   
                                        <Button variant="dark" block className=" mt-4 btn-custom" type="submit" >
                                            Save Participant 
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

export default withRouter(AddParticipant);



