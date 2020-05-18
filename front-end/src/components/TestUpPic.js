import React, { useState, useEffect, Component } from 'react';
import firebase, { storage } from '../firebase';
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

        //setURL([...URLs, { url }]);
        //console.log(url);
    }

    // useEffect(() => {
    //     // Should not ever set state during rendering, so do this in useEffect instead.
    //     setURL(url);
    //   }, []);


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