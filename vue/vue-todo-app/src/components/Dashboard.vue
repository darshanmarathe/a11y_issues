<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h1>Dashboard</h1>
      <button class="add-todo-btn" @click="showAddDialog = true">
        <span>+</span> Add Todo
      </button>
    </div>
    
    <div class="stats">
      <div class="stat-card">
        <div class="stat-number">{{ totalTodos }}</div>
        <div class="stat-label">Total Todos</div>
      </div>
      <div class="stat-card completed">
        <div class="stat-number">{{ completedTodos }}</div>
        <div class="stat-label">Completed</div>
      </div>
      <div class="stat-card pending">
        <div class="stat-number">{{ pendingTodos }}</div>
        <div class="stat-label">Pending</div>
      </div>
      <div class="stat-card urgent">
        <div class="stat-number">{{ urgentTodos }}</div>
        <div class="stat-label">Urgent</div>
      </div>
    </div>
    
    <div class="kanban-container">
      <h2>Kanban Board</h2>
      <div class="kanban-board">
        <div 
          v-for="status in statuses" 
          :key="status" 
          class="kanban-column"
          :class="status.toLowerCase()"
          @drop="drop($event, status)"
          @dragover="dragOver($event)"
          @dragenter="dragEnter($event)"
          @dragleave="dragLeave($event)"
        >
          <div class="column-header">
            <h3>{{ status }}</h3>
            <span class="count">{{ getTodosByStatus(status).length }}</span>
          </div>
          
          <div class="column-content">
            <div 
              v-for="todo in getTodosByStatus(status)" 
              :key="todo.id"
              class="todo-card"
              :class="{ completed: todo.isCompleted, dragging: draggedTodo && draggedTodo.id === todo.id }"
              draggable="true"
              @dragstart="dragStart($event, todo)"
              @dragend="dragEnd($event)"
              @click="editTodo(todo)"
            >
              <div class="drag-handle" title="Drag to move">⋮⋮</div>
              <div class="todo-header">
                <h4 class="todo-title">{{ todo.title }}</h4>
                <span 
                  class="priority-badge" 
                  :class="todo.priority.toLowerCase()"
                >
                  {{ todo.priority }}
                </span>
              </div>
              
              <p class="todo-description">{{ todo.description }}</p>
              
              <div class="todo-meta">
                <span class="project-tag" v-if="getProjectName(todo.projectId)">
                  {{ getProjectName(todo.projectId) }}
                </span>
                <span class="user-tag">👤 {{ todo.user }}</span>
              </div>
              
              <div class="todo-dates">
                <span class="target-date">
                  Target: {{ formatDate(todo.target_completion_date) }}
                </span>
              </div>
            </div>
            
            <div v-if="getTodosByStatus(status).length === 0" class="empty-column">
              No todos
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Add/Edit Dialog -->
    <div v-if="showAddDialog || showEditDialog" class="dialog-overlay" @click="closeDialogs">
      <div class="dialog" @click.stop>
        <h2>{{ editingTodo ? 'Edit Todo' : 'Add New Todo' }}</h2>
        
        <form @submit.prevent="editingTodo ? updateTodo() : addTodo()">
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
import { mapGetters, mapState, mapActions } from 'vuex';

export default {
  name: 'Dashboard',
  data() {
    return {
      showAddDialog: false,
      showEditDialog: false,
      editingTodo: null,
      draggedTodo: null,
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
      },
      statuses: ['Backlog', 'Linedup', 'Wip', 'Done', 'Stuck']
    };
  },
  
  computed: {
    ...mapState(['todos', 'projects']),
    ...mapGetters(['getTodosByStatus', 'getProjectById', 'getCompletedTodos', 'getPendingTodos']),
    
    totalTodos() {
      return this.todos.length;
    },
    
    completedTodos() {
      return this.getCompletedTodos.length;
    },
    
    pendingTodos() {
      return this.getPendingTodos.length;
    },
    
    urgentTodos() {
      return this.todos.filter(t => t.priority === 'Urgent').length;
    }
  },
  
  methods: {
    ...mapActions(['fetchTodos', 'fetchProjects', 'addTodo', 'updateTodo']),
    
    // Drag and Drop methods
    dragStart(event, todo) {
      this.draggedTodo = todo;
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', todo.id);
      event.target.classList.add('dragging');
    },
    
    dragEnd(event) {
      event.target.classList.remove('dragging');
      this.draggedTodo = null;
      
      // Remove all drag-over classes
      document.querySelectorAll('.kanban-column').forEach(column => {
        column.classList.remove('drag-over');
      });
    },
    
    dragOver(event) {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
    },
    
    dragEnter(event) {
      event.preventDefault();
      const column = event.currentTarget;
      column.classList.add('drag-over');
    },
    
    dragLeave(event) {
      // Only remove if we're actually leaving the column
      const column = event.currentTarget;
      const relatedTarget = event.relatedTarget;
      
      if (!column.contains(relatedTarget)) {
        column.classList.remove('drag-over');
      }
    },
    
    async drop(event, newStatus) {
      event.preventDefault();
      const column = event.currentTarget;
      column.classList.remove('drag-over');
      
      if (this.draggedTodo && this.draggedTodo.status !== newStatus) {
        try {
          const updatedTodo = {
            ...this.draggedTodo,
            status: newStatus,
            isCompleted: newStatus === 'Done' ? true : this.draggedTodo.isCompleted,
            completionDate: newStatus === 'Done' ? new Date().toISOString() : this.draggedTodo.completionDate
          };
          await this.$store.dispatch('updateTodo', updatedTodo);
        } catch (error) {
          console.error('Error updating todo status:', error);
        }
      }
      
      this.draggedTodo = null;
    },
    
    getProjectName(projectId) {
      const project = this.getProjectById(projectId);
      return project ? project.name : '';
    },
    
    formatDate(dateStr) {
      if (!dateStr) return 'Not set';
      const date = new Date(dateStr);
      return date.toLocaleDateString();
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
    
    async addTodo() {
      try {
        await this.$store.dispatch('addTodo', this.formData);
        this.closeDialogs();
      } catch (error) {
        console.error('Error adding todo:', error);
      }
    },

    async updateTodo() {
      try {
        if (this.editingTodo) {
          this.formData.completionDate = this.formData.isCompleted
            ? new Date().toISOString()
            : null;
          await this.$store.dispatch('updateTodo', this.formData);
          this.closeDialogs();
        }
      } catch (error) {
        console.error('Error updating todo:', error);
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
.dashboard {
  padding: 20px;
  width: 100%;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.dashboard-header h1 {
  margin: 0;
  color: #2c3e50;
}

.add-todo-btn {
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

.add-todo-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-4px);
}

.stat-card.completed {
  background: linear-gradient(135deg, #56ab2f 0%, #a8e063 100%);
  color: white;
}

.stat-card.pending {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.stat-card.urgent {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  color: white;
}

.stat-number {
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  opacity: 0.9;
}

.kanban-container {
  margin-top: 40px;
}

.kanban-container h2 {
  color: #2c3e50;
  margin-bottom: 20px;
}

.kanban-board {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
}

.kanban-column {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 16px;
  min-height: 400px;
  transition: background 0.2s, box-shadow 0.2s;
}

.kanban-column.drag-over {
  background: #e3f2fd;
  box-shadow: inset 0 0 0 2px #667eea;
}

.kanban-column.backlog {
  border-top: 4px solid #95a5a6;
}

.kanban-column.linedup {
  border-top: 4px solid #3498db;
}

.kanban-column.wip {
  border-top: 4px solid #f39c12;
}

.kanban-column.done {
  border-top: 4px solid #27ae60;
}

.kanban-column.stuck {
  border-top: 4px solid #e74c3c;
}

.column-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid #e0e0e0;
}

.column-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 18px;
}

.count {
  background: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
}

.column-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.todo-card {
  background: white;
  padding: 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
  border-left: 4px solid #667eea;
  position: relative;
}

.todo-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.todo-card.completed {
  opacity: 0.7;
  border-left-color: #27ae60;
}

.todo-card.dragging {
  opacity: 0.5;
  transform: rotate(5deg);
  cursor: grabbing;
}

.drag-handle {
  position: absolute;
  top: 8px;
  right: 8px;
  color: #b0bec5;
  font-size: 14px;
  cursor: grab;
  user-select: none;
  padding: 2px 6px;
  transition: color 0.2s;
}

.drag-handle:hover {
  color: #667eea;
}

.todo-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.todo-title {
  margin: 0;
  font-size: 16px;
  color: #2c3e50;
  flex: 1;
}

.priority-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  margin-left: 8px;
}

.priority-badge.urgent {
  background: #e74c3c;
  color: white;
}

.priority-badge.high {
  background: #f39c12;
  color: white;
}

.priority-badge.medium {
  background: #3498db;
  color: white;
}

.priority-badge.low {
  background: #95a5a6;
  color: white;
}

.todo-description {
  margin: 8px 0;
  color: #7f8c8d;
  font-size: 14px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.todo-meta {
  display: flex;
  gap: 8px;
  margin-top: 12px;
  flex-wrap: wrap;
}

.project-tag {
  background: #e3f2fd;
  color: #1976d2;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
}

.user-tag {
  background: #f3e5f5;
  color: #7b1fa2;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
}

.todo-dates {
  margin-top: 8px;
  font-size: 12px;
  color: #95a5a6;
}

.empty-column {
  text-align: center;
  color: #95a5a6;
  padding: 40px 20px;
  font-style: italic;
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
