import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Container, Row, Col, Input, label,Alert } from 'react-bootstrap'
import Nevbar from './Nevbar.js'
import './Style.css'



const Register = (props) => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [conPassword, setConPassword] = useState("")

    const handleSubmit = event => {
        if (password == conPassword) {
                alert(' Password Correct: ');
        }
        else {
            alert(' Password not Correct: ');
        }
        event.preventDefault();
    }

    const handleChangeEmail = event => {
        setEmail(event.target.value)
    }

    const handleChangePassword = event => {
        setPassword(event.target.value)
    }

    const handleChangeConPassword = event => {
        setConPassword(event.target.value)
    }



    return (



        <Container fluid >
            <Nevbar />
            <Row className=" mt-5">

                <Col xs={12} sm={{ span: 10 }} md={{ span: 4, offset: 2 }} lg={{ span: 4, offset: 4 }} className="p-5 Loginbox">

                    <h1 className="text-center mt-3"> ลงทะเบียน</h1>

                    <Form onSubmit={handleSubmit} className="mt-4">
                        <Form.Label>Email address</Form.Label>
                        <Form.Group controlId="formBasicEmail" >
                            <Form.Control name="email" value={email} onChange={handleChangeEmail} type="text" placeholder="อีเมล์" />
                        </Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Group controlId="formBasicPassword" className="mt-1">
                            <Form.Control value={password} onChange={handleChangePassword} type="password" placeholder="รหัสผ่าน" />
                        </Form.Group>
                        <Form.Label>Password Confirm</Form.Label>
                        <Form.Group controlId="formBasicPassword" className="mt-1">
                            <Form.Control value={conPassword} onChange={handleChangeConPassword} type="password" placeholder="รหัสผ่าน" />
                        </Form.Group>
                        <Link to="/Login">
                            <Button variant="secondary" block onClick={handleSubmit} className="mt-4 btn-custom" >
                                ลงทะเบียน
                            </Button>
                        </Link>
                    </Form>
                </Col>
            </Row>
        </Container>

    )
}
export default Register;