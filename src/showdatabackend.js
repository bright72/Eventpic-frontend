import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from "axios";

class showdatabackend extends Component {

    constructor() {
        super()
        this.state = {
            email: "",
            img: []
        }
    }

    componentDidMount = () => {
        axios.get("/emailbakcend").then(responde => {
            console.log(responde.data);
            this.setState({
                email: responde.data.email,
                img: responde.data.img

            })
        })
    }

    render() {
        const { img } = this.state

        return (this.state.img.map((item) => {
            return (
                <div>
                    <h1>{this.state.email}</h1>
                    <h1>{item}</h1>
                </div>

            )

        }))
    
    }
}

export default showdatabackend;