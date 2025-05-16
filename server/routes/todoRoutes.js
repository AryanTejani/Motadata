const express = require('express');
const todoController = require('../controllers/todoController');

const router = express.Router();

// Get all todos
router.get('/', todoController.getAllTodos);

// Get todo by ID
router.get('/:id', todoController.getTodoById);

// Create new todo
router.post('/', todoController.createTodo);

// Update todo
router.put('/:id', todoController.updateTodo);

// Delete todo
router.delete('/:id', todoController.deleteTodo);

module.exports = router;
