import React, { Component } from 'react'
import { Table } from 'react-bootstrap'


class StorageDataTable extends Component {

    constructor(props) {
        super(props);
    }

    
    render() {
        let messageNodes = this.props.rows.map((r) => {
            return (
                <tr key={r.no + r.name}>
                    <td>{r.name}</td>
                    <td><a target="_blank" href={r.downloadURLs}>Download</a></td>
                    <td><a target="_blank" href="" onClick={(e) => this.props.deleteData(e,r)}>Delete</a></td>
                </tr>
            )
        });
        return (
            <div>
                <Table striped bordered hover style={{ fontSize: 22}}>
                    <thead>
                        <tr>
                            <th>File Name</th>
                            <th>Download</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {messageNodes}
                    </tbody>
                </Table>
            </div>
          );
    }
}
export default StorageDataTable;