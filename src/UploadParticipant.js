import React, { Component, Fragment } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { Form, Button, Container, Row, Col, Alert, Card } from 'react-bootstrap'
import Nevbar from './Nevbar.js'
import './Style.css'
import firebase from './firebase'
import { withRouter } from 'react-router-dom'


const { Group, Label, Control } = Form
    class UploadParticipant extends Component {

        state = {
            event_id: this.props.match.params.id,
            keypath: '',
            participant_id: '',
            email: '',
            currentUser: null,
            auth: false,
            validate: false,
            showAlert: false
        }


        // this.handleChange = this.handleChange.bind(this)
        // this.handleSubmit = this.handleSubmit.bind(this)


        async componentWillMount() {

            let user = await this.getUser();
            let key = await this.getKey(user)
            this.setState({
                currentUser: user,
                keypath: key,
                auth: true
            })
            // this.getMetaDataFromDatabase()


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

        handleChange = e => {
            const { name, value } = e.target
            this.setState({
                [name]: value
            })
        }

        handleSubmit = e => {
            e.preventDefault()
            const form = e.currentTarget
            if (form.checkValidity() === true) {
                let keypath = ""
                firebase.database().ref("user").orderByChild("email").equalTo(this.state.currentUser.email)
                    .on("child_added", function (snapshot) {
                        keypath = snapshot.key
                    })
                const itemsRef = firebase.database().ref(`user/${keypath}/event/${this.state.event_id}/participant`)
                const item = {
                    email: this.state.email,
                    is_select_image: false,
                    panticipant_picture_confirm: false
                }
                itemsRef.push(item)
                this.props.history.push('/MoreDetail/' + this.state.event_id)
            } else {
                this.setState({
                    validate: true
                })
                e.stopPropagation()
            }
        }


        render() {
            const { currentUser, auth, validate, showAlert } = this.state
        
            if (auth) {
                if (currentUser) {
                    return (
                        <Fragment>
                            <Nevbar />
                            <Container fluid>
                                <Row>
                                    <Col
                                        xxs={12}
                                        sm={{ span: 10, offset: 1 }}
                                        md={{ span: 8, offset: 2 }}
                                        lg={{ span: 4, offset: 4 }}
                                        style={{ marginTop: 20 }}
                                    >
                                        <Card className="form-card p-2">
                                            <Col>
                                                <h2 className="title-lable my-4 pt-3 text-center" id="card-title">PARTICIPANT</h2>
                                                <Form noValidate validated={validate} onSubmit={this.handleSubmit} className="form m-4 px-4">
                                                    <Form.Label className="title-lable">EMAIL</Form.Label>
                                                    <Form.Group controlId="formBasicEmail" >
                                                        <Form.Control className="form form-input" name="email" onChange={this.handleChange} type="email" placeholder="Email" required />
                                                    </Form.Group>
                                                    <Button id="primary-auth" block type="submit" className="btn-custom my-4" >
                                                        REGISTER
                                </Button>
                                                    <p className="divider-title mt-4 mb-5 text-center">Already have an account? <Link to="/Login" className="link-path">Login</Link></p>
                                                </Form>
                                            </Col>
                                        </Card>
                                    </Col>
                                </Row>
                            </Container>
                        </Fragment>
                    )
                }
                if (!currentUser) {
                    return (
                        <Redirect to="/Login" />
                    )
                }
            } else {
                return (
                    <div>Loading</div>
                )
            }

        }
    }

    export default UploadParticipant;


    
      










// import React, { Component, Fragment } from 'react';
// import { Link, Redirect } from 'react-router-dom'
// import { FilePond, File, registerPlugin } from 'react-filepond';
// import firebase from './firebase/index';
// import StorageDataTable from './components/StorageDataTable';
// import Nevbar from './Nevbar.js'

// // Import FilePond styles
// import 'filepond/dist/filepond.min.css';

// // Register plugin
// import FilePondImagePreview from 'filepond-plugin-image-preview';
// import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

// registerPlugin(FilePondImagePreview);

// class UploadParticipant extends Component {

//     state = {
//         files: [], //ใช้เก็บข้อมูล File ที่ Upload
//         setFiles: [],
//         uploadValue: 0, //ใช้เพื่อดู Process การ Upload
//         filesMetadata: [], //ใช้เพื่อรับข้อมูล Metadata จาก Firebase
//         rows: [], //ใช้วาด DataTable
//         event_id: this.props.match.params.id,
//         currentUser: null,
//         auth: false,
//         keypath: '',


//     }
//     // Initialize Firebase


//     //ใช้ตอนที่ยังไม่ Mount DOM
//     async componentWillMount() {

//         let user = await this.getUser();
//         let key = await this.getKey(user)
//         this.setState({
//             currentUser: user,
//             keypath: key,
//             auth: true
//         })
//         this.getMetaDataFromDatabase()

//     }

//     getUser = () => {
//         return new Promise((resolve, reject) => {
//             firebase.auth().onAuthStateChanged(function (user) {
//                 if (user) {
//                     resolve(user)
//                 } else {
//                     // No user is signed in.
//                 }
//             });
//         })
//     }

//     getKey = (user) => {
//         return new Promise((resolve, reject) => {
//             firebase.database().ref("user").orderByChild("email").equalTo(user.email)
//                 .on("child_added", function (snapshot) {
//                     resolve(snapshot.key)
//                 })
//         })
//     }




//     //โหลดข้อมูล Metadata จาก Firebase

//     getMetaDataFromDatabase() {
//         const databaseRef = firebase.database().ref(`user/${this.state.keypath}/event/${this.state.event_id ? this.state.event_id : null}/images`);

//         databaseRef.on('value', snapshot => {
//             this.setState({
//                 filesMetadata: snapshot.val()
//             }, () => {
//                 this.addMetadataToList()
//             });
//         });
//     }

//     //ลบข้อมูล Metada จาก Firebase
//     deleteMetaDataFromDatabase(e, rowData) {

//         const storageRef = firebase.storage().ref(`participant/${rowData.name}`)
//         // Delete the file on storage
//         storageRef.delete()
//             .then(() => {
//                 console.log("Delete file success");
//                 console.log("+555" + this.state.keypath)
//                 const databaseRef = firebase.database().ref(`user/${this.state.keypath}/event/${this.state.event_id ? this.state.event_id : null}/images`)
//                 // Delete the file on realtime database
//                 databaseRef.child(rowData.key).remove()
//                     .then(() => {
//                         console.log("Delete metada success");
//                         this.getMetaDataFromDatabase()
//                     })
//                     .catch((error) => {
//                         console.log("Delete metada error : ", error.message);
//                     });

//             })

//             .catch((error) => {
//                 console.log("Delete file error : ", error.message);
//             });


//     }

//     //โหลดข้อมูลเข้า list table
//     async addMetadataToList() {
//         let i = 1;
//         let rows = [];

//         //Loop add data to rows
//         for (let key in this.state.filesMetadata) {

//             let fileData = this.state.filesMetadata[key];

//             let downloadUrl = await firebase.storage().ref(`images/${fileData.metadataFile.name}`).getDownloadURL()

//             let objRows = {
//                 no: i++,
//                 key: key, //ใช้เพื่อ Delete
//                 name: fileData.metadataFile.name,
//                 downloadURLs: downloadUrl,
//                 fullPath: fileData.metadataFile.fullPath,
//                 size: (fileData.metadataFile.size),
//                 contentType: fileData.metadataFile.contentType,
//             }

//             rows.push(objRows)
//         }

//         this.setState({
//             rows: rows
//         }, () => {
//             console.log('Set Rows')
//         })

//     }

//     handleInit() {
//         // handle init file upload here
//         console.log('now initialised', this.pond);
//     }

//     handleProcessing(fieldName, file, metadata, load, error, progress, abort) {
//         // handle file upload here
//         console.log(" handle file upload here");
//         console.log(this.state.filesMetadata);

//         const fileUpload = file;
//         const storageRef = firebase.storage().ref(`images/${file.name}`)

//         const task = storageRef.put(fileUpload)

//         task.on(`state_changed`, (snapshot) => {
//             console.log(`Snapshot: ${snapshot.val}`)
//             let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//             //Process
//             this.setState({
//                 uploadValue: percentage
//             })
//         }, (error) => {

//             console.log(`Upload error : ${error.message}`)

//         }, (response) => {


//             storageRef.getMetadata()
//                 .then((metadata) => {

//                     // Metadata now contains the metadata for 'filepond/${file.name}'
//                     let metadataFile = {
//                         name: metadata.name,
//                         size: metadata.size,
//                         contentType: metadata.contentType,
//                         fullPath: metadata.fullPath,
//                         downloadURLs: "",
//                     }
//                     const databaseRef = firebase.database().ref(`user/${this.state.keypath ? this.state.keypath : null}/event/${this.state.event_id ? this.state.event_id : null}/images`);
//                     console.log(metadataFile)
//                     databaseRef.push({
//                         metadataFile
//                     })

//                 }).catch(function (error) {
//                     this.setState({
//                         messag: `Upload error : ${error.message}`
//                     })
//                 })
//         })
//     }


//     render() {
//         const { rows, currentUser, auth, setFiles } = this.state;

//         if (auth) {
//             if (currentUser) {
//                 return (
//                     <Fragment>
//                         <Nevbar />
//                         <div className="Margin-25">
//                             <FilePond allowMultiple={true}
//                                 maxFiles={100}
//                                 onupdatefiles={setFiles}
//                                 ref={ref => this.pond = ref}
//                                 server={{ process: this.handleProcessing.bind(this) }}
//                                 oninit={() => this.handleInit()}>
//                                 {this.state.files.map(file => (
//                                     <File key={file} source={file} />
//                                 ))}
//                             </FilePond>
//                             <StorageDataTable
//                                 rows={rows}
//                                 filesMetadata={this.filesMetadata}
//                                 deleteData={this.deleteMetaDataFromDatabase.bind(this)}
//                             />
//                         </div>
//                     </Fragment>
//                 );
//             }
//             if (!currentUser) {
//                 return (
//                     <Redirect to="/Login" />
//                 )
//             }
//         }
//         else {
//             return (
//                 <div>Loading</div>
//             )
//         }
//     }
// }


// export default UploadParticipant;