const request = require('supertest');
const app = require('../src/app');
const db = require('../src/db');

// Garante estado limpo entre cada teste (isolamento de casos de teste)
beforeEach(() => {
  db.reset();
});

describe('GET /health', () => {
  it('retorna status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('POST /todos', () => {
  it('cria uma tarefa com título válido', async () => {
    const res = await request(app).post('/todos').send({ title: 'Estudar CI/CD' });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ title: 'Estudar CI/CD', done: false });
    expect(res.body.id).toBeDefined();
  });

  it('rejeita criação sem título (caso de borda)', async () => {
    const res = await request(app).post('/todos').send({});
    expect(res.status).toBe(400);
  });

  it('rejeita título vazio ou só espaços (caso de borda)', async () => {
    const res = await request(app).post('/todos').send({ title: '   ' });
    expect(res.status).toBe(400);
  });
});

describe('GET /todos', () => {
  it('lista todas as tarefas criadas', async () => {
    await request(app).post('/todos').send({ title: 'Tarefa 1' });
    await request(app).post('/todos').send({ title: 'Tarefa 2' });

    const res = await request(app).get('/todos');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  it('retorna lista vazia quando não há tarefas', async () => {
    const res = await request(app).get('/todos');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});

describe('GET /todos/:id', () => {
  it('retorna 404 para tarefa inexistente', async () => {
    const res = await request(app).get('/todos/999');
    expect(res.status).toBe(404);
  });
});

describe('PUT /todos/:id', () => {
  it('atualiza o campo done de uma tarefa existente', async () => {
    const created = await request(app).post('/todos').send({ title: 'Tarefa X' });

    const res = await request(app)
      .put(`/todos/${created.body.id}`)
      .send({ done: true });

    expect(res.status).toBe(200);
    expect(res.body.done).toBe(true);
  });

  it('rejeita done com tipo inválido (caso de borda)', async () => {
    const created = await request(app).post('/todos').send({ title: 'Tarefa Y' });

    const res = await request(app)
      .put(`/todos/${created.body.id}`)
      .send({ done: 'sim' });

    expect(res.status).toBe(400);
  });

  it('retorna 404 ao atualizar tarefa inexistente', async () => {
    const res = await request(app).put('/todos/999').send({ done: true });
    expect(res.status).toBe(404);
  });
});

describe('DELETE /todos/:id', () => {
  it('remove uma tarefa existente', async () => {
    const created = await request(app).post('/todos').send({ title: 'Tarefa Z' });

    const del = await request(app).delete(`/todos/${created.body.id}`);
    expect(del.status).toBe(204);

    const get = await request(app).get(`/todos/${created.body.id}`);
    expect(get.status).toBe(404);
  });

  it('retorna 404 ao remover tarefa inexistente', async () => {
    const res = await request(app).delete('/todos/999');
    expect(res.status).toBe(404);
  });
});
