# EventPic is Pictures Verification and Authorization System.

## Application Features

Event Management
- Events Management (Add, Edit, Delete)
- Participants Management
- Event Pictures Management
- Sending Emails to request permission

Image Processing
- Recognize Participants
- Comparing Pictures

## Install Application based on CentOS 7

1.) Install Epel-release (Extra Packages for Enterprise Linux) 
    
    $ sudo yum install epel-release

2.) Install Git 
    
    $ sudo yum install git
    $ sudo git --version

3.) Clone Repository 
    
    $ sudo git clone https://github.com/bright72/Eventpic-frontend.git

4.) Install Docker 
    
    $ sudo yum install docker

5.) Enable Docker Service
       
    $ sudo systemctl start docker
    $ sudo systemctl enable docker
    $ sudo docker -v

6.) Build Docker Image

    $ sudo cd Eventpic-frontend/
    $ sudo git pull
    $ sudo docker build  --pull --no-cache -t frontend-evenpic .

7.) Run Docker Image
    
    $ sudo docker run -d -p 80:80 --name evenpic-front --restart=always frontend-evenpic

8.) Docker Container Status

    $ sudo docker ps
    
## Firebase and EmailJS Configuration

Firebase configuration file in this path 'src/firebase/config.js'

EmailJS user configuration in this path 'src/ChoosePicture.js' config emailjs.send() fuction in line 162

## Tools & Technique
### Web Application

- Language: HTML, JavaScript, CSS
- Framework: React, Bootstrap
- E-mail API: EmailJS
- face recognition API: face-api.js
  https://github.com/justadudewhohacks/face-api.js/

### Server & Infrastructure

- Cloud Provider: Metrabyte Cloud
- Operator System: CentOS
- Container Management: Docker Container
- Web Service: NGINX
- Runtime Environment: Node.JS
- Database: Firebase Realtime Database
- Storage: Firebase Cloud Storage
- Cloudflare

### Tools

- Version Control: GitHub, GitHub Desktop
- Team Management: Trello, Google Drive
- IDE: Visual Studio Code
