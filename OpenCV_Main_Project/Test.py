import cv2
import dlib
import numpy as np

video_capture = cv2.VideoCapture(1)
detector = dlib.get_frontal_face_detector()

blurred = False
framed = False

while True:
    ret,frame = video_capture.read()

    if (ret):
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        rects = detector(gray,0)

        for rect in rects:
            x = rect.left()
            y = rect.top()
            x1 = rect.right()
            y1 = rect.bottom()

            if blurred:
                frame[y:y1,x:x1] = cv2.blur(frame[y:y1,x:x1], (25,25))

            if framed:
                cv2.rectangle(frame,(x,y),(x1,y1),(0,0,225),2)

        cv2.inshow('Video',frame)

    k = cv2.waitKey(30) & 0xff
    if k==27:
        break
        
# Release the VideoCapture object
video_capture.release()
cv2.destroyAllWindows()