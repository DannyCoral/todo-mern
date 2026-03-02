const Todo = require('../models/Todo');

// GET /api/todos
const getTodos = async (req, res) => {
  const todos = await Todo.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(todos);
};

// POST /api/todos
// POST /api/todos
const createTodo = async (req, res) => {
  const { title, dueDate, startDate } = req.body;
  if (!title) return res.status(400).json({ message: 'El título es requerido' });

  if (dueDate && new Date(dueDate) < new Date().setHours(0, 0, 0, 0)) {
    return res.status(400).json({ message: 'La fecha límite no puede ser anterior a hoy' });
  }

  if (startDate && new Date(startDate) < new Date().setHours(0, 0, 0, 0)) {
    return res.status(400).json({ message: 'La fecha de inicio no puede ser anterior a hoy' });
  }

  if (startDate && dueDate && new Date(startDate) > new Date(dueDate)) {
    return res.status(400).json({ message: 'La fecha de inicio no puede ser mayor a la fecha límite' });
  }

  const todo = await Todo.create({
    user: req.user.id,
    title,
    dueDate: dueDate || null,
    startDate: startDate || null,
  });

  res.status(201).json(todo);
};

// PUT /api/todos/:id
const updateTodo = async (req, res) => {
  const todo = await Todo.findOne({ _id: req.params.id, user: req.user.id });
  if (!todo) return res.status(404).json({ message: 'Tarea no encontrada' });

  todo.title = req.body.title ?? todo.title;
  todo.completed = req.body.completed ?? todo.completed;
  todo.progress = req.body.progress ?? todo.progress;

  // Si cambia el status actualizamos completed también
  if (req.body.status) {
    todo.status = req.body.status;
    todo.completed = req.body.status === 'completed';
  }

  await todo.save();
  res.json(todo);
};

// DELETE /api/todos/:id
const deleteTodo = async (req, res) => {
  const todo = await Todo.findOneAndDelete({ _id: req.params.id, user: req.user.id });
  if (!todo) return res.status(404).json({ message: 'Tarea no encontrada' });

  res.json({ message: 'Tarea eliminada' });
};

// POST /api/todos/:id/notes
const addNote = async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ message: 'El texto es requerido' });

  const todo = await Todo.findOne({ _id: req.params.id, user: req.user.id });
  if (!todo) return res.status(404).json({ message: 'Tarea no encontrada' });

  todo.notes.push({ text });
  await todo.save();

  res.json(todo);
};

module.exports = { getTodos, createTodo, updateTodo, deleteTodo, addNote };