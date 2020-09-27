import React, { Component } from 'react'
import * as emailjs from 'emailjs-com'
import { Button, FormFeedback, Form, Card, Container } from 'react-bootstrap'
// import Layout from '../components/layout'


const { Title } = Card
const { Group, Control, Label } = Form


class ContactForm extends Component {
    state = {
        name: '',
        email: '',
        event_name: '',
    }

    handleSubmit(e) {
        e.preventDefault()
        const { name, email, event_name} = this.state
        let templateParams = {
            to_email: email,
            to_name: name,
            event_name: event_name,
        }

        emailjs.send(
            'test555',
            'template_p1ojhve',
            templateParams,
            'user_taSKZdwaRwk1j4rwI0eXi'
        )

        this.resetForm()

    }

    resetForm() {
        this.setState({
            name: '',
            email: '',
            event_name: '',
        })
    } handleChange = (param, e) => {
        this.setState({ [param]: e.target.value })
    }

    render() {
        return (
            <Container fluid className="page-center">

                <Card className="p-4 m-4" style={{ borderRadius: 10 }}>
                    <Title>Get in Touch</Title>
                    <Form onSubmit={this.handleSubmit.bind(this)}>
                        <Group controlId="formBasicEmail">
                            <Label className="text-muted">Email address</Label>
                            <Control
                                type="email"
                                name="email"
                                value={this.state.email}
                                className="text-primary"
                                onChange={this.handleChange.bind(this, 'email')}
                                placeholder="Enter email"
                            />
                        </Group>
                        <Group controlId="formBasicName">
                            <Label className="text-muted">Name</Label>
                            <Control
                                type="text"
                                name="name"
                                value={this.state.name}
                                className="text-primary"
                                onChange={this.handleChange.bind(this, 'name')}
                                placeholder="Name"
                            />
                        </Group>
                        <Group controlId="formBasicMessage">
                            <Label className="text-muted">Event Name</Label>
                            <Control
                                type="textarea"
                                name="event_name"
                                className="text-primary"
                                value={this.state.event_name}
                                onChange={this.handleChange.bind(this, 'event_name')}
                            />
                        </Group>
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Card>
            </Container>
        )
    }
}
export default ContactForm