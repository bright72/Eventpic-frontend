import React, { Fragment } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { Button, Container, Col, Card } from 'react-bootstrap'
import firebase from './firebase'
import Nevbar from './Nevbar.js'

class MoreDetail extends React.Component {

    constructor(props) {
        super()
        this.state = {
            event_id: props.match.params.id,
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
                    const itemsRef = firebase.database().ref(`/user/${snapshot.key}/event`)
                    itemsRef.child(self.state.event_id).on("value", (snapshot) => {
                        let item = snapshot.val()
                        // console.log(this.state.event_id + " : " + item.name)
                        if (item) {
                            self.setState({
                                event_id: self.state.event_id,
                                name: item.name,
                                detail: item.detail,
                                start_date: item.start_date,
                                end_date: item.end_date,
                                start_time: item.start_time,
                                end_time: item.end_time,
                                dateline: item.dateline
                            })
                        }
                    })
                })
        })

    }

    removeItem = event_id => {
        let keypath = ""
        firebase.database().ref("user").orderByChild("email").equalTo(this.state.currentUser.email)
            .on("child_added", function (snapshot) {
                console.log("นี่คือคีย์")
                console.log(snapshot.key)
                keypath = snapshot.key
            })
        const itemsRef = firebase.database().ref(`user/${keypath}/event`)
        itemsRef.child(event_id).remove()
        this.props.history.push('/ListofEvent')
    }

    render() {
        const { currentUser, auth } = this.state
        if (auth) {
            if (currentUser) {
                return (
                    <Fragment>
                        <Nevbar />
                        <Container fluid>
                            <Col
                                xs={12}
                                sm={{ span: 10, offset: 1 }}
                                md={{ span: 10, offset: 1 }}
                                lg={{ span: 8, offset: 2 }}
                            >
                                <Card className=" form-card p-3 mt-3">
                                    <Card.Body>
                                        <h2>{this.state.name}</h2>
                                        <Card.Text>{this.state.detail}</Card.Text>
                                        <Card.Text> วันที่จัดงาน : {this.state.start_date} - {this.state.end_date} </Card.Text>
                                        <Card.Text> วันสิ้นสุดการประมวลผล : {this.state.dateline}</Card.Text>
                                        {/* <Link to={"/ListofParticipant/" + this.state.event_id} >
                                            <Button variant="dark my-1 mr-1">Participant</Button>
                                        </Link >
                                        <Link to={"/AddParticipant/" + this.state.event_id} >
                                            <Button variant="dark m-1">Add Participant</Button>
                                        </Link > */}
                                        <div className="text-right">
                                            <Link to={"/Upload/" + this.state.event_id} >
                                                <Button className="btn-custom px-4 ml-2" variant="outline-dark">Process</Button>
                                            </Link >
                                            <Link to={"/EditEvent/" + this.state.event_id} >
                                                <Button className="btn-custom px-4 ml-2" variant="outline-dark" >Edit</Button>
                                            </Link>
                                            <Button className="btn-custom px-4 ml-2" variant="outline-dark" onClick={() => this.removeItem(this.state.event_id)}>Delete</Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
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
                <div> Loading</div>
            )
        }

    }
}

export default MoreDetail
