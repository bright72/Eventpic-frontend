import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from "axios";

class showdatabackend extends Component {

    constructor() {
        super()
        this.state = {
            email: "",
        }
    }

    componentDidMount = () => {
        axios.get("/testapi1").then(responde => {
            console.log(responde.data);
            this.setState({
                email : responde.data.email
            })
        });
    };

  render() {
    return (
      <div >
          <h1>email form backend : {this.state.email} </h1>
      </div>
    );
  }
}

export default showdatabackend;