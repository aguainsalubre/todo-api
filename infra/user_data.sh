#!/bin/bash
set -e

# Atualiza pacotes e instala Docker e Git
dnf update -y
dnf install -y docker git
systemctl enable docker
systemctl start docker
usermod -aG docker ec2-user

# Clona o repositório da aplicação e builda a imagem
cd /home/ec2-user
git clone ${github_repo_url} app
cd app

docker build -t todo-api .
docker run -d -p ${app_port}:${app_port} --restart unless-stopped --name todo-api todo-api
