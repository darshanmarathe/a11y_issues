<template>
  <div class="todos-page">
    <div class="todos-header">
      <h1>All Todos</h1>
      <div class="filters">
        <select v-model="filterStatus" class="filter-select">
          <option value="">All Status</option>
          <option value="Backlog">Backlog</option>
          <option value="Linedup">Lined Up</option>
          <option value="Wip">In Progress</option>
          <option value="Done">Done</option>
          <option value="Stuck">Stuck</option>
        </select>
        
        <select v-model="filterPriority" class="filter-select">
          <option value="">All Priorities</option>
          <option value="Urgent">Urgent</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        
        <select v-model="filterProject" class="filter-select">
          <option value="">All Projects</option>
          <option 
            v-for="project in projects" 
            :key="project.id" 
            :value="project.id"
          >
            {{ project.name }}
          </option>
        </select>
      </div>
      <button class="add-btn" @click="showAddDialog = true">
        <span>+</span> Add Todo
      </button>
    </div>
    
    <div class="todos-table-container">
      <table class="todos-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Project</th>
            <th>User</th>
            <th>Target Date</th>
            <th>Completed</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="todo in filteredTodos" :key="todo.id" class="todo-row">
            <td class="title-cell">
              <div class="title">{{ todo.title }}</div>
              <div class="description">{{ todo.description }}</div>
            </td>
            <td>
              <span class="status-badge" :class="todo.status.toLowerCase()">
                {{ todo.status }}
              </span>
            </td>
            <td>
              <span class="priority-badge" :class="todo.priority.toLowerCase()">
                {{ todo.priority }}
              </span>
            </td>
            <td>
              <span class="project-tag" v-if="getProjectName(todo.projectId)">
                {{ getProjectName(todo.projectId) }}
              </span>
              <span v-else class="no-project">-</span>
            </td>
            <td>{{ todo.user }}</td>
            <td>{{ formatDate(todo.target_completion_date) }}</td>
            <td>
              <input 
                type="checkbox" 
                :checked="todo.isCompleted"
                @change="toggleComplete(todo)"
              />
            </td>
            <td class="actions-cell">
              <button class="action-btn edit" @click="editTodo(todo)" title="Edit">✏️</button>
              <button class="action-btn delete" @click="deleteTodo(todo.id)" title="Delete">🗑️</button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div v-if="filteredTodos.length === 0" class="empty-state">
        <p>No todos found matching the selected filters.</p>
      </div>
    </div>
    
    <!-- Add/Edit Dialog -->
    <div v-if="showAddDialog || showEditDialog" class="dialog-overlay" @click="closeDialogs">
      <div class="dialog" @click.stop>
        <h2>{{ editingTodo ? 'Edit Todo' : 'Add New Todo' }}</h2>
        
        <form @submit.prevent="editingTodo ? updateTodoFn() : addTodoFn()">
          <div class="form-group">
            <label for="title">Title *</label>
            <input 
              id="title"
              v-model="formData.title" 
              type="text" 
              required 
              placeholder="Enter todo title"
            />
          </div>
          
          <div class="form-group">
            <label for="description">Description</label>
            <textarea 
              id="description"
              v-model="formData.description" 
              placeholder="Enter description"
              rows="3"
            ></textarea>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="status">Status</label>
              <select id="status" v-model="formData.status">
                <option value="Backlog">Backlog</option>
                <option value="Linedup">Lined Up</option>
                <option value="Wip">In Progress</option>
                <option value="Done">Done</option>
                <option value="Stuck">Stuck</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="priority">Priority</label>
              <select id="priority" v-model="formData.priority">
                <option value="Urgent">Urgent</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="project">Project</label>
              <select id="project" v-model="formData.projectId">
                <option :value="null">No Project</option>
                <option 
                  v-for="project in projects" 
                  :key="project.id" 
                  :value="project.id"
                >
                  {{ project.name }}
                </option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="user">User</label>
              <input 
                id="user"
                v-model="formData.user" 
                type="text" 
                placeholder="Assignee"
              />
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="targetDate">Target Completion</label>
              <input 
                id="targetDate"
                v-model="formData.target_completion_date" 
                type="date"
              />
            </div>
            
            <div class="form-group">
              <label for="link">Link</label>
              <input 
                id="link"
                v-model="formData.link" 
                type="url" 
                placeholder="https://..."
              />
            </div>
          </div>
          
          <div class="form-group checkbox-group">
            <label>
              <input 
                type="checkbox" 
                v-model="formData.isCompleted"
              />
              Completed
            </label>
          </div>
          
          <div class="dialog-actions">
            <button type="button" class="btn-cancel" @click="closeDialogs">
              Cancel
            </button>
            <button type="submit" class="btn-submit">
              {{ editingTodo ? 'Update' : 'Add' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';

export default {
  name: 'Todos',
  data() {
    return {
      showAddDialog: false,
      showEditDialog: false,
      editingTodo: null,
      filterStatus: '',
      filterPriority: '',
      filterProject: '',
      formData: {
        title: '',
        description: '',
        status: 'Backlog',
        priority: 'Medium',
        projectId: null,
        user: '',
        target_completion_date: null,
        link: '',
        isCompleted: false
      }
    };
  },
  
  computed: {
    ...mapState(['todos', 'projects']),
    ...mapGetters(['getProjectById']),
    
    filteredTodos() {
      let filtered = this.todos;
      
      if (this.filterStatus) {
        filtered = filtered.filter(t => t.status === this.filterStatus);
      }
      
      if (this.filterPriority) {
        filtered = filtered.filter(t => t.priority === this.filterPriority);
      }
      
      if (this.filterProject) {
        filtered = filtered.filter(t => t.projectId === this.filterProject);
      }
      
      return filtered;
    }
  },
  
  methods: {
    ...mapActions(['fetchTodos', 'fetchProjects', 'addTodo', 'updateTodo', 'deleteTodo']),
    
    getProjectName(projectId) {
      const project = this.getProjectById(projectId);
      return project ? project.name : '';
    },
    
    formatDate(dateStr) {
      if (!dateStr) return 'Not set';
      const date = new Date(dateStr);
      return date.toLocaleDateString();
    },
    
    toggleComplete(todo) {
      const updatedTodo = { ...todo, isCompleted: !todo.isCompleted };
      if (updatedTodo.isCompleted) {
        updatedTodo.completionDate = new Date().toISOString();
      } else {
        updatedTodo.completionDate = null;
      }
      this.updateTodo(updatedTodo);
    },
    
    editTodo(todo) {
      this.editingTodo = todo;
      this.formData = { ...todo };
      this.showEditDialog = true;
    },
    
    closeDialogs() {
      this.showAddDialog = false;
      this.showEditDialog = false;
      this.editingTodo = null;
      this.resetForm();
    },
    
    resetForm() {
      this.formData = {
        title: '',
        description: '',
        status: 'Backlog',
        priority: 'Medium',
        projectId: null,
        user: '',
        target_completion_date: null,
        link: '',
        isCompleted: false
      };
    },
    
    async addTodoFn() {
      try {
        await this.addTodo(this.formData);
        this.closeDialogs();
      } catch (error) {
        console.error('Error adding todo:', error);
      }
    },
    
    async updateTodoFn() {
      try {
        if (this.editingTodo) {
          this.formData.completionDate = this.formData.isCompleted 
            ? new Date().toISOString() 
            : null;
          await this.updateTodo(this.formData);
          this.closeDialogs();
        }
      } catch (error) {
        console.error('Error updating todo:', error);
      }
    },
    
    async deleteTodoFn(todoId) {
      if (confirm('Are you sure you want to delete this todo?')) {
        try {
          await this.deleteTodo(todoId);
        } catch (error) {
          console.error('Error deleting todo:', error);
        }
      }
    }
  },
  
  mounted() {
    this.fetchTodos();
    this.fetchProjects();
  }
}
</script>

<style scoped>
.todos-page {
  padding: 20px;
  width: 100%;
}

.todos-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 16px;
}

.todos-header h1 {
  margin: 0;
  color: #2c3e50;
}

.filters {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.filter-select {
  padding: 8px 12px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: border-color 0.2s;
}

.filter-select:focus {
  outline: none;
  border-color: #667eea;
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

.todos-table-container {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.todos-table {
  width: 100%;
  border-collapse: collapse;
}

.todos-table thead {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.todos-table th {
  padding: 16px;
  text-align: left;
  font-weight: 600;
  font-size: 14px;
}

.todo-row {
  border-bottom: 1px solid #e0e0e0;
  transition: background 0.2s;
}

.todo-row:hover {
  background: #f5f5f5;
}

.todos-table td {
  padding: 16px;
  vertical-align: top;
}

.title-cell {
  max-width: 300px;
}

.title {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 4px;
}

.description {
  color: #7f8c8d;
  font-size: 13px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.status-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  display: inline-block;
}

.status-badge.backlog {
  background: #e0e0e0;
  color: #616161;
}

.status-badge.linedup {
  background: #e3f2fd;
  color: #1976d2;
}

.status-badge.wip {
  background: #fff3e0;
  color: #f57c00;
}

.status-badge.done {
  background: #e8f5e9;
  color: #388e3c;
}

.status-badge.stuck {
  background: #ffebee;
  color: #d32f2f;
}

.priority-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  display: inline-block;
}

.priority-badge.urgent {
  background: #d32f2f;
  color: white;
}

.priority-badge.high {
  background: #f57c00;
  color: white;
}

.priority-badge.medium {
  background: #1976d2;
  color: white;
}

.priority-badge.low {
  background: #616161;
  color: white;
}

.project-tag {
  background: #e3f2fd;
  color: #1976d2;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
}

.no-project {
  color: #95a5a6;
}

.complete-checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.actions-cell {
  display: flex;
  gap: 8px;
}

.action-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  padding: 4px;
  transition: transform 0.2s;
}

.action-btn:hover {
  transform: scale(1.2);
}

.action-btn.delete:hover {
  filter: hue-rotate(-30deg);
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
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
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

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
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
