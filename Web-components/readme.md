# Todo List Application with Kanban Board

A modern, feature-rich todo list application built with Web Components, featuring a Kanban board dashboard, project management, and a clean responsive UI.

## Features

### Core Functionality
- ✅ **Todo Management**: Create, read, update, and delete todos
- ✅ **Kanban Board**: Visual drag-and-drop interface with 5 status columns
- ✅ **Project Management**: Create and manage multiple projects
- ✅ **Status Tracking**: Backlog, Lined Up, WIP, Done, Stuck
- ✅ **Priority Levels**: Urgent, High, Medium, Low
- ✅ **Rich Todo Properties**: Title, description, dates, links, user assignment
- ✅ **Dashboard**: Overview statistics and analytics

### Technical Features
- 🎨 **Web Components**: Built with native Web Components API
- 🔄 **State Management**: Zustand for efficient state management
- 🛣️ **Client-side Routing**: Custom router for navigation
- 🌐 **REST API**: JSON Server as backend
- ⚡ **Vite Build**: Fast development and optimized production builds
- 🎭 **Drag & Drop**: Intuitive kanban card management
- 📱 **Responsive Design**: Works on all screen sizes

## Tech Stack

- **Frontend**: Vanilla JavaScript with Web Components
- **State Management**: Zustand
- **Routing**: Custom router
- **Backend**: JSON Server
- **Build Tool**: Vite
- **Task Runner**: Concurrently

## Project Structure

```
Web-components/
├── data/
│   └── db.json                 # JSON Server database
├── public/                     # Static assets
├── src/
│   ├── components/
│   │   ├── app-root.component.js    # Main app component
│   │   ├── kanban-board.component.js # Kanban board
│   │   ├── sidebar.component.js     # Navigation sidebar
│   │   └── todo-modal.component.js  # Todo edit modal
│   ├── models/
│   │   └── todo.model.js       # Data models and utilities
│   ├── pages/
│   │   ├── dashboard.page.js   # Dashboard page
│   │   ├── projects.page.js    # Projects management
│   │   └── todos.page.js       # Todo list page
│   ├── store/
│   │   └── store.js            # Zustand state management
│   ├── styles/
│   │   └── main.css            # Global styles
│   ├── utils/
│   │   └── router.js           # Client-side router
│   └── main.js                 # Application entry point
├── index.html                  # Main HTML file
├── package.json                # Dependencies and scripts
├── run.bat                     # Windows launcher
└── vite.config.js              # Vite configuration
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository or navigate to the project folder:
   ```bash
   cd Web-components
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

#### Option 1: Using run.bat (Windows)
Simply double-click `run.bat` to start both servers.

#### Option 2: Using npm scripts
```bash
# Start both Vite and JSON Server
npm start

# Or start them separately
npm run dev:vite        # Start only Vite dev server
npm run dev:server      # Start only JSON Server
```

### Access the Application

- **Frontend (Vite)**: http://localhost:3000
- **Backend API (JSON Server)**: http://localhost:3001

## API Endpoints

### Todos
- `GET /todos` - Get all todos
- `GET /todos/{id}` - Get specific todo
- `POST /todos` - Create new todo
- `PATCH /todos/{id}` - Update todo
- `DELETE /todos/{id}` - Delete todo

### Projects
- `GET /projects` - Get all projects
- `GET /projects/{id}` - Get specific project
- `POST /projects` - Create new project
- `PATCH /projects/{id}` - Update project
- `DELETE /projects/{id}` - Delete project

## Data Models

### Todo
```javascript
{
  id: number,
  title: string,
  description: string,
  completionDate: string | null,
  status: 'Backlog' | 'Linedup' | 'Wip' | 'Done' | 'Stuck',
  target_completion_date: string,
  isCompleted: boolean,
  link: string,
  projects: number[],
  priority: 'Urgent' | 'High' | 'Medium' | 'Low',
  user: string
}
```

### Project
```javascript
{
  id: number,
  name: string,
  description: string,
  isActive: boolean
}
```

## Usage Guide

### Dashboard
- View overview statistics at the top
- Use the Kanban board to visualize todo progress
- Drag cards between columns to change status
- Click on any card to edit it

### Todo List
- Navigate to "All Todos" in the sidebar
- View all todos in a table format
- Filter by status or priority
- Click "+ Add Todo" to create new todo
- Edit or delete existing todos

### Projects
- Navigate to "Projects" in the sidebar
- View all projects in a card layout
- Add new projects with the "+ Add Project" button
- Edit or delete existing projects
- Toggle active/inactive status

### Kanban Board
- Drag cards between columns to update status
- Color-coded priority indicators:
  - 🔴 Red: Urgent
  - 🟠 Orange: High
  - 🔵 Blue: Medium
  - ⚫ Gray: Low
- Status columns:
  - Backlog → Lined Up → WIP → Done/Stuck

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` folder.

## Customization

### Styles
All global styles are in `src/styles/main.css`. You can modify colors, spacing, and other design tokens in the CSS variables at the top of the file.

### Adding New Features
- Add new components in `src/components/`
- Create new pages in `src/pages/`
- Update routes in `src/components/app-root.component.js`
- Extend the store in `src/store/store.js`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

ISC

## Author

Built with ❤️ using Web Components and modern web technologies.
