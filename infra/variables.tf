variable "aws_region" {
  description = "Região da AWS onde a infra será criada"
  type        = string
  default     = "us-east-1"
}

variable "instance_type" {
  description = "Tipo da instância EC2 (t2.micro é elegível para o free tier)"
  type        = string
  default     = "t3.micro"
}

variable "app_port" {
  description = "Porta em que a aplicação Node roda"
  type        = number
  default     = 3000
}

variable "my_ip" {
  description = "Seu IP público, em formato CIDR (ex: 200.100.50.10/32), usado para liberar acesso SSH apenas para você"
  type        = string
}

variable "github_repo_url" {
  description = "URL do seu repositório no GitHub (https), usado pela instância para clonar e buildar a aplicação"
  type        = string
}
