# Infraestrutura — todo-api (Módulo 4)

Provisiona, via Terraform, uma instância EC2 (t2.micro, elegível para o
free tier) que clona este repositório, builda a imagem Docker e sobe o
container automaticamente ao iniciar.

## ⚠️ Antes de começar

- **Sempre rode `terraform destroy` quando terminar de usar/demonstrar**,
  para não deixar recursos rodando à toa. t2.micro é gratuita dentro do
  limite de 750h/mês da conta, mas é boa prática de qualquer forma.
- Confirme que você tem um **budget alert** configurado na sua conta AWS
  (Billing → Budgets), como preparamos antes de criar a conta.

## Pré-requisitos

- Terraform instalado (`terraform -version` para conferir)
- AWS CLI configurado (`aws configure`)
- Seu repositório `todo-api` já no GitHub (o script clona ele via HTTPS)

## Como usar

1. Copie o arquivo de exemplo de variáveis:
   ```bash
   cp terraform.tfvars.example terraform.tfvars
   ```
2. Edite `terraform.tfvars` com seu IP público (formato CIDR, ex:
   `200.100.50.10/32`) e a URL do seu repositório no GitHub.

3. Inicialize o Terraform (baixa o provider da AWS):
   ```bash
   terraform init
   ```

4. Veja o que será criado, antes de aplicar (boa prática sempre revisar):
   ```bash
   terraform plan
   ```

5. Aplique de fato:
   ```bash
   terraform apply
   ```
   Confirme digitando `yes` quando pedido.

6. Após alguns minutos (a instância precisa instalar Docker e buildar a
   imagem), o Terraform mostra a saída `app_url`. Teste com:
   ```bash
   curl <app_url>
   ```
   Se não responder de primeira, aguarde 1-2 minutos — o `user_data.sh`
   ainda pode estar rodando.

7. **Quando terminar de demonstrar/usar, destrua os recursos:**
   ```bash
   terraform destroy
   ```

## O que é criado

| Recurso                | Descrição                                             |
|-------------------------|--------------------------------------------------------|
| `aws_instance`          | EC2 t2.micro rodando Amazon Linux 2023                 |
| `aws_security_group`    | Libera porta da app publicamente e SSH só pro seu IP    |
| `data.aws_ami`          | Busca automaticamente a AMI mais recente do Amazon Linux|

## Próximo passo (Módulo 5)

Adicionar observabilidade: CloudWatch Agent na instância, ou
Prometheus + Grafana rodando como containers ao lado da aplicação.
