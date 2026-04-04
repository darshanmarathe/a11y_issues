import { store } from '../store/store.js';
import { TODO_STATUS, TODO_PRIORITY } from '../models/todo.model.js';

class TodoModalComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.currentTodo = null;
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();

    // Listen for open modal events on window with capture phase
    window.addEventListener('open-todo-modal', (e) => {
      console.log('✅ Modal received open-todo-modal event:', e.detail);
      this.openModal(e.detail.todoId);
    }, true); // true = capture phase, before it bubbles through shadow DOM
    
    // Also listen on document as backup
    document.addEventListener('open-todo-modal', (e) => {
      console.log('✅ Modal received event on document:', e.detail);
    }, true);
    
    // Test: expose a global function to manually open modal
    window.testOpenModal = (todoId) => {
      console.log('testOpenModal called with:', todoId);
      this.openModal(todoId);
    };
  }

  async openModal(todoId) {
    console.log('openModal called with todoId:', todoId);

    // Fetch latest data from store
    await Promise.all([
      store.getState().fetchTodos(),
      store.getState().fetchProjects(),
    ]);

    const state = store.getState();
    console.log('Current store state:', state);

    if (todoId) {
      // Convert to string for comparison since DB stores IDs as strings
      const todoIdStr = String(todoId);
      this.currentTodo = state.todos.find((t) => String(t.id) === todoIdStr);
      console.log('Found todo to edit:', this.currentTodo);
    } else {
      this.currentTodo = null;
      console.log('Creating new todo (no todoId)');
    }

    // Save currentTodo to a temporary variable before render
    const todoToPopulate = this.currentTodo;

    // Re-render to get updated projects list and populate form
    this.render();

    // Setup event listeners again after re-render
    this.setupEventListeners();

    // Small delay to ensure DOM is updated
    setTimeout(() => {
      console.log('=== DEBUG: Before populateForm ===');
      console.log('this.currentTodo:', this.currentTodo);
      console.log('todoToPopulate:', todoToPopulate);
      console.log('shadowRoot:', this.shadowRoot);
      console.log('shadowRoot.innerHTML length:', this.shadowRoot.innerHTML?.length);

      const form = this.shadowRoot.querySelector('#todo-form');
      console.log('form element:', form);

      if (form) {
        const titleInput = form.querySelector('#todo-title');
        console.log('title input element:', titleInput);
        if (titleInput) {
          console.log('title input value:', titleInput.value);
        }
      }

      const titleEl = this.shadowRoot.querySelector('#modal-title');
      
      if (todoToPopulate) {
        console.log('Calling populateForm with:', todoToPopulate);
        this.populateForm(todoToPopulate);
        if (titleEl) {
          titleEl.textContent = 'Edit Todo';
        }
      } else {
        console.log('No currentTodo, resetting form');
        this.resetForm();
        if (titleEl) {
          titleEl.textContent = 'Add Todo';
        }
      }

      console.log('=== DEBUG: After populateForm ===');
      const formAfter = this.shadowRoot.querySelector('#todo-form');
      if (formAfter) {
        const titleAfter = formAfter.querySelector('#todo-title');
        console.log('title input value after populateForm:', titleAfter?.value);
      }

      const overlay = this.shadowRoot.querySelector('.modal-overlay');
      if (overlay) {
        overlay.style.display = 'flex';
      }
    }, 100);
  }

  closeModal() {
    this.shadowRoot.querySelector('.modal-overlay').style.display = 'none';
    this.currentTodo = null;
  }

  resetForm() {
    console.log('resetForm called');
    
    const fields = {
      '#todo-id': '',
      '#todo-title': '',
      '#todo-description': '',
      '#todo-status': TODO_STATUS.BACKLOG,
      '#todo-priority': TODO_PRIORITY.MEDIUM,
      '#todo-target-date': '',
      '#todo-link': '',
      '#todo-user': 'Admin',
    };

    Object.entries(fields).forEach(([selector, value]) => {
      const el = this.shadowRoot.querySelector(selector);
      if (el) {
        el.value = value;
        console.log(`Reset ${selector} to:`, value);
      }
    });

    // Reset checkbox
    const completedCheckbox = this.shadowRoot.querySelector('#todo-completed');
    if (completedCheckbox) {
      completedCheckbox.checked = false;
    }

    // Reset project checkboxes
    const projectCheckboxes = this.shadowRoot.querySelectorAll('#todo-projects input[type="checkbox"]');
    projectCheckboxes.forEach((cb) => {
      cb.checked = false;
    });
  }

  populateForm(todo) {
    console.log('=== populateForm called with:', todo);

    const form = this.shadowRoot.querySelector('#todo-form');
    if (!form) {
      console.error('❌ Form not found!');
      return;
    }
    console.log('✅ Form found');

    // Set all form fields
    const fields = {
      '#todo-id': todo.id || '',
      '#todo-title': todo.title || '',
      '#todo-description': todo.description || '',
      '#todo-status': todo.status || TODO_STATUS.BACKLOG,
      '#todo-priority': todo.priority || TODO_PRIORITY.MEDIUM,
      '#todo-target-date': todo.target_completion_date || '',
      '#todo-link': todo.link || '',
      '#todo-user': todo.user || 'Admin',
    };

    Object.entries(fields).forEach(([selector, value]) => {
      const el = this.shadowRoot.querySelector(selector);
      if (el) {
        const oldValue = el.value;
        el.value = value;
        console.log(`✅ Set ${selector} from "${oldValue}" to "${value}"`);
      } else {
        console.error(`❌ Element ${selector} not found!`);
      }
    });

    // Handle checkbox separately
    const completedCheckbox = this.shadowRoot.querySelector('#todo-completed');
    if (completedCheckbox) {
      completedCheckbox.checked = !!todo.isCompleted;
      console.log('✅ Set isCompleted to:', !!todo.isCompleted);
    } else {
      console.error('❌ #todo-completed not found!');
    }

    // Set projects
    const projectCheckboxes = this.shadowRoot.querySelectorAll('#todo-projects input[type="checkbox"]');
    const todoProjects = todo.projects || [];
    console.log('Todo projects:', todoProjects, 'Found checkboxes:', projectCheckboxes.length);
    projectCheckboxes.forEach((cb) => {
      const projectId = parseInt(cb.value);
      cb.checked = todoProjects.includes(projectId);
      console.log(`✅ Checkbox project ${cb.value} set to:`, cb.checked);
    });
    
    console.log('=== populateForm completed ===');
  }

  setupEventListeners() {
    // Close button
    const closeBtn = this.shadowRoot.querySelector('.modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.closeModal();
      });
    }

    // Cancel button
    const cancelBtn = this.shadowRoot.querySelector('.btn-cancel');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        this.closeModal();
      });
    }

    // Form submit
    const form = this.shadowRoot.querySelector('#todo-form');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.saveTodo();
      });
    }

    // Delete button
    const deleteBtn = this.shadowRoot.querySelector('.btn-delete');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', async () => {
        if (this.currentTodo && confirm('Are you sure you want to delete this todo?')) {
          await store.getState().deleteTodo(this.currentTodo.id);
          this.closeModal();
          window.dispatchEvent(new CustomEvent('todo-deleted', {
            detail: { todoId: this.currentTodo.id },
          }));
        }
      });
    }
  }

  async saveTodo() {
    const form = this.shadowRoot.querySelector('#todo-form');
    const formData = new FormData(form);
    
    const selectedProjects = [];
    form.querySelectorAll('#todo-projects input[type="checkbox"]:checked').forEach((cb) => {
      selectedProjects.push(parseInt(cb.value));
    });

    const todoData = {
      title: formData.get('title'),
      description: formData.get('description'),
      status: formData.get('status'),
      priority: formData.get('priority'),
      target_completion_date: formData.get('target_completion_date'),
      link: formData.get('link'),
      user: formData.get('user'),
      isCompleted: formData.get('isCompleted') === 'on',
      projects: selectedProjects,
      completionDate: formData.get('status') === TODO_STATUS.DONE ? new Date().toISOString() : null,
    };

    try {
      if (this.currentTodo && this.currentTodo.id) {
        // Update existing todo
        await store.getState().updateTodo(this.currentTodo.id, todoData);
      } else {
        // Create new todo
        await store.getState().createTodo(todoData);
      }
      
      this.closeModal();
      window.dispatchEvent(new CustomEvent('todo-saved'));
    } catch (error) {
      console.error('Failed to save todo:', error);
      alert('Failed to save todo. Please try again.');
    }
  }

  render() {
    const state = store.getState();
    const projects = state.projects || [];

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }

        .modal-overlay {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 1000;
          align-items: center;
          justify-content: center;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }

        .modal {
          background: white;
          border-radius: 8px;
          width: 90%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #e2e8f0;
        }

        .modal-header h3 {
          font-size: 18px;
          font-weight: 600;
          margin: 0;
        }

        .modal-close {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #64748b;
          padding: 0;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-body {
          padding: 20px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #0f172a;
        }

        .form-control {
          width: 100%;
          padding: 10px 14px;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          font-size: 14px;
          transition: all 0.2s;
        }

        .form-control:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        textarea.form-control {
          min-height: 100px;
          resize: vertical;
        }

        .checkbox-group {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }

        .checkbox-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .checkbox-item input[type="checkbox"] {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }

        .modal-footer {
          display: flex;
          justify-content: space-between;
          padding: 20px;
          border-top: 1px solid #e2e8f0;
        }

        .footer-left {
          display: flex;
        }

        .footer-right {
          display: flex;
          gap: 10px;
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

        .btn-secondary {
          background: #64748b;
          color: white;
        }

        .btn-secondary:hover {
          background: #475569;
        }

        .btn-danger {
          background: #ef4444;
          color: white;
        }

        .btn-danger:hover {
          background: #dc2626;
        }
      </style>

      <div class="modal-overlay">
        <div class="modal">
          <div class="modal-header">
            <h3 id="modal-title">Edit Todo</h3>
            <button class="modal-close">&times;</button>
          </div>
          
          <div class="modal-body">
            <form id="todo-form">
              <input type="hidden" id="todo-id" name="id" />
              
              <div class="form-group">
                <label for="todo-title">Title *</label>
                <input type="text" id="todo-title" name="title" class="form-control" required />
              </div>

              <div class="form-group">
                <label for="todo-description">Description</label>
                <textarea id="todo-description" name="description" class="form-control"></textarea>
              </div>

              <div class="form-group">
                <label for="todo-status">Status</label>
                <select id="todo-status" name="status" class="form-control">
                  ${Object.values(TODO_STATUS)
                    .map((status) => `<option value="${status}">${status}</option>`)
                    .join('')}
                </select>
              </div>

              <div class="form-group">
                <label for="todo-priority">Priority</label>
                <select id="todo-priority" name="priority" class="form-control">
                  ${Object.values(TODO_PRIORITY)
                    .map((priority) => `<option value="${priority}">${priority}</option>`)
                    .join('')}
                </select>
              </div>

              <div class="form-group">
                <label for="todo-target-date">Target Completion Date</label>
                <input type="date" id="todo-target-date" name="target_completion_date" class="form-control" />
              </div>

              <div class="form-group">
                <label for="todo-link">Link</label>
                <input type="url" id="todo-link" name="link" class="form-control" placeholder="https://..." />
              </div>

              <div class="form-group">
                <label for="todo-user">User</label>
                <input type="text" id="todo-user" name="user" class="form-control" />
              </div>

              <div class="form-group">
                <label>Projects</label>
                <div class="checkbox-group" id="todo-projects">
                  ${projects
                    .map(
                      (project) => `
                    <div class="checkbox-item">
                      <input type="checkbox" id="project-${project.id}" name="projects" value="${project.id}" />
                      <label for="project-${project.id}">${project.name}</label>
                    </div>
                  `
                    )
                    .join('')}
                </div>
              </div>

              <div class="form-group">
                <div class="checkbox-item">
                  <input type="checkbox" id="todo-completed" name="isCompleted" />
                  <label for="todo-completed">Completed</label>
                </div>
              </div>
            </form>
          </div>

          <div class="modal-footer">
            <div class="footer-left">
              <button type="button" class="btn btn-danger btn-delete">Delete</button>
            </div>
            <div class="footer-right">
              <button type="button" class="btn btn-secondary btn-cancel">Cancel</button>
              <button type="submit" class="btn btn-primary" form="todo-form">Save</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('todo-modal-component', TodoModalComponent);

export default TodoModalComponent;
