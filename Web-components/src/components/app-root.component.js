import '../components/sidebar.component.js';
import '../components/kanban-board.component.js';
import '../components/todo-modal.component.js';
import '../pages/dashboard.page.js';
import '../pages/todos.page.js';
import '../pages/projects.page.js';
import { router } from '../utils/router.js';

class AppRoot extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.setupRouter();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }

        .app-layout {
          display: flex;
          min-height: 100vh;
        }

        .main-content {
          flex: 1;
          margin-left: 260px;
          padding: 30px;
          background: #f8fafc;
          min-height: 100vh;
        }

        @media (max-width: 768px) {
          .main-content {
            margin-left: 0;
            padding: 20px;
          }
        }
      </style>

      <div class="app-layout">
        <sidebar-component></sidebar-component>
        <main class="main-content" id="main-content">
          <!-- Content will be loaded here based on route -->
        </main>
      </div>

      <todo-modal-component id="todo-modal"></todo-modal-component>
    `;
  }

  setupRouter() {
    const mainContent = this.shadowRoot.querySelector('#main-content');

    // Define routes
    router.addRoute('/', () => {
      mainContent.innerHTML = '<dashboard-page></dashboard-page>';
    });

    router.addRoute('/todos', () => {
      mainContent.innerHTML = '<todos-page></todos-page>';
    });

    router.addRoute('/projects', () => {
      mainContent.innerHTML = '<projects-page></projects-page>';
    });

    // Handle initial route
    const currentPath = window.location.pathname;
    if (router.routes[currentPath]) {
      router.navigate(currentPath);
    } else {
      router.navigate('/');
    }
  }
}

customElements.define('app-root', AppRoot);

export default AppRoot;
