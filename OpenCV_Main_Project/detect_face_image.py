import cv2
print (cv2.__version__)

# Load the cascade
face_cascade = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')

# Read the input image
img = cv2.imread('./Picture/a.jpg')
result_image = img.copy()

# Convert into grayscale
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# Detect faces
faces = face_cascade.detectMultiScale(gray, 1.1, 4)

# Draw rectangle around the faces
# for (x, y, w, h) in faces:
#     # cv2.rectangle(img, (x, y), (x + w, y + h), (255, 0, 0), 2)

if len(faces) != 0:         # If there are faces in the images
    for f in faces:         # For each face in the image

        x, y, w, h = [ v for v in f ]

        # get the rectangle img around all the faces (ตีกรอบหน้า)
        #cv2.rectangle(img, (x,y), (x+w,y+h), (255,255,0), 5)
        sub_face = img[y:y+h, x:x+w]
        # apply a gaussian blur on this new recangle image (ทำเบลอ)
        sub_face = cv2.GaussianBlur(sub_face,(23, 23), 30)
        # merge this blurry rectangle to our final image (เอาหน้าที่เบลอมาเขียนทับ)
        result_image[y:y+sub_face.shape[0], x:x+sub_face.shape[1]] = sub_face

        # ฟังก์ชั่นแยกใบหน้าออกมาแล้ว save เก็บไว้
        # face_file_name = "./face_" + str(y) + ".jpg"
        # cv2.imwrite(face_file_name, sub_face)

cv2.imshow("Detected face", result_image)
cv2.waitKey()
