import React, { Component, Fragment } from 'react'
import { Redirect } from 'react-router-dom'
import { Card, Container, Row, Col, CardColumns} from 'react-bootstrap'
import firebase from './firebase/index'
import Nevbar from './Nevbar.js'

class ViewPicture extends Component {

    state = {
        user_id: '',
        event_id: this.props.match.params.event_id,
        participant_id: this.props.match.params.participant_id,
        currentUser: null,
        auth: false,
        pictures: [],
        participant: {},
        selectPictures: [],
        show: false
    }

    async componentWillMount() {
        let user = await this.getUser();
        let key = await this.getKey(user)
        this.setState({
            currentUser: user,
            user_id: key,
            auth: true
        })
        this.getParticipant()
        this.getAllPictureOfPaticipant()
    }

    getUser = () => {
        return new Promise((resolve, reject) => {
            firebase.auth().onAuthStateChanged(function (user) {
                if (user) {
                    resolve(user)
                } else {
                    // No user is signed in.
                }
            })
        })
    }

    getKey = (user) => {
        return new Promise((resolve, reject) => {
            firebase.database().ref("organizers").orderByChild("email").equalTo(user.email)
                .on("child_added", function (snapshot) {
                    resolve(snapshot.key)
                })
        })
    }

    getAllPictureOfPaticipant() {
        const { user_id, event_id, participant_id } = this.state
        const databaseRef = firebase.database().ref(`organizers/${user_id}/events/${event_id}/participants/${participant_id}/processed_pic`)
        databaseRef.on('value', snapshot => {
            let pictures = snapshot.val()
            let tempRows = []
            for (const property in pictures) {
                let row = {
                    id: property,
                    metadata: pictures[property]
                }
                tempRows.push(row)
            }
            this.setState({
                pictures: tempRows
            })
        })
    }

    getParticipant() {
        const { user_id, event_id, participant_id } = this.state
        const participantRef = firebase.database().ref(`user/${user_id}/event/${event_id}/participant/${participant_id}`)
        participantRef.on("value", (snapshot) => {
            let participant = snapshot.val()
            this.setState({
                participant: participant
            })
        })
    }

    handleChange = e => {
        const { selectPictures } = this.state
        const { value } = e.target
        let temp = selectPictures.filter(id => id === value)
        if (temp === 0) {
            // not dupilcate
            selectPictures.push(value)
        } else {
            // dupilcate
            this.setState({
                selectPictures: selectPictures.filter(id => id !== value)
            })
        }
    }

    render() {
        const { pictures, currentUser, auth, participant } = this.state
        //รูปทั้งหมดในอีเว่น
        let ListCheckPicture = pictures.map((pic, index) => {
            return (
                <Card>
                    <Card.Img variant="top" src={pic.metadata.orginal_image_url} />
                </Card>
            )
        })

        if (auth) {
            if (currentUser) {
                return (
                    <Fragment>
                        <Nevbar />
                        <Container fluid>
                            <Row className="mb-4">
                                <Col
                                    xs={{ span: 12 }}
                                    sm={{ span: 8, offset: 2 }}
                                    md={{ span: 8, offset: 2 }}
                                    lg={{ span: 8, offset: 2 }}
                                >
                                    <h2 className="mb-4">รูปของ {participant.email}</h2>
                                </Col>
                                <Col
                                    xs={{ span: 12 }}
                                    sm={{ span: 8, offset: 2 }}
                                    md={{ span: 8, offset: 2 }}
                                    lg={{ span: 8, offset: 2 }}
                                >
                                    <CardColumns>
                                        {ListCheckPicture}
                                    </CardColumns>
                                </Col>
                            </Row>
                        </Container>
                    </Fragment >
                )
            }
            if (!currentUser) {
                return (
                    <Redirect to="/Login" />
                )
            }
        }
        else {
            return (
                <div>Loading</div>
            )
        }
    }
}
export default ViewPicture