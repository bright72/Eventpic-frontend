import React, { useState, useEffect, Component } from 'react';
import firebase, { storage } from '../firebase';
import { Form, Button, Container, Row, Col, Image, Modal } from 'react-bootstrap'
import Nevbar from '../Nevbar.js'
import '../Style.css';

const Upload = (props) => {

    const [files, setFiles] = useState([])
    const [URLs, setURL] = useState([])
    //const urls2 = [];

    const onFileChange = e => {
        for (let i = 0; i < e.target.files.length; i++) {
            const newFile = e.target.files[i];
            newFile["id"] = Math.random();
            // add an "id" property to each File object
            setFiles(prevState => [...prevState, newFile]);
        }
    };

    const onUploadSubmission = e => {
        e.preventDefault(); // prevent page refreshing
        const promises = [];

        if (files.length > 0) {
            files.forEach(file => {
                const uploadTask =
                    firebase.storage().ref().child(`images/${file.name}`).put(file);
                promises.push(uploadTask);
                uploadTask.on(
                    firebase.storage.TaskEvent.STATE_CHANGED,
                    snapshot => {
                        const progress =
                            ((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                        if (snapshot.state === firebase.storage.TaskState.RUNNING) {
                            console.log(`Progress: ${progress}%`);
                        }

                    },
                    error => console.log(error.code),
                    async () => {
                        const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
                        // do something with the url
                        //urls2.push({index: url.length, value: downloadURL});

                        setURL(URLs => [...URLs, { index: URLs.length, value: downloadURL }])
                        console.log(URLs);
                        // console.log(url)
                    }
                );
            });
            Promise.all(promises)
                .then(() => alert('All files uploaded'))
                .catch(err => console.log(err.code));
        } else {
            return (
                alert('No files uploaded!')
            )
        }

        //setURL([...URLs, { url }]);
        //console.log(url);
    }

    // useEffect(() => {
    //     // Should not ever set state during rendering, so do this in useEffect instead.
    //     setURL(url);
    //   }, []);


    return (
        <div>
            <Nevbar />

            <h1 className="text-center mt-3"> Upload Event Pictures</h1>

            <Container fluid="md">

                <Row className="image-preview-area">
                    {URLs.map(url =>
                        <div className="image-preview">

                            <div className="crop"><Image src={url.value} /></div>

                        </div>)}
                </Row>

                <Form>
                    <table className="upload-table">
                        <tr>
                            <td width="85%"><input type="file" multiple onChange={onFileChange} className="file-input" /></td>
                            <td width="15%"><Button variant="dark" onClick={onUploadSubmission}>Upload</Button></td>
                        </tr>
                    </table>
                </Form>

            </Container>

            {/* <li key={URLs.index}><img src = {URLs.value}/></li> */}
        </div>
    )

}

export default Upload;
