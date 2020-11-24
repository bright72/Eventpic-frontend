import React, { Component, Fragment } from 'react';
import { Link, Redirect } from 'react-router-dom'
import { Form, Row, Col, Button, Container } from 'react-bootstrap'
import firebase from './firebase';
import StorageDataTable from './StorageDataTable';
import Nevbar from './Nevbar.js'

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
        participant_id: "",
        keypath: "",
        imageAsFile: "",
        emailPaticipant: "",
        img: []
    }

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
                }
            });
        })
    }

    getKey = (user) => {
        return new Promise((resolve, reject) => {
            firebase.database().ref("organizers").orderByChild("email").equalTo(user.email)
                .on("child_added", function (snapshot) {
                    resolve(snapshot.key)
                })
        })
    }

    //โหลดข้อมูล Metadata จาก Firebase
    getMetaDataFromDatabase() {
        const databaseRef = firebase.database().ref(`organizers/${this.state.keypath}/events/${this.state.event_id ? this.state.event_id : null}/event_pics`);
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

        const storageRef = firebase.storage().ref(`eventpics/${rowData.name}`)
        // Delete the file on storage
        storageRef.delete()
            .then(() => {
                const databaseRef = firebase.database().ref(`organizers/${this.state.keypath}/events/${this.state.event_id ? this.state.event_id : null}/event_pics`)
                // Delete the file on realtime database
                databaseRef.child(rowData.key).remove()
                    .then(() => {
                        this.getMetaDataFromDatabase()
                    })
                    .catch((error) => {
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
            let downloadUrl = await firebase.storage().ref(`eventpics/${fileData.metadataFile.name}`).getDownloadURL()
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

        })
    }

    handleImageAsFile = (e) => {
        const images = e.target.files
        this.setState({
            files: images
        })
    }

    async handleProcessing(e) {
        e.preventDefault();
        // handle file upload here
        for (const [key, file] of Object.entries(this.state.files)) {
            //console.log(`[${key}] ${file.name}`)
            let storageRef = firebase.storage().ref(`eventpics/${file.name}`)
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
                    const databaseRef = firebase.database().ref(`organizers/${this.state.keypath}/events/${this.state.event_id}/event_pics`);
                    databaseRef.push({
                        metadataFile, is_allow_all_panticipant
                    })
                }).catch(function (error) {
                    console.log(`Upload error : ${error.message}`)
                })
        }
    }

    render() {
        const { rows, currentUser, auth } = this.state;
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
                                    <Link to={`/Process/${this.state.event_id}`} >
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