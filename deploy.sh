#!/bin/bash
sudo yum update

sudo cd /var/www/html/Eventpic-frontend/
sudo git pull

sudo npm install
sudoyarn add axios
sudo yarn build
sudo systemctl restart nginx
sudo systemctl start nginx