output "public_ip" {
  description = "IP público da instância"
  value       = aws_instance.todo_api.public_ip
}

output "app_url" {
  description = "URL para testar a aplicação"
  value       = "http://${aws_instance.todo_api.public_ip}:${var.app_port}/health"
}
