import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom'
import { FilePond, File, registerPlugin } from 'react-filepond';
import firebase from '../firebase/index';
import StorageDataTable from './StorageDataTable';
import Nevbar from '../Nevbar.js'

// Import FilePond styles
import 'filepond/dist/filepond.min.css';

// Register plugin
import FilePondImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

registerPlugin(FilePondImagePreview);

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

    handleInit() {
        // handle init file upload here
        console.log('now initialised', this.pond);
    }

    handleProcessing(fieldName, file, metadata, load, error, progress, abort) {
        // handle file upload here
        console.log(" handle file upload here");
        console.log(this.state.filesMetadata);

        const fileUpload = file;
        const storageRef = firebase.storage().ref(`images/${file.name}`)

        const task = storageRef.put(fileUpload)

        task.on(`state_changed`, (snapshot) => {
            console.log(`Snapshot: ${snapshot.val}`)
            let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            //Process
            this.setState({
                uploadValue: percentage
            })
        }, (error) => {

            console.log(`Upload error : ${error.message}`)

        }, (response) => {


            storageRef.getMetadata()
                .then((metadata) => {

                    // Metadata now contains the metadata for 'filepond/${file.name}'
                    let metadataFile = {
                        name: metadata.name,
                        size: metadata.size,
                        contentType: metadata.contentType,
                        fullPath: metadata.fullPath,
                        downloadURLs: "",
                    }
                    const databaseRef = firebase.database().ref(`user/${this.state.keypath ? this.state.keypath : null}/event/${this.state.event_id ? this.state.event_id : null}/images`);
                    console.log(metadataFile)
                    databaseRef.push({
                        metadataFile
                    })

                }).catch(function (error) {
                    this.setState({
                        messag: `Upload error : ${error.message}`
                    })
                })
        })
    }


    render() {
        const { rows, currentUser, auth, setFiles } = this.state;

        if (auth) {
            if (currentUser) {
                return (
                    <div className="App">
                        <Nevbar />
                        <div className="Margin-25">
                            <FilePond allowMultiple={true}
                                maxFiles={100}
                                onupdatefiles={setFiles}
                                ref={ref => this.pond = ref}
                                server={{ process: this.handleProcessing.bind(this) }}
                                oninit={() => this.handleInit()}>
                                {this.state.files.map(file => (
                                    <File key={file} source={file} />
                                ))}
                            </FilePond>
                            <StorageDataTable
                                rows={rows}
                                filesMetadata={this.filesMetadata}
                                deleteData={this.deleteMetaDataFromDatabase.bind(this)}
                            />
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
                <div>Loading</div>
            )
        }
    }
}


export default UploadFunction;