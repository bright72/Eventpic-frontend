import React, { Component } from 'react';
import { Container, Spinner } from 'react-bootstrap'
import './App.css';


class Loading extends Component {

    render() {
        return (
            <h2 className="mt-5 text-center" >
                <Spinner animation="grow" variant="primary" className="mr-4 mb-2" />
                    รอสักครู่...
            </h2>

        )
    }

}
export default Loading;
