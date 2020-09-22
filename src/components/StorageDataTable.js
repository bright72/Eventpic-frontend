import React, { Component } from 'react';

class StorageDataTable extends Component {

    constructor(props) {
        super(props);
        this.state = {
            files: [], //ใช้เก็บข้อมูล File ที่ Upload
        };
    }

    handleInit() {
        // handle init file upload here
        console.log('now initialised', this.pond);
    }

    handleProcessing(fieldName, file, metadata, load, error, progress, abort) {
        // handle file upload here
        console.log(" handle file upload here");
        console.log(file);
    }

    render() {
        return (
            <div className="App">
                <div className="Margin-25">

                    {/* Pass FilePond properties as attributes */}
                    <FilePond allowMultiple={true}
                        maxFiles={3}
                        ref={ref => this.pond = ref}
                        server={{ process: this.handleProcessing.bind(this) }}
                        oninit={() => this.handleInit()}>

                        {/* Set current files using the <File/> component */}
                        {this.state.files.map(file => (
                            <File key={file} source={file} />
                        ))}

                    </FilePond>

                </div>
            </div>
        );
    }

}

export default StorageDataTable;