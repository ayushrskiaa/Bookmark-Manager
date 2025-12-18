const express = require('express');
const router = express.Router();

// Get all bookmarks (with optional search and category filter)
router.get('/', async (req, res) => {
  try {
    const data = await req.app.locals.readData();
    let bookmarks = data.bookmarks;

    // Filter by category if provided
    const categoryId = req.query.category;
    if (categoryId) {
      bookmarks = bookmarks.filter(b => b.categoryId === parseInt(categoryId));
    }

    // Search by title or description if provided
    const searchQuery = req.query.search;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      bookmarks = bookmarks.filter(b => 
        b.title.toLowerCase().includes(query) || 
        (b.description && b.description.toLowerCase().includes(query))
      );
    }

    // Add category information to each bookmark
    const bookmarksWithCategory = bookmarks.map(bookmark => {
      const category = data.categories.find(c => c.id === bookmark.categoryId);
      return {
        ...bookmark,
        category: category ? { id: category.id, name: category.name } : null
      };
    });

    res.json({ bookmarks: bookmarksWithCategory });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bookmarks' });
  }
});

// Create a new bookmark
router.post('/', async (req, res) => {
  try {
    const { title, url, description, categoryId } = req.body;

    // Validate required fields
    if (!title || !url) {
      return res.status(400).json({ error: 'Title and URL are required' });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    const data = await req.app.locals.readData();

    // Generate new ID
    const newId = data.bookmarks.length > 0 
      ? Math.max(...data.bookmarks.map(b => b.id)) + 1 
      : 1;

    // Create new bookmark
    const newBookmark = {
      id: newId,
      title,
      url,
      description: description || '',
      categoryId: categoryId || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    data.bookmarks.push(newBookmark);
    await req.app.locals.writeData(data);

    res.status(201).json(newBookmark);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create bookmark' });
  }
});

// Update a bookmark
router.put('/:id', async (req, res) => {
  try {
    const bookmarkId = parseInt(req.params.id);
    const { title, url, description, categoryId } = req.body;

    // Validate URL format if provided
    if (url) {
      try {
        new URL(url);
      } catch (error) {
        return res.status(400).json({ error: 'Invalid URL format' });
      }
    }

    const data = await req.app.locals.readData();
    const bookmarkIndex = data.bookmarks.findIndex(b => b.id === bookmarkId);

    if (bookmarkIndex === -1) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }

    // Update bookmark
    const updatedBookmark = {
      ...data.bookmarks[bookmarkIndex],
      title: title || data.bookmarks[bookmarkIndex].title,
      url: url || data.bookmarks[bookmarkIndex].url,
      description: description !== undefined ? description : data.bookmarks[bookmarkIndex].description,
      categoryId: categoryId !== undefined ? categoryId : data.bookmarks[bookmarkIndex].categoryId,
      updatedAt: new Date().toISOString()
    };

    data.bookmarks[bookmarkIndex] = updatedBookmark;
    await req.app.locals.writeData(data);

    res.json(updatedBookmark);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update bookmark' });
  }
});

// Delete a bookmark
router.delete('/:id', async (req, res) => {
  try {
    const bookmarkId = parseInt(req.params.id);
    const data = await req.app.locals.readData();

    const bookmarkIndex = data.bookmarks.findIndex(b => b.id === bookmarkId);

    if (bookmarkIndex === -1) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }

    data.bookmarks.splice(bookmarkIndex, 1);
    await req.app.locals.writeData(data);

    res.json({ message: 'Bookmark deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete bookmark' });
  }
});

module.exports = router;
