import React, { useEffect } from "react";
import Webcam from "react-webcam";
import { Button, Row, Col } from "react-bootstrap";
import firebase from "./firebase";
import * as faceapi from "face-api.js";
import $ from "jquery";
import { Link } from "react-router-dom";

const CaptureParticipapnt = (props) => {
  const webcamRef = React.useRef(null);
  const [imgSrc, setImgSrc] = React.useState([]);
  const [test, setTest] = React.useState(true);

  const capture = React.useCallback(async () => {

    if(imgSrc.length === 2){
      props.setFile(imgSrc)
      setTest(false)
    }
    const shot = await webcamRef.current.getScreenshot()
    let file = dataURLtoFile(shot, "temp.jpg"); //แปลง
    imgSrc.push(file)
    console.log(imgSrc)

  }, [webcamRef])

  const renew = () => {
    imgSrc.splice(0,5)
    props.setFile([])
    setTest(true)
  }

  const dataURLtoFile = (dataurl, filename) => {
    var arr = dataurl.split(","),
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
      <Col className="text-center mt-3">
      
        
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width={600}
              videoConstraints={{
                width: 1280,
                height: 720,
                facingMode: "user",
              }}
            />
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
        <Button
          id="primary"
          className="btn-custom mr-2"
          onClick={capture}
          disabled={!test}
        >
          Capture
        </Button>
        <Button
          id="primary"
          type="submit"
          className="btn-custom"
          disabled={test}
          // disabled={imgSrc.length === 1 ? false : true}
        >
          Comfirm
        </Button>
        
      </Col>
    </Row>
  );
};

export default CaptureParticipapnt;
