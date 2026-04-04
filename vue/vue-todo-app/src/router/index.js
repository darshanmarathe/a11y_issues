import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '../components/Dashboard.vue';
import Projects from '../components/Projects.vue';
import Todos from '../components/Todos.vue';

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/projects',
    name: 'Projects',
    component: Projects
  },
  {
    path: '/todos',
    name: 'Todos',
    component: Todos
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
