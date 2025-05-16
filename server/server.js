const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const todoRoutes = require('./routes/todoRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Check if todos.json exists, if not create it
const dataPath = path.join(__dirname, 'data', 'todos.json');

const initializeDataFile = async () => {
  try {
    await fs.mkdir(path.join(__dirname, 'data'), { recursive: true });
    try {
      await fs.access(dataPath);
    } catch (error) {
      // File doesn't exist, create it with empty array
      await fs.writeFile(dataPath, JSON.stringify([]));
      console.log('Created empty todos.json file');
    }
  } catch (error) {
    console.error('Error initializing data file:', error);
  }
};

initializeDataFile();

// Routes
app.use('/api/todos', todoRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
