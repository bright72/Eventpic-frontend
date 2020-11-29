import React, { Fragment } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { Button, Container, Col, Card } from 'react-bootstrap'
import firebase from './firebase'
import Nevbar from './Nevbar.js'
import Loading from './Loading.js'

class MoreDetail extends React.Component {

    constructor(props) {
        super()
        this.state = {
            event_id: props.match.params.id,
            name: '',
            detail: '',
            start_date: '',
            end_date: '',
            start_time: '',
            end_time: '',
            dateline: '',
            is_pic_processed: false,
            currentUser: null,
            auth: false
        }
    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.setState({
                    currentUser: user
                })
            }
            this.setState({
                auth: true
            })
            let self = this
            firebase.database().ref("organizers").orderByChild("email").equalTo(user.email)
                .on("child_added", async function (snapshot) {
                    const itemsRef = firebase.database().ref(`/organizers/${snapshot.key}/events`)
                    itemsRef.child(self.state.event_id).on("value", (snapshot) => {
                        let item = snapshot.val()
                        if (item) {
                            self.setState({
                                event_id: self.state.event_id,
                                name: item.name,
                                detail: item.detail,
                                start_date: item.start_date,
                                end_date: item.end_date,
                                start_time: item.start_time,
                                end_time: item.end_time,
                                dateline: item.dateline,
                                is_pic_processed: item.is_pic_processed,

                            })
                        }
                    })
                })
        })
    }

    removeItem = event_id => {
        let keypath = ""
        firebase.database().ref("organizers").orderByChild("email").equalTo(this.state.currentUser.email)
            .on("child_added", function (snapshot) {
                keypath = snapshot.key
            })
        const itemsRef = firebase.database().ref(`organizers/${keypath}/events`)
        itemsRef.child(event_id).remove()
        this.props.history.push('/ListofEvent')
    }

    render() {
        const { currentUser, auth, is_pic_processed } = this.state
        if (auth) {
            if (currentUser) {
                return (
                    <Fragment>
                        <Nevbar />
                        <Container fluid>
                            <Col
                                xs={12}
                                sm={{ span: 10 }}
                                md={{ span: 10 }}
                                lg={{ span: 8, offset: 2 }}
                            >
                                <div className="mb-3">
                                    <h2 className="mr-4" style={{ textDecoration: "underline", display: "inline-block" }}>รายละเอียดกิจกรรม</h2>

                                    <Link to={"/EditEvent/" + this.state.event_id}   >
                                        <Button className=" ml-2 px-3 mb-2" variant="outline-dark" style={{ borderRadius: 20 }}>
                                            แก้ไขกิจกรรม
                                            </Button>
                                    </Link>
                                    <Button className=" ml-2 px-4 mb-2" variant="outline-danger" style={{ borderRadius: 20 }} onClick={() => this.removeItem(this.state.event_id)}>ลบกิจกรรม</Button>
                                </div>
                                <div style={{ fontSize: 25, marginBottom: 10 }}>
                                    <span style={{ fontWeight: 500 }}>ชื่อกิจกรรม : </span>
                                    {this.state.name}
                                </div>
                                <div style={{ fontSize: 22, marginBottom: 10 }}>
                                    <span style={{ fontWeight: 500 }}>รายละเอียด : </span>
                                    {this.state.detail}
                                </div>
                                <div style={{ fontSize: 22, marginBottom: 10 }}>
                                    <span style={{ fontWeight: 500 }}>วันที่จัดงาน : </span>
                                    {this.state.start_date} - {this.state.end_date}
                                </div>
                                <div style={{ fontSize: 22, marginBottom: 10 }}>
                                    <span style={{ fontWeight: 500 }}>วันสิ้นสุดการประมวลผล : </span>
                                    {this.state.dateline}
                                </div>
                            </Col>
                            <Col
                                xs={12}
                                sm={{ span: 10 }}
                                md={{ span: 10 }}
                                lg={{ span: 8, offset: 2 }}
                                style={{marginTop:30}}
                            >
                                <div className="text-right">
                                    <Link to={"/Upload/" + this.state.event_id} >
                                        <Button className="btn-custom ml-2" id="primary" disabled={is_pic_processed} >อัพโหลดเเละประมวลผลภาพถ่าย</Button>
                                    </Link >
                                    <Link to={"/DownloadPictures/" + this.state.event_id} >
                                        <Button className="btn-custom ml-2" id="primary" disabled={!is_pic_processed} >ดาวน์โหลดรูปภาพ</Button>
                                    </Link >
                                    <Link to={"/UploadParticipant/" + this.state.event_id} >
                                        <Button className="btn-custom ml-2" id="primary">เพิ่มผู้เข้าร่วม</Button>
                                    </Link >
                                    <Link to={"/ListofParticipant/" + this.state.event_id} >
                                        <Button className="btn-custom ml-2" id="primary">รายการผู้เข้าร่วม</Button>
                                    </Link >
                                </div>
                            </Col>
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
                <Loading />
            )
        }
    }
}

export default MoreDetail
