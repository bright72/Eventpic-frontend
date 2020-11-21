#!/bin/bash
sudo yum install epel-release
sudo yum install git 
sudo yum install nginx
sudo systemctl start nginx
sudo systemctl enable nginx

sudo mkdir /var/www/html
sudo cd /var/www/html
sudo git clone https://github.com/bright72/Eventpic-frontend.git

docker build  --pull --no-cache -t frontend-evenpic .
docker run -d -p 80:80 --name evenpic-front --restart=always frontend-evenpic