import React from 'react'
import firebase from 'firebase'
import { Link, Redirect } from 'react-router-dom'
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap'
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
            validate: false,
            message: ""
        }
    }

    handleRegister = async (e) => {
        e.preventDefault()
        const form = e.currentTarget
        const { email, password, conPassword } = this.state
        if (form.checkValidity() === true) {
            if (password === conPassword) {
                const response = await firebase.auth().createUserWithEmailAndPassword(email, password)
                    .then(response => {
                        this.setState({
                            redirect: true
                        })
                        const itemsRef = firebase.database().ref('organizers')
                        const item = {
                            email
                        }
                        itemsRef.push(item)
                        this.setState({
                            email: '',
                            password: '',
                        })
                        this.props.history.push('/')
                    }).catch(error => {
                        console.log(error)
                        this.setState({
                            showAlert: true,
                            message: error.message
                        })
                    })
            }else{
                this.setState({
                    showAlert: true,
                    message: "Password and confirm password incorrect"
                })
            }
        }else{
            this.setState({
                showAlert: true,
                message: "Please fill your information completely."
            })
        }
        this.setState({
            validate: true
        })
    }

    onChange = e => {
        const { name, value } = e.target
        this.setState({
            [name]: value
        })
    }


    render() {
        const { showAlert, redirect, validate, message } = this.state
        if (redirect) {
            return <Redirect to="/login" />
        }
        return (
            <Container fluid className="page-center">
                <Row className="">
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
                                    <h2 className="title-lable my-4 pt-3 text-center" id="card-title">ลงทะเบียน</h2>
                                    <Form noValidate validated={validate} onSubmit={this.handleRegister} className="form m-4 px-4">
                                        <Form.Label className="title-lable">อีเมล์</Form.Label>
                                        <Form.Group controlId="formBasicEmail" >
                                            <Form.Control className="form form-input"  name="email" onChange={this.onChange} type="email" placeholder="อีเมล์" required />
                                        </Form.Group>
                                        <Form.Label className="title-lable">รหัสผ่าน</Form.Label>
                                        <Form.Group controlId="formBasicPassword">
                                            <Form.Control className="form form-input"  name="password" onChange={this.onChange} type="password" placeholder="รหัสผ่าน" required />
                                        </Form.Group>
                                        <Form.Label className="title-lable">ยืนยันรหัสผ่าน</Form.Label>
                                        <Form.Group controlId="formBasicPassword">
                                            <Form.Control className="form form-input"  name="conPassword" onChange={this.onChange} type="password" placeholder="ยืนยันรหัสผ่าน" required />
                                        </Form.Group>
                                        <Row className="mt-3">
                                            <Col className="text-left">
                                                {showAlert ?
                                                    <div className="alert-text">{message}</div>
                                                    :
                                                    ""
                                                }
                                            </Col>
                                        </Row>
                                        <Button id="primary-auth" block type="submit" className="btn-custom my-4" >
                                            ลงทะเบียน
                                </Button>
                                        <p className="divider-title mt-4 mb-5 text-center">มีบัญชีผู้ใช้แล้ว ? <Link to="/Login" className="link-path">เข้าสู่ระบบ</Link></p>
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

