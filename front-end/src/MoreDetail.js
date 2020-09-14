import React from 'react'
import { useParams, Link, Redirect } from 'react-router-dom'
import { Button, Container, Row, Col, Card } from 'react-bootstrap'
import firebase, { database } from './firebase/indexstore'
import Nevbar from './Nevbar.js'
import auth from './firebase/index'
import Login from './LoginForm.js'


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
            currentUser: null
        }
    }

    componentDidMount() {

        const itemsRef = firebase.database().ref(`events`)
        itemsRef.child(this.state.event_id).on("value", (snapshot) => {
            let item = snapshot.val()
            // console.log(this.state.event_id + " : " + item.name)
            auth.onAuthStateChanged(user => {
                if (user) {
                    this.setState({
                        currentUser: user
                    })
                }
            })
            if (item) {
                this.setState({
                    event_id: this.state.event_id,
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

    }

    removeItem = event_id => {
        const itemsRef = firebase.database().ref('/events')
        itemsRef.child(event_id).remove()
        this.props.history.push('/ListofEvent')
    }

    render() {
        const { currentUser } = this.state
        if (currentUser) {
            return (
                <Container fluid >
                    <Nevbar />
                    <Col
                        xs={12}
                        sm={{ span: 1 }}
                        md={{ span: 8, offset: 1 }}
                        lg={{ span: 10, offset: 1 }}
                        className="p-3 Loginbox mt-3"
                    >
                        <Card>
                            <Card.Body>
                                <Card.Title>{this.state.name} </Card.Title>
                                <Card.Text>{this.state.detail}</Card.Text>
                                <Card.Text> วันที่จัดงาน : {this.state.start_date} - {this.state.end_date} </Card.Text>
                                <Card.Text> เวลา : {this.state.start_time} - {this.state.end_time} </Card.Text>
                                <Card.Text> วันสิ้นสุดการประมวลผล : {this.state.dateline}</Card.Text>
                                <Link to={"/ShowPicture"} >
                                    <Button variant="dark m-1">Picture</Button>
                                </Link >
                                <Link to={"/UpPicture"} >
                                    <Button variant="dark m-1">Upload Picture</Button>
                                </Link >
                                <Link to={"/EditEvent/" + this.state.event_id} >
                                    <Button variant="outline-dark m-1" >Edit</Button>
                                </Link>
                                <Button variant="outline-dark m-1" onClick={() => this.removeItem(this.state.event_id)}>Delete</Button>
                            </Card.Body>
                        </Card>

                    </Col>

                </Container>


            )
        }
        
        if (!currentUser) {
            return (
                <Login />
            )
        }


    }
}

export default MoreDetail
