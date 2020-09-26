import React from 'react'
import { Link, Redirect } from 'react-router-dom'
import { Navbar, Button, Container, Row, Col, Nav } from 'react-bootstrap'
import firebase from './firebase/index'
import logo from "./LogoEventPic.svg"

class Nevbar extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            email: '',
            password: '',
            currentUser: null,
            message: '',
            redirect: false,
            navStat: false
        }
    }

    // onChange = e => {
    //     const { name, value } = e.target

    //     this.setState({
    //         [name]: value
    //     })
    // }

    // onSubmit = e => {
    //     e.preventDefault()

    //     const { email, password } = this.state
    //     // TODO: implement signInWithEmailAndPassword()

    //     auth
    //         .signInWithEmailAndPassword(email, password)
    //         .then(response => {
    //             this.setState({
    //                 currentUser: response.user
    //             })
    //         })
    //         .catch(error => {
    //             this.setState({
    //                 message: error.message
    //             })
    //         })

    // }

    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.setState({
                    currentUser: user
                })
            }
        })
        window.addEventListener("scroll", this.handleScroll)
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.handleScroll)
    }

    handleScroll = () => {
        const show = window.scrollY > 20
        if (show) {
            this.setState({
                navStat: true
            })
        } else {
            this.setState({
                navStat: false
            })
        }
    }

    logout = e => {
        e.preventDefault()
        firebase.auth().signOut().then(response => {
            this.setState({
                currentUser: null,
                redirect: true,
            })
        })
    }

    render() {
        const { currentUser, redirect, navStat } = this.state
        if (redirect) {
            return <Redirect to="/login" />
        }

        if (currentUser) {
            // if (!navStat) {
            if (navStat) {
                return (
                    <Navbar className="navbar" id="scroll-nav" style={{ position: "fixed" }}>
                        <Row>
                            <Col>
                                <Navbar.Brand className="logo-nav" href="/"><img src={logo} /></Navbar.Brand>
                            </Col>
                        </Row>
                    </Navbar>
                )
            } else {
                return (
                    <Navbar className="navbar" id="normal-nav">
                        <Row>
                            <Col>
                                <Navbar.Brand className="logo-nav" href="/"><img src={logo} /></Navbar.Brand>
                            </Col>

                            <Col className="">
                                <Nav>
                                    {/* <Link to="/AddEvent" className="mr-3"><Button variant="light">Add Event</Button></Link>
                                    <Link to="/" className="mr-3"><Button variant="light">{currentUser.email}</Button></Link>
                                    <Button onClick={this.logout} variant="light">Logout</Button> */}
                                    <Nav.Link>{currentUser.email}</Nav.Link>
                                    <Nav.Link><Button onClick={this.logout} className="btn-custom" id="secondary">LOGOUT</Button></Nav.Link>
                                </Nav>
                            </Col>
                        </Row>
                    </Navbar>
                )
            }
        }

        if (!currentUser) {
            return (
                <Navbar scrolling dark expand="md">
                    <Navbar.Brand href="/ListofEvent">Event Picture Management</Navbar.Brand>
                    <Navbar.Collapse className="justify-content-end">
                        <Navbar.Text>
                            {/* <Link to="/ListofEvent" className="mr-3"><Button variant="light">Event</Button></Link> */}
                            {/* <Link to="/AddEvent" className="mr-3"><Button variant="light">Add Event</Button></Link> */}
                            <Link to="/Login" className="mr-3"><Button variant="light">Login</Button></Link>
                        </Navbar.Text>
                    </Navbar.Collapse>
                </Navbar>
            )
        }
    }

}

export default Nevbar;