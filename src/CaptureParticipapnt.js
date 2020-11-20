import React, { useEffect } from "react";
import Webcam from "react-webcam";
import { Button, Row, Col } from "react-bootstrap";
import firebase from "./firebase";
import * as faceapi from "face-api.js";
import $ from "jquery";

const CaptureParticipapnt = (props) => {
  const webcamRef = React.useRef(null);
  const [imgSrc, setImgSrc] = React.useState(null);
  const capture = React.useCallback(async () => {
    const imgSrc = webcamRef.current.getScreenshot();
    console.log(imgSrc) //base64
    let file = dataURLtoFile(imgSrc, "temp.jpg"); //แปลง
    // let file = dataURLtoFile(imgSrc, `${i}.jpg`);
    setImgSrc(imgSrc);
    //console.log(file)
    //props.setFile(file);
  }, [webcamRef, setImgSrc]);
  //console.log(imgSrc);
  // let message = imgSrc;
  // let storageRef = firebase.storage().ref('image');
  // storageRef.putString(message, 'data_url').then(function (snapshot) {
  //     console.log('Uploaded a data_url string!');
  // });

  const renew = () => {
    setImgSrc(null);
    props.setFile(null);
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
  };

  const extractFace = async (file) => {
    console.log("Hola", $("#hola").get(0));
    if (!$("#hola").get(0)) {
      return;
    }
    if (!isFaceDetectionModelLoaded()) {
      console.log("Loading...");
      await faceapi.nets.ssdMobilenetv1.load("/weights");
      console.log(faceapi);
    }
    console.log("เอารูปไปหาใบหน้า");
    const detections = await faceapi.detectAllFaces($("#hola").get(0), new faceapi.SsdMobilenetv1Options(0.5));
    const faceImages = await faceapi.extractFaces(
      $("#hola").get(0),
      detections
    );
    
    console.log("test", faceImages);
    displayExtractedFaces(faceImages)
  };

  const getCurrentFaceDetectionNet = async () => {
    return await faceapi.nets.ssdMobilenetv1;
  };

  const displayExtractedFaces = (faceImages) => {
    const canvas = document.createElement('img')
    console.log("Canvas: ", canvas)
    faceapi.matchDimensions(canvas, $('#hola').get(0))
    faceImages.forEach(canvas => $('#facesContainer').append(canvas))
    Array.from($('#facesContainer').children()).map(elem => {
      //console.log(elem.toDataURL())
      let file = dataURLtoFile(elem.toDataURL(), "temp.jpg");
      console.log(file)
      props.setFile(file);
    })
  }

  const isFaceDetectionModelLoaded = () => {
    return !!getCurrentFaceDetectionNet().params;
  };

//   useEffect(() => {
//     if ($("#hola")) {
//       isFaceDetectionModelLoaded();
//       extractFace();
//     }
//   }, null);

  return (
    <Row>
      <Col className="text-center mt-3">
        {imgSrc ? (
          <img id="hola" src={imgSrc} />
        ) : (
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
        )}
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
        <Button id="primary" className="btn-custom mr-2" onClick={capture}>
          Capture
        </Button>
        <Button id="primary" className="btn-custom mr-2" onClick={extractFace}>
          Confirm
        </Button>
        <Button
          id="primary"
          type="submit"
          className="btn-custom"
          disabled={imgSrc === null}
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
