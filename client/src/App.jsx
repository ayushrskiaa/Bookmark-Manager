import { useState, useEffect } from 'react';
import CategorySidebar from './components/CategorySidebar';
import SearchBar from './components/SearchBar';
import BookmarkList from './components/BookmarkList';
import BookmarkForm from './components/BookmarkForm';
import Modal from './components/Modal';
import Toast from './components/Toast';
import ConfirmDialog from './components/ConfirmDialog';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function App() {
  // State management
  const [bookmarks, setBookmarks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);

  // Fetch bookmarks from API
  const fetchBookmarks = async () => {
    try {
      let url = `${API_URL}/bookmarks`;
      const params = new URLSearchParams();
      
      if (selectedCategory) {
        params.append('category', selectedCategory);
      }
      if (searchQuery) {
        params.append('search', searchQuery);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      setBookmarks(data.bookmarks);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      setToast({ message: 'Failed to load bookmarks', type: 'error' });
    }
  };

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/categories`);
      const data = await response.json();
      setCategories(data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchBookmarks(), fetchCategories()]);
      setLoading(false);
    };
    loadData();
  }, []);

  // Refresh bookmarks when filters change
  useEffect(() => {
    fetchBookmarks();
  }, [selectedCategory, searchQuery]);

  // Add new bookmark
  const handleAddBookmark = async (bookmarkData) => {
    try {
      const response = await fetch(`${API_URL}/bookmarks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookmarkData)
      });

      if (!response.ok) {
        const error = await response.json();
        setToast({ message: error.error || 'Failed to add bookmark', type: 'error' });
        return;
      }

      await fetchBookmarks();
      setShowModal(false);
      setToast({ message: 'Bookmark added successfully!', type: 'success' });
    } catch (error) {
      console.error('Error adding bookmark:', error);
      setToast({ message: 'Failed to add bookmark', type: 'error' });
    }
  };

  // Update existing bookmark
  const handleUpdateBookmark = async (bookmarkData) => {
    try {
      const response = await fetch(`${API_URL}/bookmarks/${editingBookmark.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookmarkData)
      });

      if (!response.ok) {
        const error = await response.json();
        setToast({ message: error.error || 'Failed to update bookmark', type: 'error' });
        return;
      }

      await fetchBookmarks();
      setShowModal(false);
      setEditingBookmark(null);
      setToast({ message: 'Bookmark updated successfully!', type: 'success' });
    } catch (error) {
      console.error('Error updating bookmark:', error);
      setToast({ message: 'Failed to update bookmark', type: 'error' });
    }
  };

  // Delete bookmark
  const handleDeleteBookmark = (id) => {
    setConfirmDialog({
      title: 'Delete Bookmark',
      message: 'Are you sure you want to delete this bookmark? This action cannot be undone.',
      onConfirm: () => confirmDelete(id)
    });
  };

  const confirmDelete = async (id) => {
    setConfirmDialog(null);
    
    try {
      const response = await fetch(`${API_URL}/bookmarks/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        setToast({ message: 'Failed to delete bookmark', type: 'error' });
        return;
      }

      await fetchBookmarks();
      setToast({ message: 'Bookmark deleted successfully!', type: 'success' });
    } catch (error) {
      console.error('Error deleting bookmark:', error);
      setToast({ message: 'Failed to delete bookmark', type: 'error' });
    }
  };

  // Open edit modal
  const handleEditBookmark = (bookmark) => {
    setEditingBookmark(bookmark);
    setShowModal(true);
  };

  // Add new category
  const handleAddCategory = async (categoryName) => {
    try {
      const response = await fetch(`${API_URL}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: categoryName })
      });

      if (!response.ok) {
        const error = await response.json();
        setToast({ message: error.error || 'Failed to add category', type: 'error' });
        return;
      }

      await fetchCategories();
      setToast({ message: 'Category added successfully!', type: 'success' });
    } catch (error) {
      console.error('Error adding category:', error);
      setToast({ message: 'Failed to add category', type: 'error' });
    }
  };

  // Open add modal
  const handleOpenAddModal = () => {
    setEditingBookmark(null);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-screen text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg className="w-8 h-8 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              <h1 className="text-2xl font-bold text-gray-900">Bookmark Manager</h1>
            </div>
            <button 
              className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm"
              onClick={handleOpenAddModal}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden sm:inline">Add Bookmark</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <SearchBar 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          categories={categories}
          onCategoryChange={setSelectedCategory}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          <CategorySidebar
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onAddCategory={handleAddCategory}
            totalBookmarks={bookmarks.length}
          />

          <BookmarkList
            bookmarks={bookmarks}
            onEdit={handleEditBookmark}
            onDelete={handleDeleteBookmark}
          />
        </div>
      </div>

      {showModal && (
        <Modal onClose={() => {
          setShowModal(false);
          setEditingBookmark(null);
        }}>
          <BookmarkForm
            bookmark={editingBookmark}
            categories={categories}
            onSubmit={editingBookmark ? handleUpdateBookmark : handleAddBookmark}
            onCancel={() => {
              setShowModal(false);
              setEditingBookmark(null);
            }}
          />
        </Modal>
      )}

      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      {confirmDialog && (
        <ConfirmDialog
          title={confirmDialog.title}
          message={confirmDialog.message}
          onConfirm={confirmDialog.onConfirm}
          onCancel={() => setConfirmDialog(null)}
        />
      )}
    </div>
  );
}

export default App;
