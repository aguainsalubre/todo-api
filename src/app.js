const express = require('express');
const todosRouter = require('./routes/todos');

const app = express();

app.use(express.json());

// Health check - importante para monitoramento (Módulo 5 do projeto)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.use('/todos', todosRouter);

// Handler para rotas não encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Handler de erro genérico
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`todo-api rodando na porta ${PORT}`);
  });
}

module.exports = app;
