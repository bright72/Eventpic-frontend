import auth from './firebase/index'
import React from 'react'
import { Link, Redirect } from 'react-router-dom'
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap'
import Nevbar from './Nevbar.js'

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
            auth
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
        auth.onAuthStateChanged(user => {
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
                        <Row className=" mt-5">
                            <Col xs={12} sm={{ span: 10 }} md={{ span: 4, offset: 2 }} lg={{ span: 3, offset: 4 }} className="p-5 Loginbox">
                                <h1 className="text-center mt-3"> เข้าสู่ระบบ</h1>
                                <Form noValidate validated={validate} onSubmit={this.onSubmit} className="mt-4">
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Group controlId="formBasicEmail" >
                                        <Form.Control name="email" type="email" onChange={this.onChange} placeholder="อีเมล์" required />
                                        <Form.Control.Feedback type="invalid">
                                            กรุณากรอกอีเมล์
                                </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Label>Password</Form.Label>
                                    <Form.Group controlId="formBasicPassword" className="mt-1">
                                        <Form.Control name="password" onChange={this.onChange} type="password" placeholder="รหัสผ่าน" required />
                                        <Form.Control.Feedback type="invalid">
                                            กรุณารหัสผ่าน
                                </Form.Control.Feedback>
                                    </Form.Group>
                                    <Button variant="secondary" block className="mt-4 btn-custom" type="submit" >
                                        Login
                            </Button>
                                    <Link to="/Register">
                                        <Button variant="secondary" block className="mt-4 btn-custom" >
                                            Register
                                </Button>
                                    </Link>
                                    <Row className="mt-3">
                                        <Col className="text-right">
                                            <Link to="#">ลืมรหัสผ่าน</Link>
                                        </Col>
                                    </Row>
                                </Form>
                            </Col>
                        </Row>
                    </Container>
                )
            }
            if (currentUser) {
                return (
                    <Redirect to="/" />
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