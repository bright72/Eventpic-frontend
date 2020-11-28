import React, { useEffect } from "react"
import Webcam from "react-webcam"
import { Button, Row, Col, Image } from "react-bootstrap"

const CaptureParticipant = (props) => {
  const webcamRef = React.useRef(null)
  const [imgSrc, setImgSrc] = React.useState([])
  const [headshots, setHeadshots] = React.useState([])
  const [visibleButton, setVisibleButton] = React.useState(true)

  useEffect(() => {
    if (imgSrc.length === 3) {
      setVisibleButton(false)
      props.setFile(imgSrc)
    }
  }, [imgSrc])

  useEffect(() => {
    FetchHeadshot()
  }, [headshots])

  const FetchHeadshot = () => {
    let temp = headshots.map((base64, index) => {
      return (
        <Image
          src={base64}
          rounded
          height={150}
          width={150}
          key={index}
          style={{ marginRight: 20, objectFit:"cover"}}
        />
        )
    })
    return temp
  }

  const capture = async () => {
    const shot = await webcamRef.current.getScreenshot()
    let file = dataURLtoFile(shot, "temp.jpg")
    setImgSrc([...imgSrc, file])
    setHeadshots([...headshots, shot])
  }

  const renew = () => {
    setImgSrc([])
    setHeadshots([])
    setVisibleButton(true)
    props.setFile([])
  }

  const dataURLtoFile = (dataurl, filename) => {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], filename, { type: "image/jpeg" })
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
          ถ่ายภาพใหม่
        </Button>
        <Button
          id="primary"
          className="btn-custom mr-2"
          onClick={capture}
          disabled={!visibleButton}
        >
          ถ่ายภาพ
        </Button>
        <Button
          id="primary"
          type="submit"
          className="btn-custom"
          disabled={visibleButton}
        >
          ยืนยัน
        </Button>
      </Col>
      <Col
        s={12}
        sm={{ span: 10, offset: 1 }}
        md={{ span: 8, offset: 2 }}
        lg={{ span: 8, offset: 2 }}
        className="text-center my-2"
      >
        {FetchHeadshot()}
      </Col>
    </Row>
  );
};

export default CaptureParticipant
