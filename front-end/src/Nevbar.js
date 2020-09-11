import React from 'react'
import { Link } from 'react-router-dom'
import { Navbar, Container, Button, FormControl, NavDropdown, Nav, Row, col } from 'react-bootstrap'


const Nevbar = () => {
    return (
        
        <Navbar>
        <Navbar.Brand href="/ListofEvent">Event Picture Management</Navbar.Brand>
        <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
                <Link to="/ListofEvent" className="mr-3"><Button variant="light">Event</Button></Link>
                <Link to="/AddEvent" className="mr-3"><Button variant="light">Add Event</Button></Link>
                <Link to="/login" className="mr-3"><Button variant="light">Login</Button></Link>
            </Navbar.Text>
        </Navbar.Collapse>
    </Navbar>

    )


}

export default Nevbar;