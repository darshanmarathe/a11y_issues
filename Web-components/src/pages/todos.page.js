import { store } from '../store/store.js';
import { TODO_STATUS, TODO_PRIORITY } from '../models/todo.model.js';

class TodosPage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  async connectedCallback() {
    await Promise.all([
      store.getState().fetchTodos(),
      store.getState().fetchProjects(),
    ]);
    this.render();
    this.setupEventListeners();
  }

  getStatusClass(status) {
    return `status-${status.toLowerCase()}`;
  }

  getPriorityClass(priority) {
    return `priority-${priority.toLowerCase()}`;
  }

  render() {
    const state = store.getState();
    const todos = state.todos || [];
    const projects = state.projects || [];

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }

        .page-header {
          margin-bottom: 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .page-header h2 {
          font-size: 2rem;
          font-weight: 700;
          margin: 0 0 10px 0;
          color: var(--text-primary);
        }

        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 10px 20px;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-primary {
          background: #3b82f6;
          color: white;
        }

        .btn-primary:hover {
          background: #2563eb;
        }

        .btn-sm {
          padding: 6px 12px;
          font-size: 12px;
        }

        .btn-edit {
          background: #3b82f6;
          color: white;
        }

        .btn-delete {
          background: #ef4444;
          color: white;
        }

        .card {
          background: white;
          border-radius: 8px;
          box-shadow: var(--shadow);
          padding: 20px;
          overflow-x: auto;
        }

        .table {
          width: 100%;
          border-collapse: collapse;
        }

        .table th,
        .table td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #e2e8f0;
        }

        .table th {
          font-weight: 600;
          background: #f8fafc;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .table td {
          font-size: 14px;
        }

        .table tr:hover {
          background: #f8fafc;
        }

        .status-badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .status-backlog {
          background: #f1f5f9;
          color: #64748b;
        }

        .status-linedup {
          background: #ede9fe;
          color: #8b5cf6;
        }

        .status-wip {
          background: #fef3c7;
          color: #d97706;
        }

        .status-done {
          background: #dcfce7;
          color: #16a34a;
        }

        .status-stuck {
          background: #fee2e2;
          color: #ef4444;
        }

        .priority-badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .priority-urgent {
          background: #fee2e2;
          color: #ef4444;
        }

        .priority-high {
          background: #fef3c7;
          color: #d97706;
        }

        .priority-medium {
          background: #dbeafe;
          color: #3b82f6;
        }

        .priority-low {
          background: #f1f5f9;
          color: #64748b;
        }

        .actions {
          display: flex;
          gap: 8px;
        }

        .filter-bar {
          margin-bottom: 20px;
          display: flex;
          gap: 10px;
        }

        .filter-bar select {
          padding: 8px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          font-size: 14px;
        }
      </style>

      <div class="page-header">
        <div>
          <h2>All Todos</h2>
          <p>Manage your todo list</p>
        </div>
        <button class="btn btn-primary" id="btn-add-todo">+ Add Todo</button>
      </div>

      <div class="filter-bar">
        <select id="filter-status">
          <option value="">All Status</option>
          ${Object.values(TODO_STATUS)
            .map((status) => `<option value="${status}">${status}</option>`)
            .join('')}
        </select>
        <select id="filter-priority">
          <option value="">All Priority</option>
          ${Object.values(TODO_PRIORITY)
            .map((priority) => `<option value="${priority}">${priority}</option>`)
            .join('')}
        </select>
      </div>

      <div class="card">
        <table class="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Target Date</th>
              <th>User</th>
              <th>Projects</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="todos-tbody">
            ${this.renderTodoRows(todos)}
          </tbody>
        </table>
      </div>
    `;

    this.setupFilterListeners();
  }

  renderTodoRows(todos) {
    if (todos.length === 0) {
      return `
        <tr>
          <td colspan="7" class="text-center">No todos found</td>
        </tr>
      `;
    }

    return todos
      .map(
        (todo) => `
        <tr>
          <td><strong>${todo.title}</strong></td>
          <td><span class="status-badge ${this.getStatusClass(todo.status)}">${todo.status}</span></td>
          <td><span class="priority-badge ${this.getPriorityClass(todo.priority)}">${todo.priority}</span></td>
          <td>${todo.target_completion_date ? new Date(todo.target_completion_date).toLocaleDateString() : '-'}</td>
          <td>${todo.user || 'Admin'}</td>
          <td>${(todo.projects || []).join(', ') || '-'}</td>
          <td class="actions">
            <button class="btn btn-sm btn-edit" data-edit="${todo.id}">Edit</button>
            <button class="btn btn-sm btn-delete" data-delete="${todo.id}">Delete</button>
          </td>
        </tr>
      `
      )
      .join('');
  }

  setupFilterListeners() {
    const statusFilter = this.shadowRoot.querySelector('#filter-status');
    const priorityFilter = this.shadowRoot.querySelector('#filter-priority');

    const filterTodos = () => {
      const state = store.getState();
      let filtered = [...state.todos];

      if (statusFilter.value) {
        filtered = filtered.filter((t) => t.status === statusFilter.value);
      }

      if (priorityFilter.value) {
        filtered = filtered.filter((t) => t.priority === priorityFilter.value);
      }

      const tbody = this.shadowRoot.querySelector('#todos-tbody');
      tbody.innerHTML = this.renderTodoRows(filtered);
      this.setupActionButtons();
    };

    statusFilter.addEventListener('change', filterTodos);
    priorityFilter.addEventListener('change', filterTodos);
  }

  setupEventListeners() {
    // Add todo button
    this.shadowRoot.querySelector('#btn-add-todo').addEventListener('click', () => {
      this.openAddModal();
    });

    this.setupActionButtons();

    // Listen for updates
    this.addEventListener('todo-saved', async () => {
      await store.getState().fetchTodos();
      this.render();
    });

    this.addEventListener('todo-deleted', async () => {
      await store.getState().fetchTodos();
      this.render();
    });
  }

  setupActionButtons() {
    const editButtons = this.shadowRoot.querySelectorAll('[data-edit]');
    const deleteButtons = this.shadowRoot.querySelectorAll('[data-delete]');

    editButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const todoId = parseInt(btn.getAttribute('data-edit'));
        this.openEditModal(todoId);
      });
    });

    deleteButtons.forEach((btn) => {
      btn.addEventListener('click', async () => {
        const todoId = parseInt(btn.getAttribute('data-delete'));
        if (confirm('Are you sure you want to delete this todo?')) {
          await store.getState().deleteTodo(todoId);
        }
      });
    });
  }

  openAddModal() {
    const event = new CustomEvent('open-todo-modal', {
      bubbles: true,
      composed: true,
      detail: { todoId: null },
    });
    this.dispatchEvent(event);
  }

  openEditModal(todoId) {
    const event = new CustomEvent('open-todo-modal', {
      bubbles: true,
      composed: true,
      detail: { todoId },
    });
    this.dispatchEvent(event);
  }
}

customElements.define('todos-page', TodosPage);

export default TodosPage;
