import auth from '../firebase/index'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Container, Row, Col, Input, label } from 'react-bootstrap'
import Nevbar from '../Nevbar.js'

class LoginForm extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            email: '',
            password: '',
            currentUser: null,
            message: ''
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
        console.log("asddfg")
        const { email, password } = this.state
        // TODO: implement signInWithEmailAndPassword()

        auth
            .signInWithEmailAndPassword(email, password)
            .then(response => {
                this.setState({
                    currentUser: response.user
                })
            })
            .catch(error => {
                this.setState({
                    message: error.message
                })
            })

    }

    componentDidMount() {
        auth.onAuthStateChanged(user => {
            if (user) {
                this.setState({
                    currentUser: user
                })
            }
        })
    }

    logout = e => {
        e.preventDefault()
        auth.signOut().then(response => {
            this.setState({
                currentUser: null
            })
        })
    }

    render() {
        const { message, currentUser } = this.state

        if (currentUser) {
            return (
                <div>
                    <p>Hello {currentUser.email}</p>
                    <button onClick={this.logout}>Logout</button>
                </div>
            )
        }


        return (
            // <section className="section container">
            //     {message ? <p className="help is-danger">{message}</p> : null}
            //     <div className="columns is-centered">
            //         <div className="column is-half">
            //             <form onSubmit={this.onSubmit}>
            //                 <div className="field">
            //                     <label className="label">Email</label>
            //                     <div className="control">
            //                         <input
            //                             className="input"
            //                             type="email"
            //                             name="email"
            //                             onChange={this.onChange}
            //                         />
            //                     </div>
            //                 </div>

            //                 <div className="field">
            //                     <label className="label">Password</label>
            //                     <div className="control">
            //                         <input
            //                             className="input"
            //                             type="password"
            //                             name="password"
            //                             onChange={this.onChange}
            //                         />
            //                     </div>
            //                 </div>

            //                 <div className="field is-grouped">
            //                     <div className="control">
            //                         <button className="button is-link">Submit</button>
            //                     </div>
            //                     <div className="control">
            //                         <button className="button is-text">Cancel</button>
            //                     </div>
            //                 </div>
            //             </form>
            //         </div>
            //     </div>
            // </section>
            <Container fluid >
            <Nevbar />
            
            <Row className=" mt-5">
                <Col xs={12} sm={{ span: 10 }} md={{ span: 4, offset: 2 }} lg={{ span: 3, offset: 4 }} className="p-5 Loginbox">

                    <h1 className="text-center mt-3"> เข้าสู่ระบบ</h1>

                    <Form onSubmit={this.onSubmit} className="mt-4">
                        <Form.Label>Email address</Form.Label>
                        <Form.Group controlId="formBasicEmail" >
                            <Form.Control name="email" onChange={this.onChange} type="email" placeholder="อีเมล์" />
                        </Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Group controlId="formBasicPassword" className="mt-1">
                            <Form.Control name="password" onChange={this.onChange} type="password" placeholder="รหัสผ่าน" />
                        </Form.Group>
                            <Button variant="secondary" block  className="mt-4 btn-custom" onClick={this.onSubmit} >
                            Login
                            </Button>
                        <Link to="/Register">
                        <Button variant="secondary" block  className="mt-4 btn-custom" >
                            Register
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
                    </Form>
                </Col>
            </Row>
        </Container>


            
        )
    }
}

export default LoginForm