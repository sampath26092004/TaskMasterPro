// const express = require('express');
// const cors = require('cors');
// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Simple in-memory storage
// let todos = [
//   { id: 1, text: 'Learn React', completed: false },
//   { id: 2, text: 'Build a Todo App', completed: true },
//   { id: 3, text: 'Master Node.js', completed: false }
// ];
// let nextId = 4;

// // Test route
// app.get('/', (req, res) => {
//   res.json({ 
//     message: 'Todo API is running!',
//     endpoints: {
//       getTodos: 'GET /api/todos',
//       addTodo: 'POST /api/todos',
//       updateTodo: 'PUT /api/todos/:id',
//       deleteTodo: 'DELETE /api/todos/:id'
//     }
//   });
// });

// // Get all todos
// app.get('/api/todos', (req, res) => {
//   res.json(todos);
// });

// // Add new todo
// app.post('/api/todos', (req, res) => {
//   const { text } = req.body;
//   if (!text || text.trim() === '') {
//     return res.status(400).json({ error: 'Todo text is required' });
//   }
  
//   const newTodo = {
//     id: nextId++,
//     text: text.trim(),
//     completed: false,
//     createdAt: new Date().toISOString()
//   };
  
//   todos.push(newTodo);
//   res.status(201).json(newTodo);
// });

// // Update todo
// app.put('/api/todos/:id', (req, res) => {
//   const id = parseInt(req.params.id);
//   const { text, completed } = req.body;
  
//   const todoIndex = todos.findIndex(todo => todo.id === id);
//   if (todoIndex === -1) {
//     return res.status(404).json({ error: 'Todo not found' });
//   }
  
//   if (text !== undefined) {
//     todos[todoIndex].text = text;
//   }
//   if (completed !== undefined) {
//     todos[todoIndex].completed = completed;
//   }
  
//   res.json(todos[todoIndex]);
// });

// // Delete todo
// app.delete('/api/todos/:id', (req, res) => {
//   const id = parseInt(req.params.id);
//   const initialLength = todos.length;
//   todos = todos.filter(todo => todo.id !== id);
  
//   if (todos.length === initialLength) {
//     return res.status(404).json({ error: 'Todo not found' });
//   }
  
//   res.json({ success: true, message: 'Todo deleted' });
// });

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Backend server running on http://localhost:${PORT}`);
//   console.log(`📝 API available at http://localhost:${PORT}/api/todos`);
// });

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// CORS configuration for Vercel
const allowedOrigins = [
  'https://your-app-name.vercel.app',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json());

// Simple in-memory storage
let todos = [];
let nextId = 1;

// Test route
app.get('/api', (req, res) => {
  res.json({ 
    message: 'Todo API is running on Vercel!',
    endpoints: {
      getTodos: 'GET /api/todos',
      addTodo: 'POST /api/todos',
      updateTodo: 'PUT /api/todos/:id',
      deleteTodo: 'DELETE /api/todos/:id'
    }
  });
});

// Get all todos
app.get('/api/todos', (req, res) => {
  res.json(todos);
});

// Add new todo
app.post('/api/todos', (req, res) => {
  const { text, priority = 'medium' } = req.body;
  
  if (!text || text.trim() === '') {
    return res.status(400).json({ error: 'Todo text is required' });
  }
  
  const newTodo = {
    id: nextId++,
    text: text.trim(),
    priority: priority,
    completed: false,
    date: new Date().toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    }),
    createdAt: new Date().toISOString()
  };
  
  todos.unshift(newTodo);
  res.status(201).json(newTodo);
});

// Update todo
app.put('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { text, completed, priority } = req.body;
  
  const todoIndex = todos.findIndex(todo => todo.id === id);
  if (todoIndex === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  
  if (text !== undefined) {
    todos[todoIndex].text = text;
  }
  if (completed !== undefined) {
    todos[todoIndex].completed = completed;
  }
  if (priority !== undefined) {
    todos[todoIndex].priority = priority;
  }
  
  res.json(todos[todoIndex]);
});

// Delete todo
app.delete('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = todos.length;
  todos = todos.filter(todo => todo.id !== id);
  
  if (todos.length === initialLength) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  
  res.json({ success: true, message: 'Todo deleted' });
});

// Health check endpoint for Vercel
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// For Vercel serverless
module.exports = app;