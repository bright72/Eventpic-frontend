#!/bin/bash
sudo yum update
sudo yum install git 

#sudo yum install -y yum-utils
#sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
#sudo yum install docker-ce docker-ce-cli containerd.io

#sudo curl -L "https://github.com/docker/compose/releases/download/1.27.3/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
#sudo chmod +x /usr/local/bin/docker-compose
#sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose

sudo mkdir /var/www/html
sudo cd /var/www/html
sudo git clone https://github.com/bright72/Eventpic-frontend.git

sudo cd Eventpic-frontend/
sudo npm install
sudo yarn build

# sudo docker build -t docker-react .
# docker-compose up -d --build