import React, { Component } from 'react';
import { FilePond, File, registerPlugin } from 'react-filepond';
import firebase from '../firebase/index';
import StorageDataTable from './StorageDataTable';
import Nevbar from '../Nevbar.js'

import '../App.css';

// Import FilePond styles
import 'filepond/dist/filepond.min.css';

// Register plugin
import FilePondImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

registerPlugin(FilePondImagePreview);

class UploadFunction extends Component {
    constructor(props) {
        super(props);

        this.state = {
            files: [], //ใช้เก็บข้อมูล File ที่ Upload
            uploadValue: 0, //ใช้เพื่อดู Process การ Upload
            filesMetadata: [], //ใช้เพื่อรับข้อมูล Metadata จาก Firebase
            rows: [], //ใช้วาด DataTable
        };
    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.getMetaDataFromDatabase()
                this.setState({
                    currentUser: user
                })
            }
            this.setState({
                auth: true
            })
        })
    }

    //โหลดข้อมูล Metadata จาก Firebase
    getMetaDataFromDatabase() {
        console.log("getMetaDataFromDatabase");
        const databaseRef = firebase.database().ref('/events');

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

        const storageRef = firebase.storage().ref(`events/${rowData.name}`);

        // Delete the file on storage
        storageRef.delete()
            .then(() => {
                console.log("Delete file success");

                let databaseRef = firebase.database().ref('/events');

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
    addMetadataToList() {
        let i = 1;
        let rows = [];

        //Loop add data to rows
        for (let key in this.state.filesMetadata) {

            let fileData = this.state.filesMetadata[key];

            let objRows = {
                no: i++,
                key: key, //ใช้เพื่อ Delete
                name: fileData.metadataFile.name,
                downloadURLs: fileData.metadataFile.downloadURLs,
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
        console.log(file);

        const fileUpload = file;
        const storageRef = firebase.storage().ref(`events/${file.name}`);
        const task = storageRef.put(fileUpload)

        task.on(`state_changed`, (snapshort) => {
            console.log(snapshort.bytesTransferred, snapshort.totalBytes)
            let percentage = (snapshort.bytesTransferred / snapshort.totalBytes) * 100;
            //Process
            this.setState({
                uploadValue: percentage
            })
        }, (error) => {
            //Error
            this.setState({
                messag: `Upload error : ${error.message}`
            })
        }, () => {
            //Success
            this.setState({
                messag: `Upload Success`,
                //picture: task.snapshot.downloadURL //เผื่อนำไปใช้ต่อในการแสดงรูปที่ Upload ไป
            })

            storageRef.getMetadata().then((metadata) => {
                // Metadata now contains the metadata for 'filepond/${file.name}'
                let metadataFile = {
                    name: metadata.name,
                    size: metadata.size,
                    contentType: metadata.contentType,
                    fullPath: metadata.fullPath,
                    downloadURLs: "https://firebasestorage.googleapis.com",
                }

                const databaseRef = firebase.database().ref('/events');

                databaseRef.push({
                    metadataFile
                });

            }).catch(function (error) {
                this.setState({
                    messag: `Upload error : ${error.message}`
                })
            });
        })
    }

    render() {
        const { rows, filesMetadata, Container } = this.state;
        return (
            <div>
                <Nevbar />
                <h1 className="text-center mt-3"> Upload Event Pictures</h1>
                <FilePond
                    allowMultiple={true}
                    maxFiles={3}
                    allowReorder={true}
                    server={{ process: this.handleProcessing.bind(this) }}
                    ref={ref => (this.pond = ref)}
                    oninit={() => this.handleInit()}>
                    {this.state.files.map(file => (
                        <File key={file} source={file} />
                    ))}
                </FilePond>

                <StorageDataTable
                    rows={rows}
                    filesMetadata={filesMetadata}
                    deleteData={this.deleteMetaDataFromDatabase}
                />

                {/* <li key={URLs.index}><img src = {URLs.value}/></li> */}
            </div>
        );
    }
}

export default UploadFunction;