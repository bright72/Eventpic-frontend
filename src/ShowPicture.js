import React, { useState, } from 'react';
// import firebase from './firebase';
import { Container, Row, Image } from 'react-bootstrap'
import Nevbar from './Nevbar.js'
import './Style.css';

const ShowPicture = (props) => {

    const [files, setFiles] = useState([])
    const [URLs, setURL] = useState([])

    return (
        <div>
            <Nevbar />

            <h1 className="text-center mt-3"> Pictures</h1>

            <Container fluid="md">

                <Row className="image-preview-area">
                    {/* {URLs.map(url =>
                        <div className="image-preview">

                            <div className="crop"><Image src={url.value} /></div>

                        </div>)} */}
                </Row>

            </Container>

            {/* <li key={URLs.index}><img src = {URLs.value}/></li> */}
        </div>
    )

}

export default ShowPicture;
