require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Path to data file
const dataFilePath = path.join(__dirname, 'data.json');

// Helper function to read data from file
async function readData() {
  try {
    const data = await fs.readFile(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading data:', error);
    return { bookmarks: [], categories: [] };
  }
}

// Helper function to write data to file
async function writeData(data) {
  try {
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing data:', error);
    throw error;
  }
}

// Import routes
const bookmarksRouter = require('./routes/bookmarks');
const categoriesRouter = require('./routes/categories');

// Make helper functions available to routes
app.locals.readData = readData;
app.locals.writeData = writeData;

// Use routes
app.use('/api/bookmarks', bookmarksRouter);
app.use('/api/categories', categoriesRouter);

// Serve static files from React build in production
if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = path.join(__dirname, '../client/dist');
  app.use(express.static(clientBuildPath));
  
  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
} else {
  // Basic route to test server in development
  app.get('/', (req, res) => {
    res.json({ message: 'Bookmark Manager API is running' });
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
