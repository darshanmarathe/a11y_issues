import { store } from '../store/store.js';

class ProjectsPage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.editingProject = null;
  }

  async connectedCallback() {
    await store.getState().fetchProjects();
    this.render();
    this.setupEventListeners();
  }

  render() {
    const state = store.getState();
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

        .btn-success {
          background: #22c55e;
          color: white;
        }

        .btn-danger {
          background: #ef4444;
          color: white;
        }

        .btn-secondary {
          background: #64748b;
          color: white;
        }

        .btn-sm {
          padding: 6px 12px;
          font-size: 12px;
        }

        .card {
          background: white;
          border-radius: 8px;
          box-shadow: var(--shadow);
          padding: 20px;
          margin-bottom: 20px;
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

        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .project-card {
          background: white;
          border-radius: 8px;
          box-shadow: var(--shadow);
          padding: 20px;
          transition: all 0.2s;
          border-left: 4px solid #3b82f6;
        }

        .project-card:hover {
          box-shadow: var(--shadow-lg);
          transform: translateY(-2px);
        }

        .project-card.inactive {
          opacity: 0.6;
          border-left-color: #64748b;
        }

        .project-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }

        .project-header h3 {
          font-size: 18px;
          font-weight: 600;
          margin: 0;
          color: #0f172a;
        }

        .status-badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .status-active {
          background: #dcfce7;
          color: #16a34a;
        }

        .status-inactive {
          background: #f1f5f9;
          color: #64748b;
        }

        .project-description {
          color: #64748b;
          font-size: 14px;
          margin: 0 0 16px 0;
        }

        .project-actions {
          display: flex;
          gap: 8px;
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
        }

        .modal-overlay.active {
          display: flex;
        }

        .modal {
          background: white;
          border-radius: 8px;
          width: 90%;
          max-width: 500px;
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

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          padding: 20px;
          border-top: 1px solid #e2e8f0;
        }
      </style>

      <div class="page-header">
        <div>
          <h2>Projects</h2>
          <p>Manage your projects</p>
        </div>
        <button class="btn btn-primary" id="btn-add-project">+ Add Project</button>
      </div>

      <div class="projects-grid">
        ${projects
          .map(
            (project) => `
          <div class="project-card ${!project.isActive ? 'inactive' : ''}">
            <div class="project-header">
              <h3>${project.name}</h3>
              <span class="status-badge ${project.isActive ? 'status-active' : 'status-inactive'}">
                ${project.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <p class="project-description">${project.description || 'No description'}</p>
            <div class="project-actions">
              <button class="btn btn-sm btn-secondary" data-edit="${project.id}">Edit</button>
              <button class="btn btn-sm btn-danger" data-delete="${project.id}">Delete</button>
            </div>
          </div>
        `
          )
          .join('')}
      </div>

      ${this.renderProjectModal()}
    `;
  }

  renderProjectModal() {
    const project = this.editingProject || { name: '', description: '', isActive: true };
    const modalTitle = this.editingProject ? 'Edit Project' : 'Add Project';

    return `
      <div class="modal-overlay" id="project-modal">
        <div class="modal">
          <div class="modal-header">
            <h3>${modalTitle}</h3>
            <button class="modal-close" id="modal-close">&times;</button>
          </div>
          <div class="modal-body">
            <form id="project-form">
              <input type="hidden" id="project-id" value="${this.editingProject?.id || ''}" />
              
              <div class="form-group">
                <label for="project-name">Project Name *</label>
                <input type="text" id="project-name" class="form-control" value="${project.name}" required />
              </div>

              <div class="form-group">
                <label for="project-description">Description</label>
                <textarea id="project-description" class="form-control">${project.description}</textarea>
              </div>

              <div class="form-group">
                <div class="checkbox-item">
                  <input type="checkbox" id="project-active" ${project.isActive ? 'checked' : ''} />
                  <label for="project-active">Active</label>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" id="btn-cancel">Cancel</button>
            <button class="btn btn-primary" id="btn-save" form="project-form">Save</button>
          </div>
        </div>
      </div>
    `;
  }

  setupEventListeners() {
    // Add project button
    this.shadowRoot.querySelector('#btn-add-project').addEventListener('click', () => {
      this.editingProject = null;
      this.render();
      this.setupModalListeners();
      this.openModal();
    });

    // Edit buttons
    const editButtons = this.shadowRoot.querySelectorAll('[data-edit]');
    editButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const projectId = parseInt(btn.getAttribute('data-edit'));
        const state = store.getState();
        this.editingProject = state.projects.find((p) => p.id === projectId);
        this.render();
        this.setupModalListeners();
        this.openModal();
      });
    });

    // Delete buttons
    const deleteButtons = this.shadowRoot.querySelectorAll('[data-delete]');
    deleteButtons.forEach((btn) => {
      btn.addEventListener('click', async () => {
        const projectId = parseInt(btn.getAttribute('data-delete'));
        if (confirm('Are you sure you want to delete this project?')) {
          await store.getState().deleteProject(projectId);
          await store.getState().fetchProjects();
          this.render();
          this.setupEventListeners();
        }
      });
    });
  }

  setupModalListeners() {
    const modal = this.shadowRoot.querySelector('#project-modal');
    if (!modal) return;

    this.shadowRoot.querySelector('#modal-close').addEventListener('click', () => {
      this.closeModal();
    });

    this.shadowRoot.querySelector('#btn-cancel').addEventListener('click', () => {
      this.closeModal();
    });

    this.shadowRoot.querySelector('#btn-save').addEventListener('click', async (e) => {
      e.preventDefault();
      await this.saveProject();
    });

    this.shadowRoot.querySelector('#project-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.saveProject();
    });
  }

  openModal() {
    const modal = this.shadowRoot.querySelector('#project-modal');
    if (modal) {
      modal.classList.add('active');
    }
  }

  closeModal() {
    const modal = this.shadowRoot.querySelector('#project-modal');
    if (modal) {
      modal.classList.remove('active');
    }
    this.editingProject = null;
  }

  async saveProject() {
    const name = this.shadowRoot.querySelector('#project-name').value;
    const description = this.shadowRoot.querySelector('#project-description').value;
    const isActive = this.shadowRoot.querySelector('#project-active').checked;
    const id = this.shadowRoot.querySelector('#project-id').value;

    if (!name) {
      alert('Project name is required');
      return;
    }

    const projectData = { name, description, isActive };

    try {
      if (this.editingProject && this.editingProject.id) {
        await store.getState().updateProject(this.editingProject.id, projectData);
      } else {
        await store.getState().createProject(projectData);
      }

      this.closeModal();
      await store.getState().fetchProjects();
      this.render();
      this.setupEventListeners();
    } catch (error) {
      console.error('Failed to save project:', error);
      alert('Failed to save project. Please try again.');
    }
  }
}

customElements.define('projects-page', ProjectsPage);

export default ProjectsPage;
