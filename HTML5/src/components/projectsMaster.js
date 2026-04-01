import { createProject } from '../models/todo.js';

/**
 * Projects Master Management Component - Custom modal with intentional a11y issues
 */
export class ProjectsMaster {
  constructor(containerId, options = {}) {
    this.containerId = containerId;
    this.options = options;
    this.onProjectSaved = options.onProjectSaved || (() => {});
    this.onProjectDeleted = options.onProjectDeleted || (() => {});
    this.currentProject = null;
    this.projects = [];
  }

  setProjects(projects) {
    this.projects = projects;
  }

  show() {
    // ISSUE: Table without proper caption or summary
    // ISSUE: Action buttons without descriptive labels
    const modalHtml = `
      <div class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" id="projects-modal-overlay">
        <div class="bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div class="p-6">
            <div class="flex justify-between items-center mb-4">
              <!-- ISSUE: Using div instead of h2 -->
              <div class="text-xl font-bold text-white">Projects Master</div>
              <!-- ISSUE: Button with only X symbol, no accessible name -->
              <button id="btn-close-projects" class="text-gray-400 hover:text-white text-2xl">×</button>
            </div>
            
            <button id="btn-add-project" class="mb-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors">
              + Add Project
            </button>
            
            <div class="overflow-x-auto">
              <!-- ISSUE: Table without proper scope on th elements -->
              <table class="w-full text-left text-white">
                <thead class="bg-gray-700">
                  <tr>
                    <th class="p-3">Name</th>
                    <th class="p-3">Description</th>
                    <th class="p-3">Created On</th>
                    <th class="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${this.projects.map(p => `
                    <tr class="border-b border-gray-700 hover:bg-gray-700">
                      <td class="p-3">${p.name}</td>
                      <td class="p-3 max-w-xs truncate">${p.description || 'No description'}</td>
                      <td class="p-3">${new Date(p.createdAt).toLocaleDateString()}</td>
                      <td class="p-3">
                        <!-- ISSUE: Buttons without unique accessible names -->
                        <button class="edit-project px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-sm mr-2" data-id="${p.id}">Edit</button>
                        <button class="delete-project px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-sm" data-id="${p.id}">Delete</button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
              ${this.projects.length === 0 ? '<p class="text-gray-400 text-center py-8">No projects yet. Click "Add Project" to create one.</p>' : ''}
            </div>
          </div>
        </div>
      </div>
    `;

    let modalContainer = document.getElementById('projects-master-modal');
    if (!modalContainer) {
      modalContainer = document.createElement('div');
      modalContainer.id = 'projects-master-modal';
      document.body.appendChild(modalContainer);
    }
    modalContainer.innerHTML = modalHtml;

    modalContainer.classList.remove('hidden');

    document.getElementById('btn-close-projects')?.addEventListener('click', () => {
      this.hide();
    });

    document.getElementById('projects-modal-overlay')?.addEventListener('click', (e) => {
      if (e.target === e.currentTarget) {
        this.hide();
      }
    });

    document.getElementById('btn-add-project')?.addEventListener('click', () => {
      this.openProjectForm();
    });

    document.querySelectorAll('.edit-project').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        const project = this.projects.find(p => p.id === id);
        if (project) {
          this.openProjectForm(project);
        }
      });
    });

    document.querySelectorAll('.delete-project').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        if (confirm('Are you sure you want to delete this project? This may affect associated todos.')) {
          this.onProjectDeleted(id);
        }
      });
    });
  }

  hide() {
    const modalContainer = document.getElementById('projects-master-modal');
    if (modalContainer) {
      modalContainer.classList.add('hidden');
      modalContainer.innerHTML = '';
    }
  }

  openProjectForm(project = null) {
    const isEdit = !!project;
    const title = isEdit ? 'Edit Project' : 'New Project';
    
    // ISSUE: Same modal a11y issues as TodoForm
    const formHtml = `
      <div class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" id="project-form-overlay">
        <div class="bg-gray-800 rounded-lg w-full max-w-md">
          <div class="p-6">
            <h3 class="text-xl font-bold text-white mb-4">${title}</h3>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-1">Project Name *</label>
                <input id="project-name" type="text" class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  value="${project?.name || ''}" placeholder="Enter project name" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-300 mb-1">Description</label>
                <textarea id="project-description" rows="4" class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  placeholder="Enter project description">${project?.description || ''}</textarea>
              </div>
            </div>

            <div class="flex justify-end gap-3 mt-6">
              <button id="btn-cancel-project" class="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded transition-colors">Cancel</button>
              <button id="btn-save-project" class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors">Save</button>
            </div>
          </div>
        </div>
      </div>
    `;

    let formContainer = document.getElementById('project-form-container');
    if (!formContainer) {
      formContainer = document.createElement('div');
      formContainer.id = 'project-form-container';
      document.body.appendChild(formContainer);
    }
    formContainer.innerHTML = formHtml;

    document.getElementById('btn-cancel-project')?.addEventListener('click', () => {
      this.closeProjectForm();
    });

    document.getElementById('project-form-overlay')?.addEventListener('click', (e) => {
      if (e.target === e.currentTarget) {
        this.closeProjectForm();
      }
    });

    document.getElementById('btn-save-project')?.addEventListener('click', () => {
      const name = document.getElementById('project-name')?.value || '';
      const description = document.getElementById('project-description')?.value || '';

      // ISSUE: Error in alert, not accessible
      if (!name.trim()) {
        alert('Project name is required');
        return;
      }

      const projectData = createProject({
        id: project?.id,
        name,
        description,
        createdAt: project?.createdAt
      });

      this.onProjectSaved(projectData);
      this.closeProjectForm();
      
      setTimeout(() => this.show(), 100);
    });
  }

  closeProjectForm() {
    const formContainer = document.getElementById('project-form-container');
    if (formContainer) {
      formContainer.classList.add('hidden');
      formContainer.innerHTML = '';
    }
  }
}
