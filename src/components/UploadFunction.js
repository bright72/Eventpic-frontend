import React, { Component, Fragment } from 'react';
import { Link, Redirect } from 'react-router-dom'
import { Form, Row, Col, Button, Spinner, Card, Container } from 'react-bootstrap'


import firebase from '../firebase/index';
import StorageDataTable from './StorageDataTable';
import Nevbar from '../Nevbar.js'
import axios from "axios";
import * as emailjs from 'emailjs-com'
import api from '../utils/api'
// Import FilePond styles
// import 'filepond/dist/filepond.min.css';

// Register plugin
// import FilePondImagePreview from 'filepond-plugin-image-preview';
// import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

// registerPlugin(FilePondImagePreview);


class UploadFunction extends Component {

    state = {
        files: [], //ใช้เก็บข้อมูล File ที่ Upload
        setFiles: [],
        uploadValue: 0, //ใช้เพื่อดู Process การ Upload
        filesMetadata: [], //ใช้เพื่อรับข้อมูล Metadata จาก Firebase
        rows: [], //ใช้วาด DataTable
        event_id: this.props.match.params.id,
        currentUser: null,
        auth: false,
        keypath: '',
        imageAsFile: "",
        emailPaticipant: "",
        img: []

    }

    //ใช้ตอนที่ยังไม่ Mount DOM
    async componentWillMount() {

        let user = await this.getUser();
        let key = await this.getKey(user)
        this.setState({
            currentUser: user,
            keypath: key,
            auth: true
        })
        this.getMetaDataFromDatabase()


    }

    getUser = () => {
        return new Promise((resolve, reject) => {
            firebase.auth().onAuthStateChanged(function (user) {
                if (user) {
                    resolve(user)
                } else {
                    // No user is signed in.
                }
            });
        })
    }

    getKey = (user) => {
        return new Promise((resolve, reject) => {
            firebase.database().ref("user").orderByChild("email").equalTo(user.email)
                .on("child_added", function (snapshot) {
                    resolve(snapshot.key)
                })
        })
    }




    //โหลดข้อมูล Metadata จาก Firebase

    getMetaDataFromDatabase() {
        const databaseRef = firebase.database().ref(`user/${this.state.keypath}/event/${this.state.event_id ? this.state.event_id : null}/images`);

        databaseRef.on('value', snapshot => {
            this.setState({
                filesMetadata: snapshot.val()
            }, () => {
                this.addMetadataToList()
            });
        });
    }

    //ลบข้อมูล Metada จาก Firebase
    deleteMetaDataFromDatabase(e, rowData) {

        const storageRef = firebase.storage().ref(`images/${rowData.name}`)
        // Delete the file on storage
        storageRef.delete()
            .then(() => {
                console.log("Delete file success");
                console.log("+555" + this.state.keypath)
                const databaseRef = firebase.database().ref(`user/${this.state.keypath}/event/${this.state.event_id ? this.state.event_id : null}/images`)
                // Delete the file on realtime database
                databaseRef.child(rowData.key).remove()
                    .then(() => {
                        console.log("Delete metada success");
                        this.getMetaDataFromDatabase()
                    })
                    .catch((error) => {
                        console.log("Delete metada error : ", error.message);
                    });

            })

            .catch((error) => {
                console.log("Delete file error : ", error.message);
            });

    }

    //แอดข้อมูลเข้า list table
    async addMetadataToList() {
        let i = 1;
        let rows = [];

        //Loop add data to rows
        for (let key in this.state.filesMetadata) {

            let fileData = this.state.filesMetadata[key];

            let downloadUrl = await firebase.storage().ref(`images/${fileData.metadataFile.name}`).getDownloadURL()

            let objRows = {
                no: i++,
                key: key, //ใช้เพื่อ Delete
                name: fileData.metadataFile.name,
                downloadURLs: downloadUrl,
                fullPath: fileData.metadataFile.fullPath,
                size: (fileData.metadataFile.size),
                contentType: fileData.metadataFile.contentType,
            }

            rows.push(objRows)
        }

        this.setState({
            rows: rows
        }, () => {
            console.log('Set Rows')
        })

    }

    handleImageAsFile = (e) => {
        const images = e.target.files
        this.setState({
            files: images
        })
    }

    // async 
    async handleProcessing(e) {
        e.preventDefault();
        // handle file upload here
        console.log(this.state.files)

        for (const [key, file] of Object.entries(this.state.files)) {
            console.log(`[${key}] ${file.name}`)
            let storageRef = firebase.storage().ref(`images/${file.name}`)
            await storageRef.put(file)

            let downloadUrl = await storageRef.getDownloadURL()

            storageRef.getMetadata()
                .then((metadata) => {

                    // Metadata now contains the metadata for 'filepond/${file.name}'
                    let metadataFile = {
                        name: metadata.name,
                        size: metadata.size,
                        contentType: metadata.contentType,
                        fullPath: metadata.fullPath,
                        downloadURLs: downloadUrl,
                    }
                    let is_allow_all_panticipant = true
                    const databaseRef = firebase.database().ref(`user/${this.state.keypath}/event/${this.state.event_id}/images`);
                    console.log(metadataFile)
                    databaseRef.push({
                        metadataFile,is_allow_all_panticipant
                    })
                }).catch(function (error) {
                    console.log(`Upload error : ${error.message}`)
                })
        }

    }

    onclickrespond = () => {
        console.log("teasdfsf");
        api.get("/emailbakcend").then(responde => {
            console.log(responde.data);
            this.setState({
                emailPaticipant: responde.data.email,
                img: responde.data.img
            })
        })
    }

    handleSubmit = () => {
        const { emailPaticipant } = this.state
        console.log("before axios");
        api.get("/emailbackend").then(responde => {
            console.log(responde.data);
            console.log(responde.data.email)
            // this.setState({
            //     emailPaticipant: responde.data.email,
            //     img: responde.data.img
            // })
            let templateParams = {
                to_email: responde.data.email,
                to_name: responde.data.email,

            }
            console.log(templateParams)

            emailjs.send(
                'test555',
                'template_p1ojhve',
                templateParams,
                'user_taSKZdwaRwk1j4rwI0eXi'
            )
        })
        console.log(this.state.emailPaticipant)
        this.props.history.push('/ListOfEvent')



    }



    render() {
        const { rows, currentUser, auth, setFiles } = this.state;

        if (auth) {
            if (currentUser) {
                return (
                    <Fragment>
                        <Nevbar />
                        <Container fluid>
                            <Row className="mb-4">
                                <Col
                                    xs={{ span: 12 }}
                                    sm={{ span: 8, offset: 2 }}
                                    md={{ span: 8, offset: 2 }}
                                    lg={{ span: 8, offset: 2 }}
                                >
                                    <Form onSubmit={this.handleProcessing.bind(this)} className="text-center">
                                        <h2 className="mb-3">Select Picture of Event</h2>
                                        <Form.Control
                                            multiple
                                            type="file"
                                            onChange={this.handleImageAsFile.bind(this)}
                                        />
                                        <Button type="submit" className="btn-custom mt-3" id="primary" style={{ width: 280, height: 60, fontSize: "21px", borderRadius: 30 }}>Upload Event Picture</Button>
                                    </Form>
                                </Col>
                                <Col
                                    xs={{ span: 12 }}
                                    sm={{ span: 8, offset: 2 }}
                                    md={{ span: 8, offset: 2 }}
                                    lg={{ span: 10, offset: 1 }}
                                    className="mt-4"
                                >
                                    <StorageDataTable
                                        rows={rows}
                                        filesMetadata={this.filesMetadata}
                                        deleteData={this.deleteMetaDataFromDatabase.bind(this)}
                                    />
                                </Col>
                                <Col
                                    xs={{ span: 12 }}
                                    sm={{ span: 8, offset: 2 }}
                                    md={{ span: 8, offset: 2 }}
                                    lg={{ span: 10, offset: 1 }}
                                    className="text-lg-right"
                                >
                                    <Link to={"/ListofParticipant/"+this.state.event_id} >
                                        <Button className="btn-custom mt-3" id="primary" style={{ width: 300, height: 55, fontSize: "20px", borderRadius: 30 }}>
                                            Next
                                    </Button>
                                    </Link>
                                </Col>
                            </Row>
                        </Container>
                    </Fragment >
                )
            }
            if (!currentUser) {
                return (
                    <Redirect to="/Login" />
                )
            }
        }
        else {
            return (
                <div>Loading</div>
            )
        }
    }
}

export default UploadFunction;