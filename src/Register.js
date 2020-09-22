import React, { useState } from 'react'
import auth from './firebase/index'
import firebase, { database } from './firebase'
import { Link, Redirect } from 'react-router-dom'
import { Form, Button, Container, Row, Col, Input, label, Alert } from 'react-bootstrap'
import Nevbar from './Nevbar.js'
import './Style.css'

class Register extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            email: '',
            password: '',
            conPassword: '',
            checkPassword: false,
            redirect: false
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
        // e.preventDefault()
        // const form = e.currentTarget
        const { email, password, conPassword, checkPassword, redirect } = this.state
        if (password == conPassword) {
            const response = await auth.createUserWithEmailAndPassword(
                email,
                password
            )
            this.setState({
                checkPassword: true,
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

        }

    }
    onChange = e => {
        const { name, value } = e.target
        this.setState({
            [name]: value
        })
    }


    render() {
        const { checkPassword, redirect } = this.state
        if (redirect) {
            return <Redirect to="/login" />
        }
        return (
            <Container fluid >
                <Nevbar />
                {checkPassword ?
                    ""
                    :
                    <Alert variant="danger">
                        อีเมล์หรือรหัสผ่านไม่ถูกต้อง กรุณากรอกใหม่อีกครั้ง
                    </Alert>
                }
                <Row className=" mt-5">

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
                </Row>
            </Container >
        )
    }
}
export default Register;

