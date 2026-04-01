import { Status, Priority, createTodo } from '../models/todo.js';

/**
 * Todo Form Component - Custom modal with intentional a11y issues
 */
export class TodoForm {
  constructor(containerId, options = {}) {
    this.containerId = containerId;
    this.options = options;
    this.onSave = options.onSave || (() => {});
    this.onCancel = options.onCancel || (() => {});
    this.onDelete = options.onDelete || (() => {});
    this.currentTodo = null;
    this.projects = [];
    this.isOpen = false;
  }

  setProjects(projects) {
    this.projects = projects;
  }

  openForNew() {
    this.currentTodo = null;
    this.render();
    this.show();
  }

  openForEdit(todo) {
    this.currentTodo = { ...todo };
    this.render();
    this.show();
  }

  show() {
    const modal = document.querySelector(this.containerId);
    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
      this.isOpen = true;
      // ISSUE: No focus trap
      // ISSUE: No focus management when modal opens
    }
  }

  hide() {
    const modal = document.querySelector(this.containerId);
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      this.isOpen = false;
      // ISSUE: Focus not returned to trigger element
    }
  }

  getFormData() {
    const title = document.getElementById('todo-title')?.value || '';
    const description = document.getElementById('todo-description')?.value || '';
    const status = document.getElementById('todo-status')?.value || Status.BACKLOG;
    const priority = document.getElementById('todo-priority')?.value || Priority.MEDIUM;
    const targetCompletionDate = document.getElementById('todo-target-date')?.value || '';
    const link = document.getElementById('todo-link')?.value || '';
    const projectId = document.getElementById('todo-project')?.value || '';
    const user = document.getElementById('todo-user')?.value || '';

    const todo = createTodo({
      id: this.currentTodo?.id,
      title,
      description,
      status,
      priority,
      targetCompletionDate: targetCompletionDate ? new Date(targetCompletionDate).toISOString() : '',
      link,
      projectId,
      user,
      isCompleted: status === Status.DONE,
      completionDate: status === Status.DONE ? new Date().toISOString() : null
    });

    if (this.currentTodo) {
      todo.createdAt = this.currentTodo.createdAt;
    }

    return todo;
  }

  render() {
    const isEdit = !!this.currentTodo;
    const modal = document.querySelector(this.containerId);
    
    if (!modal) return;
    
    const projectOptions = this.projects
      .map(p => `<option value="${p.id}" ${this.currentTodo?.projectId === p.id ? 'selected' : ''}>${p.name}</option>`)
      .join('');
    
    const statusOptions = Object.values(Status)
      .map(s => `<option value="${s}" ${this.currentTodo?.status === s ? 'selected' : ''}>${s}</option>`)
      .join('');
    
    const priorityOptions = Object.values(Priority)
      .map(p => `<option value="${p}" ${this.currentTodo?.priority === p ? 'selected' : ''}>${p}</option>`)
      .join('');
    
    // ISSUE: Modal without role="dialog" and aria-modal
    // ISSUE: No aria-labelledby pointing to title
    // ISSUE: Labels not properly associated with inputs (using visual labels only)
    // ISSUE: Error messages not associated with inputs via aria-describedby
    // ISSUE: No aria-required on required fields
    modal.innerHTML = `
      <div class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onclick="if(event.target === this) window.todoForm.hide()">
        <div class="bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div class="p-6">
            <h3 class="text-xl font-bold text-white mb-4">${isEdit ? 'Edit Todo' : 'New Todo'}</h3>
            
            <div class="space-y-4">
              <!-- Title - ISSUE: label without for attribute -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-1">Title *</label>
                <input id="todo-title" type="text" class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  value="${this.currentTodo?.title || ''}" placeholder="Enter todo title" />
              </div>

              <!-- Description -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-1">Description</label>
                <textarea id="todo-description" rows="3" class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  placeholder="Enter description">${this.currentTodo?.description || ''}</textarea>
              </div>

              <!-- Status and Priority Row -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-1">Status</label>
                  <select id="todo-status" class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    ${statusOptions}
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-1">Priority</label>
                  <select id="todo-priority" class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    ${priorityOptions}
                  </select>
                </div>
              </div>

              <!-- Target Date and User Row -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-1">Target Completion Date</label>
                  <input id="todo-target-date" type="date" class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    value="${this.currentTodo?.targetCompletionDate ? this.currentTodo.targetCompletionDate.split('T')[0] : ''}" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-1">User</label>
                  <input id="todo-user" type="text" class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    value="${this.currentTodo?.user || ''}" placeholder="Assigned user" />
                </div>
              </div>

              <!-- Project and Link Row -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-1">Project</label>
                  <select id="todo-project" class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">No Project</option>
                    ${projectOptions}
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-1">Link</label>
                  <input id="todo-link" type="url" class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    value="${this.currentTodo?.link || ''}" placeholder="https://..." />
                </div>
              </div>

              <!-- Completion Date -->
              ${this.currentTodo?.completionDate ? `
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-1">Completed On</label>
                  <input type="text" class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-400" 
                    value="${new Date(this.currentTodo.completionDate).toLocaleString()}" readonly />
                </div>
              ` : ''}
            </div>

            <!-- Actions -->
            <div class="flex justify-end gap-3 mt-6">
              <button id="btn-cancel" class="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded transition-colors">Cancel</button>
              <button id="btn-save" class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors">Save</button>
              ${isEdit ? '<button id="btn-delete" class="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded transition-colors">Delete</button>' : ''}
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('btn-cancel')?.addEventListener('click', () => {
      this.hide();
      this.onCancel();
    });

    document.getElementById('btn-save')?.addEventListener('click', () => {
      const todo = this.getFormData();
      
      // ISSUE: Error shown in alert instead of inline, not announced to screen readers
      if (!todo.title.trim()) {
        alert('Title is required');
        return;
      }

      this.onSave(todo);
      this.hide();
    });

    if (isEdit) {
      document.getElementById('btn-delete')?.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete this todo?')) {
          this.onDelete(this.currentTodo.id);
          this.hide();
        }
      });
    }
  }
}

window.todoForm = null;
