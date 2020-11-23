import React, { Component } from 'react';
import { Container, Spinner } from 'react-bootstrap'
import './App.css';


class Loading extends Component {

    render() {
        return (
            <Container >
                <Spinner animation="border" variant="danger"/>
            </Container>

        )
    }

}
export default Loading;
