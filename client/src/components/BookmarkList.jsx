import BookmarkCard from './BookmarkCard';

function BookmarkList({ bookmarks, onEdit, onDelete }) {
  if (bookmarks.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 min-h-[400px]">
        <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
          <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          <p className="text-xl font-medium text-gray-900 mb-2">No bookmarks found</p>
          <p className="text-sm text-gray-500">Add your first bookmark to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">All Bookmarks ({bookmarks.length})</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {bookmarks.map((bookmark) => (
          <BookmarkCard
            key={bookmark.id}
            bookmark={bookmark}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}

export default BookmarkList;
