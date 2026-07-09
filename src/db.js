// Armazenamento em memória.
// Propositalmente simples para o projeto de portfólio: o foco aqui é o
// pipeline (CI/CD, testes, infra), não a persistência de dados.
// Para evoluir: trocar isso por um client de Postgres (pg) mantendo a
// mesma interface (getAll, getById, create, update, remove).

let todos = [];
let nextId = 1;

function getAll() {
  return todos;
}

function getById(id) {
  return todos.find((todo) => todo.id === id);
}

function create({ title, done = false }) {
  const todo = { id: nextId++, title, done };
  todos.push(todo);
  return todo;
}

function update(id, changes) {
  const todo = getById(id);
  if (!todo) return null;
  Object.assign(todo, changes);
  return todo;
}

function remove(id) {
  const index = todos.findIndex((todo) => todo.id === id);
  if (index === -1) return false;
  todos.splice(index, 1);
  return true;
}

// Usado pelos testes para garantir estado limpo entre casos de teste.
function reset() {
  todos = [];
  nextId = 1;
}

module.exports = { getAll, getById, create, update, remove, reset };
