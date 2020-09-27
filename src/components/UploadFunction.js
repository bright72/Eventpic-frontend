import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom'
// import { FilePond, registerPlugin, File } from 'react-filepond';
import { Form, Input, Button } from 'react-bootstrap'


import firebase from '../firebase/index';
import StorageDataTable from './StorageDataTable';
import Nevbar from '../Nevbar.js'
import axios from "axios";
import * as emailjs from 'emailjs-com'
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
    // Initialize Firebase


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

    //โหลดข้อมูลเข้า list table
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
                    const databaseRef = firebase.database().ref(`user/${this.state.keypath}/event/${this.state.event_id}/images`);
                    console.log(metadataFile)
                    databaseRef.push({
                        metadataFile
                    })
                }).catch(function (error) {
                    console.log(`Upload error : ${error.message}`)
                })
        }

    }

    onclickrespond = () => {
        console.log("teasdfsf");
        axios.get("/emailbakcend").then(responde => {
            console.log(responde.data);
            this.setState({
                emailPaticipant: responde.data.email,
                img: responde.data.img
            })
        })
    }

    handleSubmit = () => {
        const {emailPaticipant} = this.state
        console.log("teasdfsf");
        axios.get("/emailbakcend").then(responde => {
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
    
            emailjs.send(
                'test555',
                'template_p1ojhve',
                templateParams,
                'user_taSKZdwaRwk1j4rwI0eXi'
            )
        })
        console.log(this.state.emailPaticipant)



    }



    render() {
        const { rows, currentUser, auth, setFiles } = this.state;

        if (auth) {
            if (currentUser) {
                return (
                    <div className="App">
                        {/* <Nevbar /> */}
                        <div className="Margin-25">
                            <Form onSubmit={this.handleProcessing.bind(this)}>
                                <label>Select Files
                                    <Form.Control
                                        multiple
                                        type="file"
                                        onChange={this.handleImageAsFile.bind(this)}
                                    />
                                </label>
                                <button type="submit">upload to firebase</button>
                            </Form>

                            <div>

                                {/* <label>Select Files
                                     <input type="file" multiple value={this.state.files} />
                                </label>
                                <button onClick={this.handleProcessing.bind(this)}>Upload</button> */}
                                {/* {this.state.files.map(file => (
                                    <File key={file} source={file} />
                                ))} */}

                                {/* {URLs.map(url => <div class="crop">
                                    <img src={url.value} />
                                </div>)}
                                 <li key={URLs.index}><img src = {URLs.value}/></li>  */}
                            </div>

                            {/* <FilePond
                                files={this.state.files}
                                allowMultiple={true}
                                maxFiles={5}
                                // ref={ref => this.pond = ref}
                                server={{
                                    process: this.handleProcessing.bind(this),
                                    //  revert: null
                                }}
                                oninit={() => this.handleInit()}
                            >
                                {this.state.files.map(file => (
                                    <File key={file} source={file} />
                                ))}
                            </FilePond> */}

                            <StorageDataTable
                                rows={rows}
                                filesMetadata={this.filesMetadata}
                                deleteData={this.deleteMetaDataFromDatabase.bind(this)}
                            />
                            <Button onClick={this.handleSubmit}>Process and send email</Button>
                        </div>
                    </div>
                );
            }
            if (!currentUser) {
                return (
                    <Redirect to="/Login" />
                )
            }
        }
        else {
            return (
                <div> Loading</div>
            )
        }
    }
}
// import React, { useState, Component } from 'react';
// import firebase, { storage } from '../firebase';

// const UploadFunction = (props) => {

//     const [files, setFiles] = useState([])
//     const [URLs, setURL] = useState([])
//     //const urls2 = [];

//     const onFileChange = e => {
//         for (let i = 0; i < e.target.files.length; i++) {
//             const newFile = e.target.files[i];
//             newFile["id"] = Math.random();
//             // add an "id" property to each File object
//             setFiles(prevState => [...prevState, newFile]);
//         }
//     };

//     const onUploadSubmission = e => {
//         e.preventDefault(); // prevent page refreshing
//         const promises = [];
//         files.forEach(file => {
//             const uploadTask =
//                 firebase.storage().ref().child(`image/${file.name}`).put(file);
//             promises.push(uploadTask);
//             uploadTask.on(
//                 firebase.storage.TaskEvent.STATE_CHANGED,
//                 snapshot => {
//                     const progress =
//                         ((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
//                     if (snapshot.state === firebase.storage.TaskState.RUNNING) {
//                         console.log(`Progress: ${progress}%`);
//                     }
//                 },
//                 error => console.log(error.code),
//                 async () => {
//                     const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
//                     setURL(URLs => [...URLs, { index: URLs.length, value: downloadURL }])
//                     // do something with the url
//                 }
//             );
//         });
//         Promise.all(promises)
//             // .then(() => alert('All files uploaded'))
//             // .catch(err => console.log(err.code));
//     }

//     return (

//         <div>

//             <label>Select Files
//             <input type="file" multiple onChange={onFileChange} />
//             </label>
//             <button onClick={onUploadSubmission}>Upload</button>

//             {URLs.map(url => <div class="crop">
//                 <img src={url.value} />
//             </div>)}
//             {/* <li key={URLs.index}><img src = {URLs.value}/></li> */}
//         </div>
//     )
// }

export default UploadFunction;