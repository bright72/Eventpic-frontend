import React, { useState } from 'react'
// import auth from './firebase/index'
import firebase from 'firebase'
import { Link, Redirect } from 'react-router-dom'
import { Form, Button, Container, Row, Col, Input, label, Alert, Card } from 'react-bootstrap'
import Nevbar from './Nevbar.js'
import './Style.css'

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
            <Container fluid >
                <Nevbar />
                {showAlert ?
                    <Alert variant="danger">
                        อีเมล์หรือรหัสผ่านไม่ถูกต้อง กรุณากรอกใหม่อีกครั้ง
                    </Alert>
                    :
                    ""
                }
                {/* <Row className=" mt-5">

                    <Col xs={12} sm={{ span: 10 }} md={{ span: 4, offset: 2 }} lg={{ span: 4, offset: 4 }} className="p-5 Loginbox">

                        <h1 className="text-center mt-3"> ลงทะเบียน</h1>

                        <Form className="mt-4">
                            <Form.Label>Email address</Form.Label>
                            <Form.Group controlId="formBasicEmail" >
                                <Form.Control name="email" onChange={this.onChange} type="email" placeholder="อีเมล์" />
                            </Form.Group>
                            <Form.Label>Password</Form.Label>
                            <Form.Group controlId="formBasicPassword" className="mt-1">
                                <Form.Control name="password" onChange={this.onChange} type="password" placeholder="รหัสผ่าน" />
                            </Form.Group>
                            <Form.Label>Password Confirm</Form.Label>
                            <Form.Group controlId="formBasicPassword" className="mt-1">
                                <Form.Control name="conPassword" onChange={this.onChange} type="password" placeholder="รหัสผ่าน" />
                            </Form.Group>
                            <Button variant="secondary" block onClick={this.handleRegister} className="mt-4 btn-custom" >
                                ลงทะเบียน
                            </Button>
                        </Form>
                    </Col>
                </Row> */}
                <Row className="register">
                    <Col xs={12} md={{ span: 4, offset: 4 }} >
                        <Card className="form-card mb-4">
                            <h2 className="card-title ml-5 mt-5 mb-0 text-center">Register</h2>
                            {/* <Card.Title classname="card-title">Register</Card.Title> */}
                            <hr className="line ml-5 mr-5 mb-2" />
                            <Form noValidate validated={validate} className="form ml-5 mr-5 mb-5 pl-5 pr-5">
                                <Form.Label className="form-lable">Email address</Form.Label>
                                <Form.Group controlId="formBasicEmail" >
                                    <Form.Control className="input-form" name="email" onChange={this.onChange} type="email" placeholder="Email" required />
                                </Form.Group>
                                <Form.Label className="form-lable">Password</Form.Label>
                                <Form.Group controlId="formBasicPassword" className="mt-1">
                                    <Form.Control className="input-form" name="password" onChange={this.onChange} type="password" placeholder="Password" required />
                                </Form.Group>
                                <Form.Label className="form-lable">Confirm Password</Form.Label>
                                <Form.Group controlId="formBasicPassword" className="mt-1">
                                    <Form.Control className="input-form" name="conPassword" onChange={this.onChange} type="password" placeholder="Confirm Password" required />
                                </Form.Group>
                                <Button id="primary" block onClick={this.handleRegister} className="btn-custom mt-6 mb-3" >
                                    Register
                                </Button>
                            </Form>
                        </Card>
                    </Col>
                </Row>
            </Container>
        )
    }
}
export default Register;

