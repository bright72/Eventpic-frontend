import React, { Component, Fragment } from 'react'
import { Table, Image, ButtonGroup, Button, ToggleButton, Card, Col, CardDeck, CardColumns } from 'react-bootstrap'


class StorageDataTable extends Component {

    constructor() {
        super()
        this.state = {
            radioValue: '1',
        }
    }

    render() {
        let { radioValue } = this.state

        const radios = [
            { name: 'List', value: '1' },
            { name: 'Box', value: '2' },
        ]

        let listsOfPicture = this.props.rows.map((r, index) => {
            return (
                <tr key={r.no + r.name}>
                    <td>{++index}</td>
                    <td>{r.name}</td>
                    <td><a href="#" onClick={(e) => this.props.deleteData(e, r)}>Delete</a></td>
                </tr>
            )
        })

        let BoxsOfPicture = this.props.rows.map((r, index) => {
            return (
                <Card>
                    <Card.Img variant="top" src={r.downloadURLs} />
                    <Card.Body>
                        <Card.Text>{r.name}</Card.Text>
                        <Button className="btn-custom mt-3" id="primary"
                            onClick={(e) => this.props.deleteData(e, r)}
                            style={{ width: 300, height: 55, fontSize: "20px", borderRadius: 30 }}>
                            Delete
                        </Button>
                    </Card.Body>
                </Card>
            )
        })

        return (
            <Fragment>
                <div className="text-right mb-4">
                    <ButtonGroup toggle >
                        {radios.map((radio, idx) => (
                            <ToggleButton
                                key={idx}
                                type="radio"
                                variant="secondary"
                                name="radio"
                                size="lg"
                                value={radio.value}
                                checked={radioValue === radio.value}
                                onChange={(e) => this.setState({ radioValue: e.currentTarget.value })}
                            >
                                {radio.name}
                            </ToggleButton>
                        ))}
                    </ButtonGroup>
                </div>
                { radioValue === '1' ?
                    <Table striped bordered hover style={{ fontSize: 22 }}>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>File Name</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listsOfPicture}
                        </tbody>
                    </Table>
                    :
                    <CardColumns>
                        {BoxsOfPicture}
                    </CardColumns>
                }
            </Fragment >
        );
    }
}
export default StorageDataTable;