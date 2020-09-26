import React from 'react'
import { Link, Redirect } from 'react-router-dom'
import { Button, Container, Col, Card } from 'react-bootstrap'
import firebase from './firebase'
import Nevbar from './Nevbar.js'

class ListofParticipant extends React.Component {

    constructor(props) {
        super()
        this.state = {
            events: [],
            event_id: props.match.params.id,
            email:'',
            currentUser: null,
            auth: false
        }
    }

    componentDidMount() {
        console.log(this.state.event_id)
        let self = this
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.setState({
                    currentUser: user
                })
            }
            this.setState({
                auth: true
            })
            const { email} = self.state
            firebase.database().ref("user").orderByChild("email").equalTo(user.email)
                .on("child_added",  function (snapshot) {
                    console.log(snapshot.key)
                    // console.log(this.state.event_id)
                    const itemsRef = firebase.database().ref(`user/${snapshot.key}/event/${self.state.event_id}/participant`)
                    itemsRef.child(self.state.event_id).on("value", (snapshot) => {
                        console.log(snapshot.val())
                        let item = snapshot.val()
                        // console.log(this.state.event_id + " : " + item.name)
                        if (item) {
                            self.setState({
                                email: item.email
                            })
                        }
                    })
                })
        })
        this.props.history.push('/MoreDetail/' + this.state.event_id);
    }

    // removeItem = event_id => {
    //     let keypath = ""
    //     firebase.database().ref("user").orderByChild("email").equalTo(this.state.currentUser.email)
    //         .on("child_added", function (snapshot) {
    //             console.log("นี่คือคีย์")
    //             console.log(snapshot.key)
    //             keypath = snapshot.key
    //         })
    //     const itemsRef = firebase.database().ref(`user/${keypath}/event`)
    //     itemsRef.child(event_id).remove()
    //     this.props.history.push('/ListofEvent')
    // }

    render() {
        const { currentUser, auth, email,events} = this.state
        if (auth) {
            if (currentUser) {
                return (
                    <Container fluid >
                        <Nevbar />
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
                                                <Card.Title>{item.email}</Card.Title>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                )
                            })
                        }
                    </Container >
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

export default ListofParticipant
