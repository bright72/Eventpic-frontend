#!/bin/bash
sudo yum update

sudo cd /var/www/html/Eventpic-frontend/
sudo git pull

sudo cp nginx/default.conf /etc/nginx/nginx.conf
sudo npm install
sudoyarn add axios
sudo yarn build
sudo systemctl restart nginx
sudo systemctl start nginx