const express = require('express');
const bodyParser = require('body-parser');

// initialize Express.js server and save as a variable
const app = express();

// the body-parser middleware will parse the incoming requests with JSON payloads
app.use(bodyParser.json());
app.use(express.json());

// Hardcoded todo items for demo purposes
let todos = [];

// Hardcoded token for demo purposes
const TOKEN = 'mysecrettoken';

// Middleware to check token
const verifyToken = (req, res, next) => {
  // Extract token from the request headers
  const token = req.headers['authorization'];

  // Check if token is provided
  if (!token) {
    // Return 403 Forbidden if token is not provided
    return res.status(403).json({ error: 'No token provided' });
  }

  // Check if token is valid
  if (token !== `${TOKEN}`) {
    // Return 401 Unauthorized if token is invalid
    return res.status(401).json({ error: 'Invalid token' });
  }

  // Proceed to the next middleware if token is valid
  next();
};

// GET endpoint to fetch all todo items
app.get('/todos', (req, res) => {
  // Return all todo items as JSON
  res.json(todos);
});

// POST endpoint to create a new todo item, provide `title` and optionally `completed` in the request body as JSON
app.post('/todos', (req, res) => {
  // check if title is provided
  if (!req.body.title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const todo = {
    // Generate a unique id for the new todo item
    id: todos.length + 1,
    // Extract `title` and `completed` from the request body
    title: req.body.title,
    // Set `completed` to false by default if not provided
    completed: req.body.completed || false,
  };
  // Add the new todo item to the list of todos
  todos.push(todo);
  // Return the newly created todo item as JSON
  res.status(201).json(todo);
});

// PUT endpoint to update an existing todo item with the specified `id`, provide `title` and/or `completed` in the request body as JSON
app.put('/todos/:id', (req, res) => {
  // Extract `id` from the request parameters, parseInt() is used to convert the string to an integer
  const id = parseInt(req.params.id);
  // Find the todo item with the specified `id`
  const todo = todos.find((t) => t.id === id);
  // Return 404 Not Found if todo item is not found
  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  // Update the todo item with the new `title` and/or `completed` from the request body
  todo.title = req.body.title || todo.title;
  // Update the todo item with the new `completed` from the request body or keep the existing value
  todo.completed = req.body.completed || todo.completed;
  // Return the updated todo item as JSON
  res.json(todo);
});

// DELETE endpoint to remove an existing todo item with the specified `id`
app.delete('/todos/:id', verifyToken, (req, res) => {
  // Extract `id` from the request parameters, parseInt() is used to convert the string to an integer
  const id = parseInt(req.params.id);
  // Find the index of the todo item with the specified `id`
  const index = todos.findIndex((t) => t.id === id);
  if (index === -1) {
    // Return 404 Not Found if todo item is not found
    return res.status(404).json({ error: 'Todo not found' });
  }
  // store the todo item in a variable, then Remove the todo item from the list of todos
  const deletedTodo = todos.splice(index, 1);
  // Return that the todo item has been deleted and send the deleted todo item as JSON
  res.json({ message: 'Todo deleted', deletedTodo });
});

// handel 404 error
app.use((req, res) => {
  res.status(404).json({ error: 'Resource not found' });
});

// run the server on port 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
