require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
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

app.get('/', (req, res) => {
  res.json({ 
    message: 'Bookmark Manager API is running',
    status: 'ok',
    endpoints: {
      bookmarks: '/api/bookmarks',
      categories: '/api/categories'
    }
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});