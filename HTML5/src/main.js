import './styles.css';
import { Status } from './models/todo.js';
import { apiService } from './services/api.js';
import { KanbanBoard } from './components/kanban.js';
import { TodoForm } from './components/todoForm.js';
import { ProjectsMaster } from './components/projectsMaster.js';

/**
 * Main Application Class
 */
class TodoApp {
  constructor() {
    this.todos = [];
    this.projects = [];
    this.kanban = null;
    this.todoForm = null;
    this.projectsMaster = null;
  }

  /**
   * Initialize the application
   */
  async init() {
    console.log('=== Initializing Todo App ===');
    
    try {
      // Load initial data
      console.log('Loading todos...');
      await this.loadTodos();
      console.log('Loaded todos:', this.todos.length);
      
      console.log('Loading projects...');
      await this.loadProjects();
      console.log('Loaded projects:', this.projects.length);

      // Initialize UI components
      console.log('Initializing UI components...');
      this.initUI();
      
      // Render kanban
      console.log('Rendering kanban with', this.todos.length, 'items');
      this.renderKanban();
      
      console.log('=== Application initialized successfully ===');
    } catch (error) {
      console.error('=== INITIALIZATION FAILED ===');
      console.error('Error:', error.message);
      console.error('Stack:', error.stack);
      alert('Failed to load data. Make sure the JSON server is running on port 3001.\n\nError: ' + error.message);
    }
  }

  /**
   * Load todos from API
   */
  async loadTodos() {
    console.log('Fetching /api/todos...');
    
    // Try proxy first
    try {
      const response = await fetch('/api/todos');
      console.log('Proxy response status:', response.status);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      this.todos = await response.json();
      console.log('Todos via proxy:', this.todos.length);
      return;
    } catch (error) {
      console.warn('Proxy failed, trying direct:', error.message);
    }
    
    // Fallback to direct connection
    try {
      const response = await fetch('http://localhost:3001/todos');
      console.log('Direct response status:', response.status);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      this.todos = await response.json();
      console.log('Todos via direct:', this.todos.length);
    } catch (error) {
      console.error('All methods failed for todos');
      throw error;
    }
  }

  /**
   * Load projects from API
   */
  async loadProjects() {
    console.log('Fetching /api/projects...');
    
    // Try proxy first
    try {
      const response = await fetch('/api/projects');
      console.log('Proxy response status:', response.status);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      this.projects = await response.json();
      console.log('Projects via proxy:', this.projects.length);
      return;
    } catch (error) {
      console.warn('Proxy failed, trying direct:', error.message);
    }
    
    // Fallback to direct connection
    try {
      const response = await fetch('http://localhost:3001/projects');
      console.log('Direct response status:', response.status);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      this.projects = await response.json();
      console.log('Projects via direct:', this.projects.length);
    } catch (error) {
      console.error('All methods failed for projects');
      throw error;
    }
  }

  /**
   * Initialize UI components
   */
  initUI() {
    console.log('[initUI] Starting...');
    
    // Setup toolbar buttons
    const btnNewTodo = document.getElementById('btn-new-todo');
    const btnProjects = document.getElementById('btn-projects');
    const btnRefresh = document.getElementById('btn-refresh');
    
    if (btnNewTodo) {
      btnNewTodo.addEventListener('click', () => {
        console.log('New Todo button clicked');
        if (this.todoForm) {
          this.todoForm.setProjects(this.projects);
          this.todoForm.openForNew();
        }
      });
    }
    
    if (btnProjects) {
      btnProjects.addEventListener('click', () => {
        console.log('Projects button clicked');
        if (this.projectsMaster) {
          this.projectsMaster.setProjects(this.projects);
          this.projectsMaster.show();
        }
      });
    }
    
    if (btnRefresh) {
      btnRefresh.addEventListener('click', () => {
        console.log('Refresh button clicked');
        this.refreshData();
      });
    }

    // Initialize Kanban Board
    console.log('[initUI] Creating KanbanBoard instance...');
    this.kanban = new KanbanBoard('#kanban-board', {
      onTodoClick: (todo) => this.handleTodoClick(todo),
      onTodoChange: (todo) => this.handleTodoChange(todo)
    });

    // Initialize Todo Form
    console.log('[initUI] Creating TodoForm instance...');
    this.todoForm = new TodoForm('#todo-form-modal', {
      onSave: (todo) => this.handleTodoSave(todo),
      onCancel: () => this.handleTodoCancel(),
      onDelete: (id) => this.handleTodoDelete(id)
    });
    
    // Expose todoForm globally for modal click handler
    window.todoForm = this.todoForm;

    // Initialize Projects Master
    console.log('[initUI] Creating ProjectsMaster instance...');
    this.projectsMaster = new ProjectsMaster('#projects-master-content', {
      onProjectSaved: (project) => this.handleProjectSave(project),
      onProjectDeleted: (id) => this.handleProjectDelete(id)
    });
    
    console.log('[initUI] Completed successfully');
  }

  /**
   * Render the Kanban board
   */
  renderKanban() {
    console.log('Kanban init called with', this.todos?.length, 'todos');
    if (this.kanban && this.todos) {
      this.kanban.init(this.todos);
      console.log('Kanban rendered');
    } else {
      console.error('Kanban or todos not ready', { kanban: !!this.kanban, todos: !!this.todos });
    }
  }

  /**
   * Refresh data from server
   */
  async refreshData() {
    console.log('Refreshing data...');
    await Promise.all([
      this.loadTodos(),
      this.loadProjects()
    ]);
    this.renderKanban();
    console.log('Data refreshed');
  }

  /**
   * Handle todo click from kanban
   */
  handleTodoClick(todo) {
    console.log('Todo clicked:', todo.id);
    this.todoForm.setProjects(this.projects);
    this.todoForm.openForEdit(todo);
  }

  /**
   * Handle todo change (drag-drop)
   */
  async handleTodoChange(todo) {
    try {
      todo.updatedAt = new Date().toISOString();
      await apiService.put(`/todos/${todo.id}`, todo);
      
      const index = this.todos.findIndex(t => t.id === todo.id);
      if (index !== -1) {
        this.todos[index] = todo;
      }
      
      this.kanban.updateItem(todo);
      console.log('Todo updated successfully');
    } catch (error) {
      console.error('Failed to update todo:', error);
      alert('Failed to update todo. Please try again.');
      await this.refreshData();
    }
  }

  /**
   * Handle todo save (create/update)
   */
  async handleTodoSave(todo) {
    try {
      todo.updatedAt = new Date().toISOString();
      
      if (todo.id) {
        // Update existing
        await apiService.put(`/todos/${todo.id}`, todo);
        const index = this.todos.findIndex(t => t.id === todo.id);
        if (index !== -1) {
          this.todos[index] = todo;
          this.kanban.updateItem(todo);
        }
      } else {
        // Create new
        const savedTodo = await apiService.post('/todos', todo);
        this.todos.push(savedTodo);
        this.kanban.addItem(savedTodo);
      }
      
      console.log('Todo saved successfully');
    } catch (error) {
      console.error('Failed to save todo:', error);
      alert('Failed to save todo. Please try again.');
    }
  }

  /**
   * Handle todo cancel
   */
  handleTodoCancel() {
    console.log('Todo form cancelled');
  }

  /**
   * Handle todo delete
   */
  async handleTodoDelete(id) {
    try {
      await apiService.delete(`/todos/${id}`);
      this.todos = this.todos.filter(t => t.id !== id);
      this.kanban.removeItem(id);
      console.log('Todo deleted successfully');
    } catch (error) {
      console.error('Failed to delete todo:', error);
      alert('Failed to delete todo. Please try again.');
    }
  }

  /**
   * Handle project save
   */
  async handleProjectSave(project) {
    try {
      if (project.id) {
        // Update existing
        await apiService.put(`/projects/${project.id}`, project);
        const index = this.projects.findIndex(p => p.id === project.id);
        if (index !== -1) {
          this.projects[index] = project;
        }
      } else {
        // Create new
        const savedProject = await apiService.post('/projects', project);
        this.projects.push(savedProject);
      }
      
      console.log('Project saved successfully');
    } catch (error) {
      console.error('Failed to save project:', error);
      alert('Failed to save project. Please try again.');
    }
  }

  /**
   * Handle project delete
   */
  async handleProjectDelete(id) {
    try {
      await apiService.delete(`/projects/${id}`);
      this.projects = this.projects.filter(p => p.id !== id);
      
      // Update todos with this project
      for (const todo of this.todos) {
        if (todo.projectId === id) {
          todo.projectId = '';
          await apiService.put(`/todos/${todo.id}`, todo);
        }
      }
      
      console.log('Project deleted successfully');
      // Refresh the display
      this.renderKanban();
    } catch (error) {
      console.error('Failed to delete project:', error);
      alert('Failed to delete project. Please try again.');
    }
  }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded fired');
  
  const app = new TodoApp();
  app.init();
  
  // Expose app instance for debugging
  window.todoApp = app;
});
