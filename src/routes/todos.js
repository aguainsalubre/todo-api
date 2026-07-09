const express = require('express');
const db = require('../db');

const router = express.Router();

// GET /todos - lista todas as tarefas
router.get('/', (req, res) => {
  res.json(db.getAll());
});

// GET /todos/:id - busca uma tarefa específica
router.get('/:id', (req, res) => {
  const todo = db.getById(Number(req.params.id));
  if (!todo) {
    return res.status(404).json({ error: 'Tarefa não encontrada' });
  }
  res.json(todo);
});

// POST /todos - cria uma nova tarefa
router.post('/', (req, res) => {
  const { title } = req.body;

  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ error: 'O campo "title" é obrigatório' });
  }

  const todo = db.create({ title: title.trim() });
  res.status(201).json(todo);
});

// PUT /todos/:id - atualiza uma tarefa existente
router.put('/:id', (req, res) => {
  const id = Number(req.params.id);
  const existing = db.getById(id);

  if (!existing) {
    return res.status(404).json({ error: 'Tarefa não encontrada' });
  }

  const { title, done } = req.body;

  if (title !== undefined && (typeof title !== 'string' || !title.trim())) {
    return res.status(400).json({ error: 'O campo "title" deve ser um texto não vazio' });
  }
  if (done !== undefined && typeof done !== 'boolean') {
    return res.status(400).json({ error: 'O campo "done" deve ser booleano' });
  }

  const updated = db.update(id, {
    ...(title !== undefined && { title: title.trim() }),
    ...(done !== undefined && { done }),
  });

  res.json(updated);
});

// DELETE /todos/:id - remove uma tarefa
router.delete('/:id', (req, res) => {
  const removed = db.remove(Number(req.params.id));
  if (!removed) {
    return res.status(404).json({ error: 'Tarefa não encontrada' });
  }
  res.status(204).send();
});

module.exports = router;
