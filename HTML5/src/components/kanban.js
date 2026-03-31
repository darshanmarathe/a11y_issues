import { Status, Priority } from '../models/todo.js';

/**
 * Kanban Board Component - Custom implementation without jQXWidgets
 */
export class KanbanBoard {
  constructor(containerId, options = {}) {
    this.containerId = containerId;
    this.options = options;
    this.onTodoClick = options.onTodoClick || (() => {});
    this.onTodoChange = options.onTodoChange || (() => {});
    this.items = [];
    this.draggedItem = null;
    
    console.log('[KanbanBoard] Constructor called for', containerId);
  }

  /**
   * Get color based on priority
   */
  getPriorityColor(priority) {
    const colors = {
      [Priority.URGENT]: '#ef4444',
      [Priority.HIGH]: '#f97316',
      [Priority.MEDIUM]: '#eab308',
      [Priority.LOW]: '#22c55e'
    };
    return colors[priority] || '#6b7280';
  }

  /**
   * Format date for display
   */
  formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  /**
   * Create card HTML
   */
  createCard(item) {
    const priorityColor = this.getPriorityColor(item.priority);
    const isOverdue = item.targetCompletionDate && 
      new Date(item.targetCompletionDate) < new Date() && 
      item.status !== Status.DONE;
    
    const card = document.createElement('div');
    card.className = 'kanban-card p-3 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors mb-2 select-none';
    card.draggable = true;
    card.dataset.id = item.id;
    
    card.innerHTML = `
      <div class="flex justify-between items-start mb-2">
        <span class="text-xs px-2 py-1 rounded text-white" style="background-color: ${priorityColor}">${item.priority}</span>
        ${item.link ? `<a href="${item.link}" target="_blank" class="text-blue-400 hover:text-blue-300 text-sm">🔗</a>` : ''}
      </div>
      <h4 class="text-white font-semibold mb-1 text-sm">${item.title}</h4>
      <p class="text-gray-400 text-xs mb-2 line-clamp-2">${item.description || 'No description'}</p>
      <div class="flex justify-between items-center text-xs text-gray-500">
        <span>👤 ${item.user || 'Unassigned'}</span>
        ${item.targetCompletionDate ? `
          <span class="${isOverdue ? 'text-red-400' : ''}">
            📅 ${this.formatDate(item.targetCompletionDate)}
          </span>
        ` : ''}
      </div>
      ${item.projectId ? `<div class="mt-2 text-xs text-blue-400">📁 ${item.projectId}</div>` : ''}
    `;
    
    // Click handler
    card.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.onTodoClick(item);
    });
    
    // Drag handlers
    card.addEventListener('dragstart', (e) => {
      this.draggedItem = item;
      card.classList.add('opacity-50');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', item.id);
    });
    
    card.addEventListener('dragend', () => {
      card.classList.remove('opacity-50');
      this.draggedItem = null;
    });
    
    return card;
  }

  /**
   * Create column HTML
   */
  createColumn(status, label) {
    const column = document.createElement('div');
    column.className = 'kanban-column bg-gray-750 rounded-lg flex flex-col min-w-[280px] max-w-[280px]';
    column.dataset.status = status;
    
    const items = this.items.filter(item => item.status === status);
    
    column.innerHTML = `
      <div class="kanban-column-header p-3 font-semibold text-white border-b border-gray-600 rounded-t-lg flex justify-between items-center" style="background-color: ${this.getStatusColor(status)}">
        <span>${label}</span>
        <span class="text-xs bg-gray-600 px-2 py-1 rounded">${items.length}</span>
      </div>
      <div class="kanban-column-content p-2 flex-1 overflow-y-auto min-h-[200px]" data-status="${status}"></div>
    `;
    
    const content = column.querySelector('.kanban-column-content');
    
    // Drop zone handlers
    content.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      content.classList.add('bg-gray-700');
    });
    
    content.addEventListener('dragleave', () => {
      content.classList.remove('bg-gray-700');
    });
    
    content.addEventListener('drop', (e) => {
      e.preventDefault();
      content.classList.remove('bg-gray-700');
      
      const itemId = e.dataTransfer.getData('text/plain');
      const newStatus = content.dataset.status;
      
      if (this.draggedItem && this.draggedItem.id === itemId) {
        this.handleItemMove(this.draggedItem, newStatus);
      }
    });
    
    // Add cards
    items.forEach(item => {
      content.appendChild(this.createCard(item));
    });
    
    return column;
  }

  /**
   * Get status color
   */
  getStatusColor(status) {
    const colors = {
      [Status.BACKLOG]: '#6b7280',
      [Status.LINEDUP]: '#3b82f6',
      [Status.WIP]: '#f59e0b',
      [Status.DONE]: '#10b981',
      [Status.STUCK]: '#ef4444'
    };
    return colors[status] || '#6b7280';
  }

  /**
   * Handle item move
   */
  handleItemMove(item, newStatus) {
    console.log('[KanbanBoard] Item moved:', item.id, 'to', newStatus);
    
    if (item.status !== newStatus) {
      item.status = newStatus;
      if (newStatus === Status.DONE) {
        item.isCompleted = true;
        item.completionDate = new Date().toISOString();
      } else {
        item.isCompleted = false;
        item.completionDate = null;
      }
      this.onTodoChange(item);
      this.render();
    }
  }

  /**
   * Initialize the Kanban board
   */
  init(items) {
    console.log('[KanbanBoard] init() called with', items.length, 'items');
    this.items = items;
    
    const container = document.querySelector(this.containerId);
    if (!container) {
      console.error('[KanbanBoard] Container not found:', this.containerId);
      return;
    }
    
    container.innerHTML = '';
    container.className = 'flex gap-4 p-4 h-full overflow-x-auto';
    
    // Create columns
    const columns = [
      { status: Status.BACKLOG, label: '📋 Backlog' },
      { status: Status.LINEDUP, label: '📝 Lined Up' },
      { status: Status.WIP, label: '🔄 In Progress' },
      { status: Status.DONE, label: '✅ Done' },
      { status: Status.STUCK, label: '🚫 Stuck' }
    ];
    
    columns.forEach(({ status, label }) => {
      container.appendChild(this.createColumn(status, label));
    });
    
    console.log('[KanbanBoard] Kanban initialized successfully');
  }

  /**
   * Render the board
   */
  render() {
    this.init(this.items);
  }

  /**
   * Update an item
   */
  updateItem(item) {
    const index = this.items.findIndex(i => i.id === item.id);
    if (index !== -1) {
      this.items[index] = item;
      this.render();
    }
  }

  /**
   * Add a new item
   */
  addItem(item) {
    this.items.push(item);
    this.render();
  }

  /**
   * Remove an item
   */
  removeItem(itemId) {
    this.items = this.items.filter(i => i.id !== itemId);
    this.render();
  }
}
