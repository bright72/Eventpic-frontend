import React from 'react'
import { Link } from 'react-router-dom'
import { Navbar, Container, Button, FormControl, NavDropdown, Nav, Row, col } from 'react-bootstrap'


const Nevbar = () => {
    return (
        
        <Navbar>
        <Navbar.Brand href="/">NoName WEBSITE</Navbar.Brand>
        <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
                <Link to="/" className="mr-3"><Button variant="light">หน้าแรก</Button></Link>
                <Link to="/login" className="mr-3"><Button variant="light">เข้าสู่ระบบ</Button></Link>
                <Link to="/Register" className="mr-3"><Button variant="light">ลงทะเบียน</Button></Link>
                <Link to="/AddEvent" className="mr-3"><Button variant="light">Add Event</Button></Link>
                <Link to="/TestUpPic" className="mr-3"><Button variant="light">Upload Picture</Button></Link>
            </Navbar.Text>
        </Navbar.Collapse>
    </Navbar>




    )


}

export default Nevbar;