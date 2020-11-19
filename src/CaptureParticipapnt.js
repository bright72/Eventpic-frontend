import React from 'react'
import Webcam from 'react-webcam'
import { Button, Row, Col } from 'react-bootstrap'
import firebase from './firebase'

const CaptureParticipapnt = (props) => {
    const webcamRef = React.useRef(null)
    const [imgSrc, setImgSrc] = React.useState(null)

    const capture = React.useCallback(
        async () => {
            const imgSrc = webcamRef.current.getScreenshot()
            let file = dataURLtoFile(imgSrc, "temp.jpg")
            setImgSrc(imgSrc)
            props.setFile(file)
        },
        [webcamRef, setImgSrc]

    )
    console.log(imgSrc)
    // let message = imgSrc;
    // let storageRef = firebase.storage().ref('image');
    // storageRef.putString(message, 'data_url').then(function (snapshot) {
    //     console.log('Uploaded a data_url string!');
    // });

    const renew = () => {
        setImgSrc(null)
        props.setFile(null)
    }

    const dataURLtoFile = (dataurl, filename) => {

        var arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);

        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }

        return new File([u8arr], filename, { type: "image/jpeg" });
    }

    return (
        <Row>
            <Col className="text-center mt-3" >
                {imgSrc ?
                    (<img src={imgSrc} />)
                    :
                    (<Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        width={600}
                        videoConstraints={{
                            width: 1280,
                            height: 720,
                            facingMode: "user"
                        }}
                    />)
                }
            </Col>
            <Col
                s={12}
                sm={{ span: 10, offset: 1 }}
                md={{ span: 8, offset: 2 }}
                lg={{ span: 8, offset: 2 }}
                className="text-center my-4"
            >
                <Button id="primary" className="btn-custom mr-2" onClick={renew}>
                    Renew
                </Button>
                <Button id="primary" className="btn-custom mr-2" onClick={capture} >
                    Capture
                </Button>
                <Button id="primary" type="submit" className="btn-custom" disabled={imgSrc === null}>
                    Comfirm
                </Button>
            </Col>
        </Row>
    )
}

export default CaptureParticipapnt

