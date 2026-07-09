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
- **Infra (próximo módulo):** Terraform + AWS
- **Observabilidade (próximo módulo):** Prometheus + Grafana

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

## Roadmap do projeto

- [x] Módulo 1 — App containerizada
- [x] Módulo 2 — Testes automatizados + test plan
- [x] Módulo 3 — Pipeline CI/CD
- [ ] Módulo 4 — Infraestrutura como código (Terraform + AWS)
- [ ] Módulo 5 — Monitoramento (Prometheus/Grafana ou CloudWatch)

## Licença

MIT
