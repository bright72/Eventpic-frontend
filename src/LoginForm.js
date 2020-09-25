import firebase from './firebase'
import React from 'react'
import { Link, Redirect } from 'react-router-dom'
import { Form, Button, Container, Row, Col, Alert, Card } from 'react-bootstrap'
import Nevbar from './Nevbar.js'
import './Style.css'

class LoginForm extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: '',
            currentUser: null,
            showAlert: false,
            validate: false,
            auth: false
        }
    }

    onChange = e => {
        const { name, value } = e.target

        this.setState({
            [name]: value
        })
    }

    onSubmit = e => {
        e.preventDefault()
        const form = e.currentTarget
        const { email, password } = this.state
        if (form.checkValidity() === true) {
            firebase.auth()
                .signInWithEmailAndPassword(email, password)
                .then(response => {
                    console.log("OK")
                    this.setState({
                        currentUser: response.user
                    })
                    this.props.history.push('/')
                })
                .catch(error => {
                    this.setState({
                        showAlert: true
                    })
                })
        }
        this.setState({
            validate: true
        })
        e.stopPropagation();
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
    }

    render() {
        const { showAlert, currentUser, validate, auth } = this.state
        if (auth) {
            if (!currentUser) {
                return (
                    <Container fluid >
                        <Nevbar />
                        {showAlert ?
                            <Alert variant="danger">
                                อีเมล์หรือรหัสผ่านไม่ถูกต้อง กรุณากรอกใหม่อีกครั้ง
                        </Alert>
                            :
                            ""
                        }
                        <Row className="register">
                            <Col xs={12} md={{ span: 4, offset: 4 }} >
                                <Card className="form-card mb-4">
                                    <h2 className="card-title ml-5 mt-5 mb-0 text-center"> Log-In</h2>
                                    <hr className="line ml-5 mr-5 mb-2" />
                                    <Form noValidate validated={validate} onSubmit={this.onSubmit} className="form ml-5 mr-5 mb-5 pl-5">
                                        <Form.Label className="form-lable">Email address</Form.Label>
                                        <Form.Group controlId="formBasicEmail" >
                                            <Form.Control className="input-form" name="email" type="email" onChange={this.onChange} placeholder="อีเมล์" required />
                                            <Form.Control.Feedback type="invalid">
                                                กรุณากรอกอีเมล์
                                </Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Label>Password</Form.Label>
                                        <Form.Group controlId="formBasicPassword" className="mt-1">
                                            <Form.Control className="input-form" name="password" onChange={this.onChange} type="password" placeholder="รหัสผ่าน" required />
                                            <Form.Control.Feedback type="invalid">
                                                กรุณารหัสผ่าน
                                </Form.Control.Feedback>
                                        </Form.Group>
                                        <Button variant="secondary"  block id="primary" className="btn-custom mt-6 mb-3" type="submit" >
                                            Login
                            </Button>
                                        <Link to="/Register">
                                            <Button variant="secondary" block id="primary" className="btn-custom mt-6 mb-3" >
                                                Register
                                </Button>
                                        </Link>
                                        <Row className="mt-3">
                                            <Col className="text-right">
                                                <Link to="#">ลืมรหัสผ่าน</Link>
                                            </Col>
                                        </Row>
                                    </Form>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                )
            }
            if (currentUser) {
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

export default LoginForm