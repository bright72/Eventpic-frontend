import React, { useState } from 'react'
// import auth from './firebase/index'
import firebase from 'firebase'
import { Link, Redirect } from 'react-router-dom'
import { Form, Button, Container, Row, Col, Input, label, Alert, Card } from 'react-bootstrap'
import Nevbar from './Nevbar.js'
import './Style.css'
import logo from "./Component-logo.svg"
import vectorCom from "./Component-vec.svg"
import graCom from "./Component-gra.svg"

class Register extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            email: '',
            password: '',
            conPassword: '',
            showAlert: false,
            redirect: false,
            validate: false
        }
    }

    // const handleSubmit = event => {
    //     if (password == conPassword) {
    //             alert(' Password Correct: ');
    //     }
    //     else {
    //         alert(' Password not Correct: ');
    //     }
    //     event.preventDefault();
    // }

    handleRegister = async (e) => {
        e.preventDefault()
        const form = e.currentTarget
        const { email, password, conPassword, showAlert, redirect } = this.state
        if (form.checkValidity() === true) {
            if (password == conPassword) {
                const response = await firebase.auth().createUserWithEmailAndPassword(email, password)
                    .then(response => {
                        this.setState({
                            redirect: true
                        })
                        const itemsRef = firebase.database().ref('user')
                        const item = {
                            email
                        }
                        itemsRef.push(item)
                        this.setState({
                            email: '',
                            password: '',
                        })
                    }).catch(error => {
                        this.setState({
                            showAlert: true
                        })
                    })
            }
        }
        this.setState({
            validate: true
        })
        e.stopPropagation();
    }

    onChange = e => {
        const { name, value } = e.target
        this.setState({
            [name]: value
        })
    }


    render() {
        const { showAlert, redirect, validate } = this.state
        if (redirect) {
            return <Redirect to="/login" />
        }
        return (
            <Container fluid className="page-center">
                {showAlert ?
                    <Alert variant="danger">
                        Already has this account.
                    </Alert>
                    :
                    ""
                }

                <Row className="">
                    <Col xs={{ span: 12 }} sm={{ span: 8, offset: 2 }} lg={{ span: 6, offset: 3 }} className="" >
                        <Card className="form-card">
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
                                <h2 className="title-lable mt-6 mb-5 text-center" id="card-title">REGISTER</h2>
                                {/* <Card.Title classname="card-title">Register</Card.Title> */}
                                <Form noValidate validated={validate} className="form ml-4 mr-4 mb-5 pl-5 pr-5">
                                    <Form.Label className="title-lable">EMAIL</Form.Label>
                                    <Form.Group controlId="formBasicEmail" >
                                        <Form.Control className="form" id="form-input" name="email" onChange={this.onChange} type="email" placeholder="Email" required />
                                    </Form.Group>
                                    <Form.Label className="title-lable">PASSWORD</Form.Label>
                                    <Form.Group controlId="formBasicPassword">
                                        <Form.Control className="form" id="form-input" name="password" onChange={this.onChange} type="password" placeholder="Password" required />
                                    </Form.Group>
                                    <Form.Label className="title-lable">CONFIRM PASSWORD</Form.Label>
                                    <Form.Group controlId="formBasicPassword">
                                        <Form.Control className="form" id="form-input" name="conPassword" onChange={this.onChange} type="password" placeholder="Confirm Password" required />
                                    </Form.Group>
                                    <Button id="primary-auth" block onClick={this.handleRegister} className="btn-custom mt-6 mb-3" >
                                        REGISTER
                                </Button>
                                <p className="divider-title mt-4 mb-5 text-center">Already have an account? <Link to="/Login" className="link-path">Login</Link></p>
                                </Form>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>
            </Container>
        )
    }
}
export default Register;

