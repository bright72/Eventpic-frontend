import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Container, Row, Col, Input, label,Alert } from 'react-bootstrap'
import Nevbar from './Nevbar.js'
import './Style.css'



const AddEvent = (props) => {

    const [name, setName] = useState("")
    const [detail, setDetail] = useState("")
    const [date, setDate] = useState("")

    const handleSubmit = event => {
       
    }
    const handleChangeEventName = event => {
        setName(event.target.value)
    }
    const handleChangeEventDetail = event => {
        setDetail(event.target.value)
    }
    const handleChangeDate = event => {
        setDate(event.target.value)
    }



    return (



        <Container fluid >
            <Nevbar />
            <Row className=" mt-5">

                <Col xs={12} sm={{ span: 10 }} md={{ span: 4, offset: 2 }} lg={{ span: 4, offset: 4 }} className="p-5 Loginbox">

                    <h1 className="text-center mt-3"> Add Event</h1>

                    <Form onSubmit={handleSubmit} className="mt-4">
                        <Form.Label>Name of Event</Form.Label>
                        <Form.Group >
                            <Form.Control name="name" value={name} onChange={handleChangeEventName} type="text" placeholder="Name of Event" />
                        </Form.Group>
                        <Form.Label>Date of Event</Form.Label>
                        <Form.Group >
                            <Form.Control name="date" value={date} onChange={handleChangeDate} type="date" placeholder="Date of Event" />
                        </Form.Group>
                        <Form.Label>Detail of event</Form.Label>
                        <Form.Group className="mt-1">
                            <Form.Control value={detail} onChange={handleChangeEventDetail} type="text" placeholder="Detail of event" />
                        </Form.Group>
                        
                       
                            <Button variant="secondary" block onClick={handleSubmit} className="mt-4 btn-custom" >
                                Submit Event
                            </Button>
                        




                    </Form>
                </Col>
            </Row>
        </Container>

    )
}
export default AddEvent;