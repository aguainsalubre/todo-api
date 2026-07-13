# todo-api

API REST simples de lista de tarefas, construída como projeto de portfólio
para demonstrar um ciclo completo de **DevOps + QA**: da aplicação até a
infraestrutura, passando por testes automatizados e pipeline de CI/CD.

O objetivo deste projeto **não** é a complexidade da aplicação em si — é
mostrar, de ponta a ponta, tudo que envolve levar código para produção com
qualidade.

## Stack

- **App:** Node.js + Express
- **Testes:** Jest + Supertest
- **Lint:** ESLint
- **Containerização:** Docker / docker-compose
- **CI/CD:** GitHub Actions
- **Infra:** Terraform + AWS (EC2)
- **Observabilidade (próximo módulo):** Prometheus/Grafana ou CloudWatch

## Endpoints

| Método | Rota         | Descrição                     |
|--------|--------------|--------------------------------|
| GET    | /health      | Health check                   |
| GET    | /todos       | Lista todas as tarefas         |
| GET    | /todos/:id   | Busca uma tarefa               |
| POST   | /todos       | Cria uma tarefa                |
| PUT    | /todos/:id   | Atualiza uma tarefa            |
| DELETE | /todos/:id   | Remove uma tarefa              |

## Rodando localmente

```bash
npm install
npm run dev
```

## Rodando com Docker

```bash
docker compose up --build
```

## Testes

```bash
npm test
```

A suíte cobre:
- Casos de sucesso (fluxo feliz) para todas as rotas
- Casos de borda (título vazio, tipo inválido, recurso inexistente)
- Isolamento de estado entre testes (reset do banco em memória a cada teste)

## Test Plan (resumo)

| Cenário                                   | Tipo       | Resultado esperado |
|--------------------------------------------|------------|---------------------|
| Criar tarefa com título válido             | Funcional  | 201 + objeto criado |
| Criar tarefa sem título                    | Borda      | 400                 |
| Criar tarefa com título em branco          | Borda      | 400                 |
| Listar tarefas sem nenhuma cadastrada      | Funcional  | 200 + lista vazia   |
| Buscar tarefa inexistente                  | Borda      | 404                 |
| Atualizar campo `done` com tipo inválido   | Borda      | 400                 |
| Remover tarefa existente                   | Funcional  | 204                 |
| Remover tarefa inexistente                 | Borda      | 404                 |

## Pipeline de CI/CD

O workflow em `.github/workflows/ci.yml` roda a cada push/PR na `main`:

1. Instala dependências
2. Roda lint
3. Roda testes com cobertura (publicada como artefato do workflow)
4. Builda a imagem Docker (só executa se os testes passarem)
5. Faz um smoke test do container (sobe o container e chama `/health`)

## Infraestrutura (Módulo 4)

A aplicação é provisionada na AWS via Terraform — código completo em [`infra/`](./infra).

**Arquitetura:**
- 1x EC2 (`t3.micro`, free tier) rodando Amazon Linux 2023
- Security Group liberando a porta da API publicamente e SSH restrito a um único IP
- `user_data` instala Docker, clona este repositório e builda/sobe o container automaticamente no boot da instância — ou seja, o deploy é 100% automatizado a partir do `terraform apply`

**Deploy:**
```bash
cd infra
cp terraform.tfvars.example terraform.tfvars   # preencha seu IP e a URL do repo
terraform init
terraform plan
terraform apply
```

Após alguns minutos, a saída `app_url` do Terraform já responde:
```bash
curl http://<ip-publico>:3000/health
# {"status":"ok","uptime":41.12}
```

**Para desprovisionar (evita gastar horas do free tier à toa):**
```bash
terraform destroy
```

Mais detalhes, incluindo a lista completa de recursos criados, em [`infra/README.md`](./infra/README.md).



- [x] Módulo 1 — App containerizada
- [x] Módulo 2 — Testes automatizados + test plan
- [x] Módulo 3 — Pipeline CI/CD
- [x] Módulo 4 — Infraestrutura como código (Terraform + AWS) — veja `infra/`
- [ ] Módulo 5 — Monitoramento (Prometheus/Grafana ou CloudWatch)

## Licença

MIT