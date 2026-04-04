<template>
  <aside class="sidebar" :class="{ 'sidebar-open': isOpen, 'sidebar-closed': !isOpen }">
    <div class="sidebar-header">
      <h2 class="sidebar-title" v-show="isOpen">Todo App</h2>
      <button class="toggle-btn" @click="$emit('toggle')">
        <span v-if="isOpen">◀</span>
        <span v-else>▶</span>
      </button>
    </div>
    
    <nav class="sidebar-nav">
      <router-link 
        to="/" 
        class="nav-item"
        :class="{ 'nav-item-collapsed': !isOpen }"
        active-class="active"
      >
        <span class="nav-icon">📊</span>
        <span class="nav-text" v-show="isOpen">Dashboard</span>
      </router-link>
      
      <router-link 
        to="/todos" 
        class="nav-item"
        :class="{ 'nav-item-collapsed': !isOpen }"
        active-class="active"
      >
        <span class="nav-icon">✓</span>
        <span class="nav-text" v-show="isOpen">All Todos</span>
      </router-link>
      
      <router-link 
        to="/projects" 
        class="nav-item"
        :class="{ 'nav-item-collapsed': !isOpen }"
        active-class="active"
      >
        <span class="nav-icon">📁</span>
        <span class="nav-text" v-show="isOpen">Projects</span>
      </router-link>
    </nav>
    
    <div class="sidebar-footer" v-show="isOpen">
      <p class="footer-text">© 2026 Todo App</p>
    </div>
  </aside>
</template>

<script>
export default {
  name: 'Sidebar',
  props: {
    isOpen: {
      type: Boolean,
      default: true
    }
  },
  emits: ['toggle']
}
</script>

<style scoped>
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  background: linear-gradient(180deg, #2c3e50 0%, #34495e 100%);
  color: white;
  transition: width 0.3s ease;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
}

.sidebar-open {
  width: 250px;
}

.sidebar-closed {
  width: 60px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-title {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
}

.toggle-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.toggle-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.sidebar-nav {
  flex: 1;
  padding: 20px 0;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.2s;
  margin: 4px 10px;
  border-radius: 6px;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.nav-item.active {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-weight: 600;
}

.nav-item-collapsed {
  justify-content: center;
  padding: 12px;
}

.nav-icon {
  font-size: 20px;
  min-width: 24px;
}

.nav-text {
  margin-left: 12px;
  white-space: nowrap;
}

.sidebar-footer {
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
}

.footer-text {
  margin: 0;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
}
</style>
