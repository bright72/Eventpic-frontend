import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Container, Row, Col, Input, label } from 'react-bootstrap'
import Nevbar from './Nevbar.js'
import './Style.css'



const Login = (props) => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")


    const handleSubmit = event => {
        if (email == 'phasit_earth@hotmail.com') {
            if (password == '1234')
                alert(' Correct: ');
        }
        else {
            alert('Username or password not Correct: ');
            event.preventDefault();
        }
    }

    const handleChangeEmail = event => {
        setEmail(event.target.value)
    }

    const handleChangePassword = event => {
        setPassword(event.target.value)
    }





    return (


        <Container fluid >
            <Nevbar />
            <Row className=" mt-5">
                <p>
                    {document.write.handleChangeEmail}
                </p>
                <Col xs={12} sm={{ span: 10 }} md={{ span: 4, offset: 2 }} lg={{ span: 3, offset: 4 }} className="p-5 Loginbox">

                    <h1 className="text-center mt-3"> เข้าสู่ระบบ</h1>

                    <Form onSubmit={handleSubmit} className="mt-4">
                        <Form.Label>Email address</Form.Label>
                        <Form.Group controlId="formBasicEmail" >
                            <Form.Control name="email" value={email} onChange={handleChangeEmail} type="email" placeholder="อีเมล์" />
                        </Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Group controlId="formBasicPassword" className="mt-1">
                            <Form.Control value={password} onChange={handleChangePassword} type="password" placeholder="รหัสผ่าน" />
                        </Form.Group>
                        <Link to="/AddEvent">
                            <Button variant="secondary" block onClick={handleSubmit} className="mt-4 btn-custom" >
                                เข้าสู่ระบบ
                            </Button>
                        </Link>
                        <Row className="mt-3">
                            <Col>
                                <Form.Group controlId="formBasicCheckbox" >
                                    <Form.Check type="checkbox" label="จดจำฉัน" />
                                </Form.Group>
                            </Col>
                            <Col className="text-right">
                                <Link to="#">ลืมรหัสผ่าน</Link>
                            </Col>
                        </Row>
                        <Button variant="danger" block className="mt-2 btn-custom">
                            เข้าสู่ระบบด้วย Google
                            </Button>
                        <Button variant="primary" block className="mt-2 mb-3 btn-custom">
                            เข้าสู่ระบบด้วย Facebook
                        </Button>


                    </Form>
                </Col>
            </Row>
        </Container>

    )
}
export default Login;