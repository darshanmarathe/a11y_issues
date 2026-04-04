import { store } from '../store/store.js';
import { TODO_STATUS, TODO_PRIORITY } from '../models/todo.model.js';

class KanbanBoardComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.draggedCard = null;
  }

  connectedCallback() {
    this.render();
    this.loadData();
    this.setupDragAndDrop();
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Listen for todo-saved and todo-deleted events on window to refresh the board
    window.addEventListener('todo-saved', async () => {
      await this.loadData();
    });

    window.addEventListener('todo-deleted', async () => {
      await this.loadData();
    });
  }

  async loadData() {
    await store.getState().fetchTodos();
    this.renderCards();
  }

  getStatusColumns() {
    return [
      { status: TODO_STATUS.BACKLOG, title: 'Backlog', color: '#64748b' },
      { status: TODO_STATUS.LINEDUP, title: 'Lined Up', color: '#8b5cf6' },
      { status: TODO_STATUS.WIP, title: 'WIP', color: '#f59e0b' },
      { status: TODO_STATUS.DONE, title: 'Done', color: '#22c55e' },
      { status: TODO_STATUS.STUCK, title: 'Stuck', color: '#ef4444' },
    ];
  }

  getPriorityClass(priority) {
    return `priority-${priority.toLowerCase()}`;
  }

  createCardHTML(todo) {
    return `
      <div class="kanban-card" draggable="true" data-id="${todo.id}" data-priority="${todo.priority}">
        <h4>${todo.title}</h4>
        <p>${todo.description || 'No description'}</p>
        <div class="kanban-card-footer">
          <span class="priority-badge ${this.getPriorityClass(todo.priority)}">${todo.priority}</span>
          <span>${todo.user || 'Admin'}</span>
        </div>
      </div>
    `;
  }

  renderCards() {
    const state = store.getState();
    const columns = this.shadowRoot.querySelectorAll('.kanban-column');
    
    columns.forEach((column) => {
      const status = column.getAttribute('data-status');
      const todosForStatus = state.todos.filter((todo) => todo.status === status);
      const cardsContainer = column.querySelector('.kanban-cards');
      
      cardsContainer.innerHTML = todosForStatus
        .map((todo) => this.createCardHTML(todo))
        .join('');
      
      // Update count
      const countBadge = column.querySelector('.count');
      countBadge.textContent = todosForStatus.length;
    });

    this.setupDragAndDrop();
  }

  render() {
    const columns = this.getStatusColumns();

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
        }

        .kanban-board {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 20px;
          overflow-x: auto;
          padding-bottom: 20px;
          min-height: 500px;
        }

        .kanban-column {
          background: var(--bg-color);
          border-radius: 8px;
          padding: 16px;
          min-height: 400px;
          transition: background 0.2s;
        }

        .kanban-column.drag-over {
          background: rgba(59, 130, 246, 0.1);
        }

        .kanban-column-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 2px solid;
        }

        .kanban-column-header h3 {
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin: 0;
        }

        .kanban-column-header .count {
          background: var(--secondary-color);
          color: white;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }

        .kanban-cards {
          display: flex;
          flex-direction: column;
          gap: 12px;
          min-height: 300px;
        }

        .kanban-card {
          background: white;
          border-radius: 6px;
          padding: 14px;
          box-shadow: var(--shadow);
          cursor: pointer;
          transition: all 0.2s;
          border-left: 3px solid transparent;
        }

        .kanban-card:hover {
          box-shadow: var(--shadow-lg);
          transform: translateY(-2px);
        }

        .kanban-card.dragging {
          opacity: 0.5;
          transform: rotate(5deg);
        }

        .kanban-card[data-priority="Urgent"] {
          border-left-color: #ef4444;
        }

        .kanban-card[data-priority="High"] {
          border-left-color: #f59e0b;
        }

        .kanban-card[data-priority="Medium"] {
          border-left-color: #3b82f6;
        }

        .kanban-card[data-priority="Low"] {
          border-left-color: #64748b;
        }

        .kanban-card h4 {
          font-size: 14px;
          font-weight: 600;
          margin: 0 0 8px 0;
          color: var(--text-primary);
        }

        .kanban-card p {
          font-size: 12px;
          color: var(--text-secondary);
          margin: 0 0 10px 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .kanban-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .priority-badge {
          padding: 2px 8px;
          border-radius: 10px;
          font-size: 10px;
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

        .kanban-column[data-status="Backlog"] .kanban-column-header {
          border-color: #64748b;
        }

        .kanban-column[data-status="Linedup"] .kanban-column-header {
          border-color: #8b5cf6;
        }

        .kanban-column[data-status="Wip"] .kanban-column-header {
          border-color: #f59e0b;
        }

        .kanban-column[data-status="Done"] .kanban-column-header {
          border-color: #22c55e;
        }

        .kanban-column[data-status="Stuck"] .kanban-column-header {
          border-color: #ef4444;
        }
      </style>

      <div class="kanban-board">
        ${columns
          .map(
            (col) => `
          <div class="kanban-column" data-status="${col.status}">
            <div class="kanban-column-header">
              <h3>${col.title}</h3>
              <span class="count">0</span>
            </div>
            <div class="kanban-cards"></div>
          </div>
        `
          )
          .join('')}
      </div>
    `;
  }

  setupDragAndDrop() {
    const cards = this.shadowRoot.querySelectorAll('.kanban-card');
    const columns = this.shadowRoot.querySelectorAll('.kanban-column');

    cards.forEach((card) => {
      card.addEventListener('dragstart', (e) => {
        this.draggedCard = card;
        card.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', card.getAttribute('data-id'));
      });

      card.addEventListener('dragend', () => {
        card.classList.remove('dragging');
        this.draggedCard = null;
        
        // Remove drag-over class from all columns
        columns.forEach((col) => col.classList.remove('drag-over'));
      });

      // Click to edit
      card.addEventListener('click', () => {
        const todoId = card.getAttribute('data-id');
        this.openEditModal(todoId);
      });
    });

    columns.forEach((column) => {
      column.addEventListener('dragover', (e) => {
        e.preventDefault();
        column.classList.add('drag-over');
      });

      column.addEventListener('dragleave', () => {
        column.classList.remove('drag-over');
      });

      column.addEventListener('drop', async (e) => {
        e.preventDefault();
        column.classList.remove('drag-over');

        const todoId = e.dataTransfer.getData('text/plain');
        const newStatus = column.getAttribute('data-status');

        if (todoId && newStatus) {
          await this.updateTodoStatus(todoId, newStatus);
        }
      });
    });
  }

  async updateTodoStatus(todoId, newStatus) {
    try {
      const updates = {
        status: newStatus,
        isCompleted: newStatus === TODO_STATUS.DONE,
        completionDate: newStatus === TODO_STATUS.DONE ? new Date().toISOString() : null,
      };
      await store.getState().updateTodo(todoId, updates);
      this.renderCards();
      
      // Dispatch custom event for notification
      this.dispatchEvent(new CustomEvent('todo-updated', {
        bubbles: true,
        composed: true,
        detail: { todoId, newStatus },
      }));
    } catch (error) {
      console.error('Failed to update todo status:', error);
    }
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

customElements.define('kanban-board-component', KanbanBoardComponent);

export default KanbanBoardComponent;
