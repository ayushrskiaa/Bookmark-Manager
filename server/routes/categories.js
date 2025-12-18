const express = require('express');
const router = express.Router();

// Get all categories with bookmark counts
router.get('/', async (req, res) => {
  try {
    const data = await req.app.locals.readData();

    // Add bookmark count to each category
    const categoriesWithCount = data.categories.map(category => {
      const bookmarkCount = data.bookmarks.filter(b => b.categoryId === category.id).length;
      return {
        ...category,
        bookmarkCount
      };
    });

    res.json({ categories: categoriesWithCount });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Create a new category
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;

    // Validate required field
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    const data = await req.app.locals.readData();

    // Check if category name already exists
    const existingCategory = data.categories.find(
      c => c.name.toLowerCase() === name.trim().toLowerCase()
    );

    if (existingCategory) {
      return res.status(400).json({ error: 'Category already exists' });
    }

    // Generate new ID
    const newId = data.categories.length > 0 
      ? Math.max(...data.categories.map(c => c.id)) + 1 
      : 1;

    // Create new category
    const newCategory = {
      id: newId,
      name: name.trim(),
      createdAt: new Date().toISOString()
    };

    data.categories.push(newCategory);
    await req.app.locals.writeData(data);

    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// Delete a category
router.delete('/:id', async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id);
    const data = await req.app.locals.readData();

    const categoryIndex = data.categories.findIndex(c => c.id === categoryId);

    if (categoryIndex === -1) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Move all bookmarks in this category to null (Uncategorized)
    data.bookmarks = data.bookmarks.map(bookmark => {
      if (bookmark.categoryId === categoryId) {
        return { ...bookmark, categoryId: null };
      }
      return bookmark;
    });

    // Delete the category
    data.categories.splice(categoryIndex, 1);
    await req.app.locals.writeData(data);

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

module.exports = router;
