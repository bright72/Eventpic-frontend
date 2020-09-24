#!/bin/bash
sudo yum update
sudo yum install git 
sudo yum install epel-release
sudo yum install nginx
sudo systemctl start nginx
sudo systemctl enable nginx

sudo mkdir /var/www/html
sudo cd /var/www/html
sudo git clone https://github.com/bright72/Eventpic-frontend.git

sudo cd Eventpic-frontend/
sudo cp nginx/default.conf /etc/nginx/nginx.conf
sudo npm install
sudo yarn build