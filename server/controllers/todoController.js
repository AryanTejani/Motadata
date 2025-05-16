const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const dataPath = path.join(__dirname, '..', 'data', 'todos.json');

// Helper function to read todos
const readTodos = async () => {
  const data = await fs.readFile(dataPath, 'utf8');
  return JSON.parse(data);
};

// Helper function to write todos
const writeTodos = async (todos) => {
  await fs.writeFile(dataPath, JSON.stringify(todos, null, 2), 'utf8');
};

// Get all todos
exports.getAllTodos = async (req, res) => {
  try {
    const { status, priority, sort } = req.query;
    let todos = await readTodos();
    
    // Apply filters
    if (status) {
      todos = todos.filter(todo => todo.status === status);
    }
    
    if (priority) {
      todos = todos.filter(todo => todo.priority === priority);
    }
    
    // Apply sorting
    if (sort === 'dueDate') {
      todos.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    } else if (sort === 'priority') {
      const priorityOrder = { high: 1, medium: 2, low: 3 };
      todos.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    }
    
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve todos' });
  }
};

// Get todo by ID
exports.getTodoById = async (req, res) => {
  try {
    const todos = await readTodos();
    const todo = todos.find(t => t.id === req.params.id);
    
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve todo' });
  }
};

// Create new todo
exports.createTodo = async (req, res) => {
  try {
    const { title, description, dueDate, priority, status } = req.body;
    
    // Validation
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    if (!['high', 'medium', 'low'].includes(priority)) {
      return res.status(400).json({ error: 'Priority must be high, medium, or low' });
    }
    
    if (!['open', 'done'].includes(status)) {
      return res.status(400).json({ error: 'Status must be open or done' });
    }
    
    const newTodo = {
      id: uuidv4(),
      title,
      description: description || '',
      dueDate,
      priority,
      status,
      createdAt: new Date().toISOString()
    };
    
    const todos = await readTodos();
    todos.push(newTodo);
    await writeTodos(todos);
    
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create todo' });
  }
};

// Update todo
exports.updateTodo = async (req, res) => {
  try {
    const { title, description, dueDate, priority, status } = req.body;
    const todos = await readTodos();
    const index = todos.findIndex(t => t.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    // Validation
    if (priority && !['high', 'medium', 'low'].includes(priority)) {
      return res.status(400).json({ error: 'Priority must be high, medium, or low' });
    }
    
    if (status && !['open', 'done'].includes(status)) {
      return res.status(400).json({ error: 'Status must be open or done' });
    }
    
    todos[index] = {
      ...todos[index],
      title: title || todos[index].title,
      description: description !== undefined ? description : todos[index].description,
      dueDate: dueDate || todos[index].dueDate,
      priority: priority || todos[index].priority,
      status: status || todos[index].status,
      updatedAt: new Date().toISOString()
    };
    
    await writeTodos(todos);
    res.json(todos[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update todo' });
  }
};

// Delete todo
exports.deleteTodo = async (req, res) => {
  try {
    const todos = await readTodos();
    const filteredTodos = todos.filter(t => t.id !== req.params.id);
    
    if (filteredTodos.length === todos.length) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    await writeTodos(filteredTodos);
    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete todo' });
  }
};
