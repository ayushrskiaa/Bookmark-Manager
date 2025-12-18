# Bookmark Manager

A full-stack bookmark manager application that allows users to save, organize, and search their favorite website links with categories.

## Features

✅ **Complete CRUD Operations**
- Add new bookmarks with title, URL, description, and category
- Edit existing bookmarks
- Delete bookmarks with confirmation
- View all bookmarks in a clean grid layout

✅ **Category Management**
- Create custom categories
- Filter bookmarks by category
- Automatic bookmark count per category
- Bookmarks moved to "Uncategorized" when category is deleted

✅ **Search & Filter**
- Real-time search by bookmark title or description
- Filter bookmarks by category
- Combine search and category filters

✅ **User Experience**
- Clean, responsive design
- Modal-based add/edit forms
- URL validation
- Empty states for better UX
- Emoji icons for visual appeal

## Tech Stack

**Frontend:**
- React 18
- Vite (build tool)
- Tailwind CSS (styling)

**Backend:**
- Node.js
- Express.js
- JSON file storage for data persistence
- CORS enabled for cross-origin requests
- dotenv for environment variables

## Project Structure

```
bookmark-manager/
├── client/                   # Frontend React application
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   │   ├── BookmarkCard.jsx
│   │   │   ├── BookmarkForm.jsx
│   │   │   ├── BookmarkList.jsx
│   │   │   ├── CategorySidebar.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   └── Modal.jsx
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # React entry point
│   ├── package.json
│   └── vite.config.js
│
├── server/                   # Backend Express API
│   ├── routes/
│   │   ├── bookmarks.js     # Bookmark endpoints
│   │   └── categories.js    # Category endpoints
│   ├── index.js             # Server entry point
│   ├── data.json            # Data persistence
│   └── package.json
│
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm

### Installation & Running

**1. Install Backend Dependencies**
```bash
cd server
npm install
```

**2. Configure Environment Variables**

Create `.env` files in both `server` and `client` folders:

**server/.env:**
```
PORT=5000
NODE_ENV=development
```

**client/.env:**
```
VITE_API_URL=http://localhost:5000/api
```

Or copy from examples:
```bash
# In server folder
cp .env.example .env

# In client folder
cp .env.example .env
```

**3. Start Backend Server**
```bash
cd server
npm start
```
The server will run on `http://localhost:5000`

**4. Install Frontend Dependencies** (in a new terminal)
```bash
cd client
npm install
```

**5. Start Frontend Development Server**
```bash
npm run dev
```
The app will run on `http://localhost:3000`

**6. Open in Browser**
Navigate to `http://localhost:3000` in your browser.

## API Endpoints

### Bookmarks

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/bookmarks` | Get all bookmarks |
| GET | `/api/bookmarks?category=1` | Get bookmarks by category |
| GET | `/api/bookmarks?search=github` | Search bookmarks |
| POST | `/api/bookmarks` | Create new bookmark |
| PUT | `/api/bookmarks/:id` | Update bookmark |
| DELETE | `/api/bookmarks/:id` | Delete bookmark |

### Categories

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | Get all categories with counts |
| POST | `/api/categories` | Create new category |
| DELETE | `/api/categories/:id` | Delete category |

## How It Works

### Data Flow
1. Frontend makes HTTP requests to backend API
2. Backend reads/writes to `data.json` file
3. All data persists across server restarts
4. Real-time updates reflect immediately in UI

### Key Features Implementation

**URL Validation:**
- Uses JavaScript's native `URL` constructor
- Validates format before saving

**Search:**
- Case-insensitive search
- Searches in both title and description fields
- Implemented as query parameter

**Category Filter:**
- Click on category in sidebar to filter
- "All" shows bookmarks from all categories
- Shows bookmark count per category

## Time Spent

Approximately **2.5 hours** spent on:
- Backend API setup and routes (45 min)
- Frontend components and styling (1.5 hours)
- Integration and testing (45 min)

## What Could Be Improved

Given more time, I would add:

1. **Enhanced Features:**
   - Favicon fetching from bookmark URLs
   - Tags system in addition to categories
   - Bookmark sorting (by date, name, etc.)
   - Bulk operations (delete multiple)

2. **Better UX:**
   - Toast notifications instead of alerts
   - Loading states for all API calls
   - Debounced search input
   - Drag-and-drop reordering

3. **Technical Improvements:**
   - Database (MongoDB/PostgreSQL) instead of JSON file
   - TypeScript for type safety
   - Unit and integration tests
   - Better error handling
   - Input sanitization

4. **Additional Features:**
   - User authentication
   - Import/export bookmarks
   - Dark mode
   - Keyboard shortcuts
   - Browser extension

## Known Limitations

- No database (uses JSON file storage)
- Single user system (no authentication)
- No pagination (all bookmarks load at once)
- Basic styling (could be more polished)

## Assignment Requirements Checklist

✅ Add bookmarks (title, URL, description, category)  
✅ View all bookmarks  
✅ Edit bookmarks  
✅ Delete bookmarks  
✅ Create and manage categories  
✅ Filter by category  
✅ Search by title/description  
✅ Data persistence  
✅ React frontend  
✅ Node.js/Express backend  
✅ RESTful API  
✅ Clean code structure  



**Note:** This is a demonstration project built for learning purposes. Not intended for production use without additional security and scalability improvements.
