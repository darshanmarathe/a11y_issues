<template>
  <div class="projects">
    <div class="projects-header">
      <h1>Projects</h1>
      <button class="add-btn" @click="showAddDialog = true">
        <span>+</span> Add Project
      </button>
    </div>
    
    <div class="projects-grid">
      <div v-for="project in projects" :key="project.id" class="project-card">
        <div class="project-header">
          <h3>{{ project.name }}</h3>
          <div class="project-actions">
            <button class="icon-btn" @click="editProject(project)" title="Edit">✏️</button>
            <button class="icon-btn delete" @click="deleteProject(project.id)" title="Delete">🗑️</button>
          </div>
        </div>
        
        <p class="project-description">{{ project.description }}</p>
        
        <div class="project-meta">
          <span class="status-badge" :class="project.status.toLowerCase()">
            {{ project.status }}
          </span>
          <span class="created-date">
            Created: {{ formatDate(project.createdDate) }}
          </span>
        </div>
        
        <div class="project-stats">
          <div class="stat">
            <span class="stat-label">Total Todos:</span>
            <span class="stat-value">{{ getProjectTodoCount(project.id) }}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Completed:</span>
            <span class="stat-value">{{ getCompletedProjectTodoCount(project.id) }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="projects.length === 0" class="empty-state">
      <p>No projects yet. Create your first project to get started!</p>
    </div>
    
    <!-- Add/Edit Dialog -->
    <div v-if="showAddDialog || showEditDialog" class="dialog-overlay" @click="closeDialogs">
      <div class="dialog" @click.stop>
        <h2>{{ editingProject ? 'Edit Project' : 'Add New Project' }}</h2>
        
        <form @submit.prevent="editingProject ? updateProject() : addProject()">
          <div class="form-group">
            <label for="name">Project Name *</label>
            <input 
              id="name"
              v-model="formData.name" 
              type="text" 
              required 
              placeholder="Enter project name"
            />
          </div>
          
          <div class="form-group">
            <label for="description">Description</label>
            <textarea 
              id="description"
              v-model="formData.description" 
              placeholder="Enter project description"
              rows="4"
            ></textarea>
          </div>
          
          <div class="form-group">
            <label for="status">Status</label>
            <select id="status" v-model="formData.status">
              <option value="Active">Active</option>
              <option value="On Hold">On Hold</option>
              <option value="Completed">Completed</option>
              <option value="Archived">Archived</option>
            </select>
          </div>
          
          <div class="dialog-actions">
            <button type="button" class="btn-cancel" @click="closeDialogs">
              Cancel
            </button>
            <button type="submit" class="btn-submit">
              {{ editingProject ? 'Update' : 'Create' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'Projects',
  data() {
    return {
      showAddDialog: false,
      showEditDialog: false,
      editingProject: null,
      formData: {
        name: '',
        description: '',
        status: 'Active',
        createdDate: new Date().toISOString().split('T')[0]
      }
    };
  },
  
  computed: {
    ...mapState(['projects', 'todos'])
  },
  
  methods: {
    ...mapActions(['fetchProjects', 'addProject', 'updateProject', 'deleteProject']),
    
    formatDate(dateStr) {
      const date = new Date(dateStr);
      return date.toLocaleDateString();
    },
    
    getProjectTodoCount(projectId) {
      return this.todos.filter(t => t.projectId === projectId).length;
    },
    
    getCompletedProjectTodoCount(projectId) {
      return this.todos.filter(t => t.projectId === projectId && t.isCompleted).length;
    },
    
    editProject(project) {
      this.editing_project = project;
      this.formData = { ...project };
      this.showEditDialog = true;
    },
    
    closeDialogs() {
      this.showAddDialog = false;
      this.showEditDialog = false;
      this.editing_project = null;
      this.resetForm();
    },
    
    resetForm() {
      this.formData = {
        name: '',
        description: '',
        status: 'Active',
        createdDate: new Date().toISOString().split('T')[0]
      };
    },
    
    async addProject() {
      try {
        await this.$store.dispatch('addProject', this.formData);
        this.closeDialogs();
      } catch (error) {
        console.error('Error adding project:', error);
      }
    },

    async updateProjectFn() {
      try {
        if (this.editing_project) {
          await this.$store.dispatch('updateProject', this.formData);
          this.closeDialogs();
        }
      } catch (error) {
        console.error('Error updating project:', error);
      }
    }
  },
  
  mounted() {
    this.fetchProjects();
  }
}
</script>

<style scoped>
.projects {
  padding: 20px;
  width: 100%;
}

.projects-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.projects-header h1 {
  margin: 0;
  color: #2c3e50;
}

.add-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
}

.project-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.project-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.project-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 20px;
  flex: 1;
}

.project-actions {
  display: flex;
  gap: 8px;
}

.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  padding: 4px;
  transition: transform 0.2s;
}

.icon-btn:hover {
  transform: scale(1.2);
}

.icon-btn.delete:hover {
  filter: hue-rotate(-30deg);
}

.project-description {
  color: #7f8c8d;
  line-height: 1.5;
  margin-bottom: 16px;
}

.project-meta {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.active {
  background: #d4edda;
  color: #155724;
}

.status-badge.on-hold {
  background: #fff3cd;
  color: #856404;
}

.status-badge.completed {
  background: #d1ecf1;
  color: #0c5460;
}

.status-badge.archived {
  background: #e2e3e5;
  color: #383d41;
}

.created-date {
  color: #95a5a6;
  font-size: 12px;
  display: flex;
  align-items: center;
}

.project-stats {
  display: flex;
  gap: 24px;
  padding-top: 16px;
  border-top: 1px solid #e0e0e0;
}

.stat {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 12px;
  color: #95a5a6;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #2c3e50;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #95a5a6;
}

.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.dialog {
  background: white;
  padding: 32px;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
}

.dialog h2 {
  margin-top: 0;
  color: #2c3e50;
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  color: #2c3e50;
  font-weight: 500;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px 12px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
}

.dialog-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
}

.btn-cancel,
.btn-submit {
  padding: 10px 24px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  border: none;
  transition: transform 0.2s;
}

.btn-cancel {
  background: #95a5a6;
  color: white;
}

.btn-submit {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-cancel:hover,
.btn-submit:hover {
  transform: translateY(-2px);
}
</style>
