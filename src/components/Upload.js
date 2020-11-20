import React, { useState, Component } from 'react';
import firebase, { storage } from '../firebase';

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
        files.forEach(file => {
            const uploadTask =
                firebase.storage().ref().child(`eventpic/${file.name}`).put(file);
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
                    setURL(URLs => [...URLs, { index: URLs.length, value: downloadURL }])
                    // do something with the url
                }
            );
        });
        Promise.all(promises)
            .then(() => alert('All files uploaded'))
            .catch(err => console.log(err.code));
    }

    return (
        
        <div>
            <form>
                <label>Select Files
            <input type="file" multiple onChange={onFileChange} />
            
                </label>
                <button onClick={onUploadSubmission}>Upload</button>
            </form>
                {URLs.map(url => <div class="crop">
                                    <img src={url.value}/>
                                </div>)}
            {/* <li key={URLs.index}><img src = {URLs.value}/></li> */}
        </div>
    )
}
export default Upload;