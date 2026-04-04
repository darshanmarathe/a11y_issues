import { navigate, router } from '../utils/router.js';

class SidebarComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
    
    router.subscribe(() => {
      this.updateActiveLink();
    });
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 260px;
          background: var(--sidebar-bg);
          color: white;
          height: 100vh;
          position: fixed;
          left: 0;
          top: 0;
          overflow-y: auto;
          z-index: 100;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }

        .sidebar-header {
          padding: 24px 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .sidebar-header h1 {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .sidebar-header p {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.5);
          margin: 4px 0 0;
        }

        .sidebar-nav {
          padding: 20px 0;
        }

        .nav-section {
          margin-bottom: 24px;
        }

        .nav-section-title {
          padding: 0 20px 8px;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: rgba(255, 255, 255, 0.4);
        }

        .nav-item {
          display: flex;
          align-items: center;
          padding: 12px 20px;
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          transition: all 0.2s;
          cursor: pointer;
          border-left: 3px solid transparent;
        }

        .nav-item:hover {
          background: rgba(255, 255, 255, 0.05);
          color: white;
        }

        .nav-item.active {
          background: rgba(59, 130, 246, 0.15);
          color: white;
          border-left-color: #3b82f6;
        }

        .nav-item svg {
          margin-right: 12px;
          width: 20px;
          height: 20px;
          flex-shrink: 0;
        }

        .nav-item span {
          font-size: 0.9rem;
          font-weight: 500;
        }

        .sidebar-footer {
          padding: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          margin-top: auto;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .user-details {
          flex: 1;
        }

        .user-name {
          font-size: 0.85rem;
          font-weight: 600;
        }

        .user-role {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.5);
        }
      </style>

      <div class="sidebar-header">
        <div>📋 TodoApp</div>
        <p>Kanban Board</p>
      </div>

      <div class="sidebar-nav">
        <div class="nav-section">
          <div class="nav-section-title">Main</div>
          <div class="nav-item" data-route="/" href="/">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Dashboard</span>
          </div>
          <div class="nav-item" data-route="/todos" href="/todos">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <span>All Todos</span>
          </div>
        </div>

        <div class="nav-section">
          <div class="nav-section-title">Management</div>
          <div class="nav-item" data-route="/projects" href="/projects">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            <span>Projects</span>
          </div>
        </div>
      </div>

      <div class="sidebar-footer">
        <div class="user-info">
          <div class="user-avatar">A</div>
          <div class="user-details">
            <div class="user-name">Admin</div>
            <div class="user-role">Administrator</div>
          </div>
        </div>
      </div>
    `;
  }

  setupEventListeners() {
    const navItems = this.shadowRoot.querySelectorAll('.nav-item');
    navItems.forEach((item) => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const route = item.getAttribute('data-route');
        navigate(route);
      });
    });
  }

  updateActiveLink() {
    const currentPath = window.location.pathname;
    const navItems = this.shadowRoot.querySelectorAll('.nav-item');
    navItems.forEach((item) => {
      const route = item.getAttribute('data-route');
      if (route === currentPath) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }
}

customElements.define('sidebar-component', SidebarComponent);

export default SidebarComponent;
