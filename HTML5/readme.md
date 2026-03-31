# HTML5 Todo Kanban Board

A modern todo list application with a Kanban board interface built with Vite, Tailwind CSS, and jQXWidgets.

## Features

- **Kanban Board**: Visual task management with drag-and-drop functionality
- **Todo Management**: Create, edit, and delete todos with the following fields:
  - Title
  - Description
  - Status (Backlog/Lined Up/WIP/Done/Stuck)
  - Priority (Urgent/High/Medium/Low)
  - Target Completion Date
  - Actual Completion Date (auto-set when marked as Done)
  - Link (external reference URL)
  - Project association
  - User assignment
- **Projects Master**: Manage projects that can be associated with todos
- **Dark Theme**: Modern dark UI with Tailwind CSS
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend Framework**: Vanilla JavaScript (ES6 Modules)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [jQXWidgets](https://www.jqwidgets.com/jquery-widgets-demo/)
- **Mock API**: [JSON Server](https://github.com/typicode/json-server)
- **Process Manager**: [Concurrently](https://github.com/open-cli-tools/concurrently)

## Prerequisites

- Node.js 18+ 
- npm or yarn

## Installation

1. Clone or navigate to the project directory:
   ```bash
   cd HTML5
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server and JSON API:
   ```bash
   npm start
   ```

This will start both:
- Vite dev server on `http://localhost:3000`
- JSON Server API on `http://localhost:3001`

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite development server only |
| `npm run server` | Start JSON Server API only |
| `npm start` | Start both dev server and API (recommended) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

## Project Structure

```
HTML5/
├── public/
│   └── vite.svg          # Favicon
├── src/
│   ├── components/
│   │   ├── kanban.js     # Kanban board component
│   │   ├── todoForm.js   # Todo create/edit form
│   │   └── projectsMaster.js  # Projects management
│   ├── models/
│   │   └── todo.js       # Data models and enums
│   ├── services/
│   │   └── api.js        # API service layer
│   ├── main.js           # Application entry point
│   └── styles.css        # Tailwind and custom styles
├── db.json               # JSON Server data file
├── index.html            # Main HTML file
├── package.json          # Dependencies and scripts
├── tailwind.config.js    # Tailwind configuration
├── postcss.config.js     # PostCSS configuration
├── vite.config.js        # Vite configuration
└── README.md             # This file
```

## Usage

### Creating a New Todo

1. Click the **"New Todo"** button in the toolbar
2. Fill in the todo details:
   - Title (required)
   - Description
   - Status
   - Priority
   - Target Completion Date
   - User
   - Project (optional)
   - Link (optional)
3. Click **"Save"**

### Managing Todos

- **Drag and Drop**: Move todos between status columns
- **Edit**: Click on a todo card to edit its details
- **Delete**: Use the delete button in the edit modal
- **Auto-completion**: Moving a todo to "Done" automatically sets the completion date

### Managing Projects

1. Click the **"Projects"** button in the toolbar
2. Click **"Add Project"** to create a new project
3. Edit or delete existing projects using the action buttons

## Data Model

### Todo

```javascript
{
  id: string,
  title: string,
  description: string,
  completionDate: string | null,
  status: 'Backlog' | 'LinedUp' | 'Wip' | 'Done' | 'Stuck',
  targetCompletionDate: string,
  isCompleted: boolean,
  link: string,
  projectId: string,
  priority: 'Urgent' | 'High' | 'Medium' | 'Low',
  user: string,
  createdAt: string,
  updatedAt: string
}
```

### Project

```javascript
{
  id: string,
  name: string,
  description: string,
  createdAt: string
}
```

## API Endpoints

The application uses JSON Server which provides REST endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/todos` | Get all todos |
| GET | `/api/todos/:id` | Get a specific todo |
| POST | `/api/todos` | Create a new todo |
| PUT | `/api/todos/:id` | Update a todo |
| DELETE | `/api/todos/:id` | Delete a todo |
| GET | `/api/projects` | Get all projects |
| GET | `/api/projects/:id` | Get a specific project |
| POST | `/api/projects` | Create a new project |
| PUT | `/api/projects/:id` | Update a project |
| DELETE | `/api/projects/:id` | Delete a project |

## Customization

### Adding New Status Columns

Edit `src/models/todo.js` to add new status values, then update the columns configuration in `src/components/kanban.js`.

### Changing Theme Colors

Modify `tailwind.config.js` to customize the color scheme:

```javascript
theme: {
  extend: {
    colors: {
      backlog: '#6b7280',
      linedup: '#3b82f6',
      wip: '#f59e0b',
      done: '#10b981',
      stuck: '#ef4444',
    }
  },
}
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Acknowledgments

- [jQXWidgets](https://www.jqwidgets.com/) for the UI components
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Vite](https://vitejs.dev/) for the blazing-fast build tool
