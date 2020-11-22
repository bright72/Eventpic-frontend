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

  useEffect(() => {
    loadModel()
  })

  const capture = React.useCallback(async () => {
    const shot = await webcamRef.current.getScreenshot()
    if (imgSrc.length === 3) {
      renew()
    }
    let file = dataURLtoFile(shot, "temp.jpg"); //แปลง
    imgSrc.push(file)
    extractFace(shot)
  }, [webcamRef, setImgSrc])

  const renew = () => {
    setImgSrc([])
    props.setFile([])
  };

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


  const loadModel = async () => {
    if (!isFaceDetectionModelLoaded()) {
      console.log("Loading...");
      await faceapi.nets.ssdMobilenetv1.load("/weights");
      console.log(faceapi);
    }
  }

  const extractFace = async (imgBase64) => {
    console.log("เอารูปไปหาใบหน้า")
    const detections = await faceapi.detectAllFaces(imgBase64, new faceapi.SsdMobilenetv1Options(0.5));
    const faceImages = await faceapi.extractFaces(imgBase64,detections)
    console.log("test", faceImages);
    displayExtractedFaces(faceImages,imgBase64)
  }

  const getCurrentFaceDetectionNet = async () => {
    return await faceapi.nets.ssdMobilenetv1;
  };

  const displayExtractedFaces = (faceImages,image) => {
    const canvas = document.createElement('img')
    console.log("Canvas: ", canvas)
    faceapi.matchDimensions(canvas, image)
    faceImages.forEach(canvas => $('#facesContainer').append(canvas))
    //Array.from($('#facesContainer').children()).map(elem => {
    //  let file = dataURLtoFile(elem.toDataURL(), "temp.jpg");
    //  console.log(file)
    //  props.setFile(file);
    //})
  }

  const isFaceDetectionModelLoaded = () => {
    return !!getCurrentFaceDetectionNet().params;
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
        >
          Capture
        </Button>
        <Button
          id="primary"
          type="submit"
          className="btn-custom"
          disabled={imgSrc.length === 3 ? false : true}
        >
          Comfirm
        </Button>
      </Col>
      <canvas id="overlay"></canvas>
      <div id="facesContainer"></div>
    </Row>
  );
};

export default CaptureParticipapnt;
