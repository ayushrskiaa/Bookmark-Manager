import { useState } from 'react';

function CategorySidebar({ categories, selectedCategory, onSelectCategory, onAddCategory, totalBookmarks }) {
  const [isAdding, setIsAdding] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (newCategoryName.trim()) {
      onAddCategory(newCategoryName.trim());
      setNewCategoryName('');
      setIsAdding(false);
    }
  };

  // Calculate total for "All" category
  const allCount = categories.reduce((sum, cat) => sum + cat.bookmarkCount, 0);

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden h-fit sticky top-4">
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Categories</h3>
      </div>
      
      <div className="p-2">
        <div
          className={`flex justify-between items-center px-3 py-2.5 mb-1 rounded-md cursor-pointer transition-all ${
            selectedCategory === null ? 'bg-gray-900 text-white' : 'hover:bg-gray-100 text-gray-700'
          }`}
          onClick={() => onSelectCategory(null)}
        >
          <span className="flex items-center gap-2.5 text-sm font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            All Bookmarks
          </span>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            selectedCategory === null ? 'bg-white text-gray-900' : 'bg-gray-200 text-gray-700'
          }`}>{allCount}</span>
        </div>

        {categories.map((category) => (
          <div
            key={category.id}
            className={`flex justify-between items-center px-3 py-2.5 mb-1 rounded-md cursor-pointer transition-all ${
              selectedCategory == category.id ? 'bg-gray-900 text-white' : 'hover:bg-gray-100 text-gray-700'
            }`}
            onClick={() => onSelectCategory(category.id)}
          >
            <span className="flex items-center gap-2.5 text-sm font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              {category.name}
            </span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              selectedCategory == category.id ? 'bg-white text-gray-900' : 'bg-gray-200 text-gray-700'
            }`}>{category.bookmarkCount}</span>
          </div>
        ))}
      </div>

      <div className="p-3 border-t border-gray-200">
        {isAdding ? (
          <form onSubmit={handleAddCategory} className="space-y-2">
            <input
              type="text"
              placeholder="Category name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900 focus:ring-opacity-10"
              autoFocus
            />
            <div className="flex gap-2">
              <button type="submit" className="flex-1 px-3 py-2 bg-gray-900 text-white rounded-md text-sm font-medium hover:bg-gray-800 transition-colors">
                Add
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setNewCategoryName('');
                }}
                className="flex-1 px-3 py-2 bg-white text-gray-700 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full px-3 py-2.5 bg-gray-100 text-gray-900 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Category
          </button>
        )}
      </div>
    </div>
  );
}

export default CategorySidebar;
