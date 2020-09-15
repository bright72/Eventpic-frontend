import React from 'react'
import { Link, Redirect } from 'react-router-dom'
import { Navbar, Container, Button, FormControl, NavDropdown, Nav, Row, col } from 'react-bootstrap'
import auth from './firebase/index'



class Nevbar extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            email: '',
            password: '',
            currentUser: null,
            message: '',
            redirect: false,
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
                currentUser: null,
                redirect: true,
            })
        })
    }

    render() {
        const { message, currentUser, redirect } = this.state
        if (redirect) {
            return <Redirect to="/login" />
        }
        if (currentUser) {
            return (
                <Navbar>
                    <Navbar.Brand href="/">Event Picture Management</Navbar.Brand>
                    <Navbar.Collapse className="justify-content-end">
                        <Navbar.Text>
                            {/* <Link to="/ListofEvent" className="mr-3"><Button variant="light">Event</Button></Link> */}
                            <Link to="/AddEvent" className="mr-3"><Button variant="light">Add Event</Button></Link>
                            <Link to="/" className="mr-3"><Button variant="light">{currentUser.email}</Button></Link>
                            <Button onClick={this.logout} variant="light">Logout</Button>
                        </Navbar.Text>
                    </Navbar.Collapse>
                </Navbar>
            )
        }

        if (!currentUser) {
            return (
                <Navbar>
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