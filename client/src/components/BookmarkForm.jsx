import { useState } from 'react';

function BookmarkForm({ bookmark, categories, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: bookmark?.title || '',
    url: bookmark?.url || '',
    description: bookmark?.description || '',
    categoryId: bookmark?.categoryId || ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.url.trim()) {
      newErrors.url = 'URL is required';
    } else {
      try {
        new URL(formData.url);
      } catch (error) {
        newErrors.url = 'Please enter a valid URL (e.g., https://example.com)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Convert empty string to null for categoryId
    const submitData = {
      ...formData,
      categoryId: formData.categoryId ? parseInt(formData.categoryId) : null
    };

    onSubmit(submitData);
  };

  return (
    <div className="w-full max-w-2xl p-8">
      <div className="flex items-center gap-3 mb-6">
        <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
        <h2 className="text-xl font-bold text-gray-900">{bookmark ? 'Edit Bookmark' : 'Add New Bookmark'}</h2>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-5">
          <label htmlFor="title" className="block mb-2 text-gray-800 font-medium text-sm">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="GitHub"
            className={`w-full px-3 py-3 border rounded-md text-base outline-none transition-colors ${
              errors.title ? 'border-red-500' : 'border-gray-300 focus:border-green-500'
            }`}
          />
          {errors.title && <span className="block text-red-500 text-sm mt-1">{errors.title}</span>}
        </div>

        <div className="mb-5">
          <label htmlFor="url" className="block mb-2 text-gray-800 font-medium text-sm">
            URL <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="url"
            name="url"
            value={formData.url}
            onChange={handleChange}
            placeholder="https://github.com"
            className={`w-full px-3 py-3 border rounded-md text-base outline-none transition-colors ${
              errors.url ? 'border-red-500' : 'border-gray-300 focus:border-green-500'
            }`}
          />
          {errors.url && <span className="block text-red-500 text-sm mt-1">{errors.url}</span>}
        </div>

        <div className="mb-5">
          <label htmlFor="description" className="block mb-2 text-gray-800 font-medium text-sm">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Code hosting and collaboration platform"
            rows="3"
            className="w-full px-3 py-3 border border-gray-300 rounded-md text-base outline-none resize-y min-h-[80px] focus:border-green-500 transition-colors"
          />
        </div>

        <div className="mb-5">
          <label htmlFor="categoryId" className="block mb-2 text-gray-800 font-medium text-sm">Category</label>
          <select
            id="categoryId"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            className="w-full px-3 py-3 border border-gray-300 rounded-md text-base outline-none focus:border-green-500 transition-colors"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3 mt-8 justify-end">
          <button 
            type="button" 
            onClick={onCancel} 
            className="px-5 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="px-5 py-2.5 bg-gray-900 text-white rounded-lg font-medium text-sm hover:bg-gray-800 transition-colors"
          >
            {bookmark ? 'Update Bookmark' : 'Save Bookmark'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default BookmarkForm;
