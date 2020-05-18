import React, { useState, Component } from 'react';
import firebase, { storage } from '../firebase';

const Upload = (props) => {

    const [files, setFiles] = useState([])
    const [URL, setURL] = useState([])

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
        const url = [];
        files.forEach(file => {
            const uploadTask =
                firebase.storage().ref().child(`image/${file.name}`).put(file);
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
                    url.push(downloadURL)
                    console.log(url);
                }
            );
        });
        Promise.all(promises)
            .then(() => alert('All files uploaded'))
            .catch(err => console.log(err.code));
    }

    return (
        <form>
            <label>Select Files
            <input type="file" multiple onChange={onFileChange} />
            </label>
            <button onClick={onUploadSubmission}>Upload</button>
            {URL.map}
        </form>
    )

}

export default Upload;