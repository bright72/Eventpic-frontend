import React, { Component } from 'react';
import { Button } from 'react-bootstrap'
import './App.css';
import axios from "axios";

class showdatabackend extends Component {

    constructor() {
        super()
        this.state = {
            email: "Null",
            img: []
        }
    }


    onclickrespond = () => {
        console.log("teasdfsf");
        axios.get("/emailbakcend").then(responde => {
            console.log(responde.data);
            this.setState({
                email: responde.data.email,
                img: responde.data.img
            })
        })
    }

    render() {
        // const { img } = this.state
        return (
            <div>
                <Button onClick={this.onclickrespond}>กดกูสิ</Button>
                {/* <h1>email is : {this.state.email}</h1> */}
                {
                    (this.state.img.map((item) => {
                        return (
                            <div>
                                <h1>{this.state.email}</h1>
                                <h1>{item}</h1>
                            </div>
                        )
                    }
                    )
                    )

                }
            </div>
        )
    }
}

export default showdatabackend;

//return (this.state.img.map((item) => {
//     return (
//         <div>
//             <h1>{this.state.email}</h1>
//             <h1>{item}</h1>
//         </div>
//     )
// }
// )
//)