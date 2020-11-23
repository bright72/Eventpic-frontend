import firebase from './firebase'
import React from 'react'
import { Link, Redirect } from 'react-router-dom'
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap'
import './Style.css'
import logo from "./Component-logo.svg"
import vectorCom from "./Component-vec.svg"
import graCom from "./Component-gra.svg"

class LoginForm extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: '',
            currentUser: null,
            showAlert: false,
            validate: false,
            auth: false,
            show: false
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

    handleShow = () => {
        this.setState({
            show: true
        })
    }

    handleClose = () => {
        this.setState({
            show: false
        })
    }

    render() {
        const { showAlert, currentUser, validate, auth } = this.state
        if (auth) {
            if (!currentUser) {
                return (

                    <Container fluid>
                        <Row>
                            <Col xs={{ span: 12 }} sm={{ span: 10, offset: 1 }} md={{ span: 10, offset: 1 }} lg={{ span: 6, offset: 3 }} >
                                <Card className="form-card" style={{ marginTop: 80 }}>
                                    <Row>
                                        <Col className="col-img d-none d-lg-block">
                                            <Row>
                                                <Col className="logo-form text-center">
                                                    <img src={logo} />
                                                </Col>
                                            </Row>
                                            <div className="gradient-form"><img src={graCom} style={{ position: "absolute", bottom: 0 }} /></div>
                                            <img src={vectorCom} style={{ position: "absolute", bottom: 30, right: "40px" }} />
                                        </Col>
                                        <Col>
                                            <h2 className="title-lable my-4 pt-3 text-center" id="card-title"> LOGIN</h2>
                                            <Form noValidate validated={validate} onSubmit={this.onSubmit} className="form m-4 px-4">
                                                <Form.Label className="title-lable">EMAIL</Form.Label>
                                                <Form.Group controlId="formBasicEmail" >
                                                    <Form.Control className="form form-input" id="form-input" name="email" type="email" onChange={this.onChange} placeholder="Email" required />
                                                    <Form.Control.Feedback type="invalid">
                                                        Please enter email.
                                                    </Form.Control.Feedback>
                                                </Form.Group>
                                                <Form.Label className="title-lable">PASSWORD</Form.Label>
                                                <Form.Group controlId="formBasicPassword" className="">
                                                    <Form.Control className="form form-input" id="form-input" name="password" onChange={this.onChange} type="password" placeholder="Password" required />
                                                    <Form.Control.Feedback type="invalid">
                                                        Please enter password.
                                                    </Form.Control.Feedback>
                                                </Form.Group>
                                                <Row>
                                                    <Col className="text-right">
                                                        <Link to="#" className="link-path">Forgot password?</Link>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col className="text-left">
                                                        {showAlert ?
                                                            <div className="alert-text">Email or password is incorrect</div>
                                                            :
                                                            ""
                                                        }
                                                    </Col>
                                                </Row>
                                                <Button variant="secondary" block id="primary-auth" className="btn-custom mt-3 mb-4" type="submit" >
                                                    LOGIN
                                                </Button>
                                                <div className="divider mt-5">
                                                    <span className="divider-title">Don't have an account?</span>
                                                </div>
                                                <Link to="/Register" className="btn-link">
                                                    <Button variant="secondary" block id="secondary-auth" className="btn-custom mt-5 mb-6" >
                                                        REGISTER
                                            </Button>
                                                </Link>
                                            </Form>
                                        </Col>
                                    </Row>
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