# Busca a AMI mais recente do Amazon Linux 2023 automaticamente
data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-*-x86_64"]
  }
}

# Security Group: libera SSH só para o seu IP e a porta da app para o mundo
resource "aws_security_group" "todo_api_sg" {
  name        = "todo-api-sg"
  description = "Permite SSH restrito e acesso publico a porta da aplicacao"

  ingress {
    description = "SSH apenas do meu IP"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.my_ip]
  }

  ingress {
    description = "Acesso a API"
    from_port   = var.app_port
    to_port     = var.app_port
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "Saida liberada (necessario para git clone e docker pull)"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Project = "todo-api"
  }
}

# Instância EC2 que vai rodar a aplicação
resource "aws_instance" "todo_api" {
  ami                    = data.aws_ami.amazon_linux.id
  instance_type          = var.instance_type
  vpc_security_group_ids = [aws_security_group.todo_api_sg.id]

  user_data = templatefile("${path.module}/user_data.sh", {
    github_repo_url = var.github_repo_url
    app_port         = var.app_port
  })

  tags = {
    Name    = "todo-api"
    Project = "todo-api"
  }
}
