import cv2
print (cv2.__version__)

# Load the cascade
face_cascade = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')

# To capture video from webcam. 
cap = cv2.VideoCapture(1)
# To use a video file as input 
# cap = cv2.VideoCapture('filename.mp4')

while True:
    # Read the frame
    _, img = cap.read()
    result_image = img.copy()
    # Convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Detect the faces
    faces = face_cascade.detectMultiScale(gray, 1.1, 4)

    # Draw the rectangle around each face
    for (x, y, w, h) in faces:

        # get the rectangle img around all the faces (ตีกรอบหน้า)
        # cv2.rectangle(img, (x, y), (x+w, y+h), (255, 0, 0), 2)

        sub_face = img[y:y+h, x:x+w]
        # apply a gaussian blur on this new recangle image (ทำเบลอ)
        sub_face = cv2.GaussianBlur(sub_face,(23, 23), 30)
        # merge this blurry rectangle to our final image (เอาหน้าที่เบลอมาเขียนทับ)
        result_image[y:y+sub_face.shape[0], x:x+sub_face.shape[1]] = sub_face

    # Display
    cv2.imshow('VideoCam-Face-Removing', result_image)

    # Stop if escape key is pressed
    k = cv2.waitKey(30) & 0xff
    if k==27:
        break
        
# Release the VideoCapture object
cap.release()
cv2.destroyAllWindows()