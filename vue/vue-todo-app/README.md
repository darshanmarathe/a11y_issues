# Vue Todo Application

A comprehensive todo management application built with Vue.js 3, featuring a Kanban board, project management, and more.

## Features

- ✅ **Dashboard with Kanban Board** - Visualize your todos across different statuses (Backlog, Lined Up, WIP, Done, Stuck)
- 📁 **Project Management** - Create and manage multiple projects
- 📝 **Full CRUD Operations** - Create, read, update, and delete todos and projects
- 🎯 **Priority Levels** - Mark todos as Urgent, High, Medium, or Low priority
- 👤 **User Assignment** - Assign todos to team members
- 🔗 **Link Support** - Add external links to todos
- 📊 **Statistics** - Track completion progress and pending tasks
- 🎨 **Modern UI** - Clean, responsive design with smooth animations
- 🔄 **Real-time Updates** - JSON Server backend for data persistence

## Tech Stack

- **Frontend**: Vue.js 3 (Latest version)
- **State Management**: Vuex 4
- **Routing**: Vue Router 4
- **Build Tool**: Vite
- **Backend**: JSON Server
- **UI Components**: Custom components (Syncfusion ready for integration)
- **HTTP Client**: Axios

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation & Running

### Option 1: Using run.bat (Windows)

Simply double-click `run.bat` in the project root directory. This will:
1. Install dependencies (if not already installed)
2. Start both the frontend and backend servers
3. Display the URLs for accessing the application

### Option 2: Manual Setup

```bash
# Navigate to the vue-todo-app directory
cd vue-todo-app

# Install dependencies
npm install

# Start both frontend and backend
npm run start

# Or run them separately:
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
npm run server
```

## Access URLs

- **Frontend Application**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **JSON Server Dashboard**: http://localhost:3000 (for viewing/editing data directly)

## Project Structure

```
vue-todo-app/
├── src/
│   ├── components/
│   │   ├── Dashboard.vue      # Main dashboard with Kanban board
│   │   ├── Projects.vue       # Project management
│   │   ├── Todos.vue          # Todos list view
│   │   └── Sidebar.vue        # Navigation sidebar
│   ├── store/
│   │   └── index.js           # Vuex store configuration
│   ├── router/
│   │   └── index.js           # Vue Router configuration
│   ├── App.vue                # Root component
│   ├── main.js                # Application entry point
│   └── style.css              # Global styles
├── db.json                    # JSON Server database
├── package.json               # Dependencies and scripts
└── vite.config.js             # Vite configuration
```

## Available Scripts

- `npm run start` - Run both frontend and backend concurrently
- `npm run dev` - Run frontend development server only
- `npm run server` - Run JSON Server backend only
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Todo Properties

Each todo item has the following properties:
- **title**: Todo title (required)
- **description**: Detailed description
- **status**: Backlog / Linedup / Wip / Done / Stuck
- **priority**: Urgent / High / Medium / Low
- **isCompleted**: Boolean completion status
- **completionDate**: Auto-set when marked complete
- **target_completion_date**: Target completion date
- **user**: Assigned user
- **projectId**: Associated project
- **link**: External URL link

## Usage

1. **Dashboard**: View all todos in a Kanban board layout
2. **Click any todo card** to edit its details
3. **Use the "+ Add Todo" button** to create new todos
4. **Navigate to Projects** to manage your projects
5. **Navigate to All Todos** for a tabular view with filtering

## Development

The application uses:
- **Vue 3 Composition API** for reactive components
- **Vuex** for centralized state management
- **Vue Router** for navigation
- **JSON Server** as a mock REST API backend
- **Concurrently** to run multiple processes together

## License

MIT
