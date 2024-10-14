const express = require("express");
const todoRoutes = require("./routes/todos"); 

const app = express();

// Use express.json() instead of bodyParser
app.use(express.json());

// Use the routes
app.use("/todos", todoRoutes);

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: "Resource not found" });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
