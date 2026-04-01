# Todo Kanban Board Application

A PHP-based Todo management application with Kanban board visualization built with AdminLTE, jQuery, jqxWidgets, and SQLite.

## Features

- **Kanban Board**: Visualize your todos in 5 different status columns (Backlog, Lined Up, WIP, Done, Stuck)
- **Drag & Drop**: Move todos between status columns with drag-and-drop functionality
- **Priority Management**: Set priority levels (Urgent, High, Medium, Low)
- **Project Management**: Organize todos by projects
- **User Assignment**: Assign todos to team members
- **Target Dates**: Set and track target completion dates
- **Statistics Dashboard**: Real-time statistics for all todo statuses
- **Responsive Design**: Works on desktop and mobile devices

## Requirements

- PHP 8.0 or higher
- SQLite3 extension enabled
- Modern web browser (Chrome, Firefox, Edge, Safari)

## Installation

1. Ensure PHP is installed and added to your system PATH
2. Clone or download this application to your desired location
3. No additional setup required - the application will create the SQLite database automatically

## Running the Application

### Windows

Double-click `run.bat` or run it from command prompt:
```cmd
run.bat
```

### Manual Start

If you prefer to start the server manually:
```bash
php -S localhost:8080
```

## Usage

1. Open your web browser and navigate to `http://localhost:8080`
2. The Kanban board will display all existing todos
3. Click "Add Todo" button to create a new todo
4. Fill in the todo details:
   - Title (required)
   - Description
   - Status
   - Priority
   - Target Completion Date
   - Project
   - User
   - Link (optional URL)
   - Completion status
5. Click "Save" to create/update the todo
6. Drag and drop todos between columns to update their status
7. Click on a todo card to edit or delete it

## Project Structure

```
php/
├── api/
│   └── index.php          # REST API endpoints
├── assets/
│   ├── css/
│   │   └── style.css      # Custom styles
│   └── js/
│       └── app.js         # Application logic
├── config/
│   └── database.php       # Database configuration
├── data/
│   └── todos.db           # SQLite database (auto-created)
├── index.php              # Main application page
└── run.bat                # Windows launcher script
```

## API Endpoints

### Todos
- `GET /api/index.php?resource=todos` - Get all todos
- `GET /api/index.php?resource=todos&id={id}` - Get single todo
- `POST /api/index.php?resource=todos` - Create new todo
- `PUT /api/index.php?resource=todos&id={id}` - Update todo
- `DELETE /api/index.php?resource=todos&id={id}` - Delete todo

### Projects
- `GET /api/index.php?resource=projects` - Get all projects
- `POST /api/index.php?resource=projects` - Create new project
- `PUT /api/index.php?resource=projects&id={id}` - Update project
- `DELETE /api/index.php?resource=projects&id={id}` - Delete project

### Users
- `GET /api/index.php?resource=users` - Get all users
- `POST /api/index.php?resource=users` - Create new user
- `PUT /api/index.php?resource=users&id={id}` - Update user
- `DELETE /api/index.php?resource=users&id={id}` - Delete user

## Technologies Used

- **Backend**: PHP 8+
- **Database**: SQLite3
- **Frontend**: HTML5, CSS3, JavaScript
- **UI Framework**: AdminLTE 4
- **JavaScript Library**: jQuery 3.7
- **UI Components**: jqxWidgets 19
- **Icons**: Font Awesome 6

## Todo Statuses

- **Backlog**: Todos that are yet to be worked on
- **Lined Up**: Todos ready to be started
- **WIP (Work In Progress)**: Todos currently being worked on
- **Done**: Completed todos
- **Stuck**: Todos that are blocked or facing issues

## Priority Levels

- **Urgent**: Must be done immediately
- **High**: High priority, should be done soon
- **Medium**: Normal priority
- **Low**: Can be done when time permits

## License

This project is open source and available for educational purposes.

## Support

For issues or questions, please create an issue in the project repository.
