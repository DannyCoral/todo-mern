const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getTodos, createTodo, updateTodo, deleteTodo, addNote } = require('../controllers/todoController');

router.use(protect);

router.get('/', getTodos);
router.post('/', createTodo);
router.put('/:id', updateTodo);
router.delete('/:id', deleteTodo);
router.post('/:id/notes', addNote); // 👈 nueva ruta para notas

module.exports = router;