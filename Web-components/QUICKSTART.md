# Quick Start Guide

## 🚀 Running the Application

### Method 1: Double-click run.bat
1. Simply double-click the `run.bat` file
2. Wait for both servers to start
3. Your browser should open automatically to http://localhost:3000

### Method 2: Manual Start
```bash
npm start
```

## 📱 Access Points

- **Frontend App**: http://localhost:3000
- **Backend API**: http://localhost:3001

## 🎯 What You'll See

### Dashboard (Home Page)
- Statistics cards showing todo counts by status
- Full Kanban board with drag-and-drop functionality
- 5 columns: Backlog, Lined Up, WIP, Done, Stuck

### Sidebar Navigation
- **Dashboard** - Overview and Kanban board
- **All Todos** - Table view with filtering options
- **Projects** - Project management page

## ✨ Key Features to Try

### 1. Kanban Board
- Drag cards between columns to change status
- Click any card to edit it
- Color-coded priorities (Urgent=Red, High=Orange, Medium=Blue, Low=Gray)

### 2. Todo Management
- Click "+ Add Todo" to create new todos
- Edit existing todos
- Filter by status and priority
- Delete todos

### 3. Projects
- Create and manage multiple projects
- Toggle active/inactive status
- Associate todos with projects

## 🔧 Troubleshooting

### If the app doesn't start:
1. Make sure Node.js is installed
2. Run `npm install` to ensure all dependencies are installed
3. Check if ports 3000 and 3001 are available
4. Check the console for error messages

### If you see a blank page:
1. Open browser console (F12) to check for errors
2. Make sure both servers are running
3. Try clearing browser cache

## 📊 Sample Data

The app comes pre-loaded with sample data:
- 5 sample todos across different statuses
- 3 sample projects (2 active, 1 inactive)

## 🛠️ API Endpoints

Test the backend directly:
- http://localhost:3001/todos - All todos
- http://localhost:3001/projects - All projects

## 💡 Tips

- Use the dashboard for a visual overview
- Use the Todos page for detailed management
- Projects help organize related todos
- Set target dates to track deadlines
- Use priority levels to focus on important tasks

Enjoy your Todo App! 🎉
