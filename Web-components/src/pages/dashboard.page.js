import { store } from '../store/store.js';
import '../components/pie-chart.component.js';
import '../components/bar-chart.component.js';
import '../components/donut-chart.component.js';

class DashboardPage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  async connectedCallback() {
    await Promise.all([
      store.getState().fetchTodos(),
      store.getState().fetchProjects(),
    ]);
    this.render();
    this.setupEventListeners();
  }

  getStats() {
    const state = store.getState();
    const todos = state.todos || [];

    return {
      total: todos.length,
      backlog: todos.filter((t) => t.status === 'Backlog').length,
      linedup: todos.filter((t) => t.status === 'Linedup').length,
      wip: todos.filter((t) => t.status === 'Wip').length,
      done: todos.filter((t) => t.status === 'Done').length,
      stuck: todos.filter((t) => t.status === 'Stuck').length,
      urgent: todos.filter((t) => t.priority === 'Urgent').length,
      high: todos.filter((t) => t.priority === 'High').length,
      medium: todos.filter((t) => t.priority === 'Medium').length,
      low: todos.filter((t) => t.priority === 'Low').length,
      activeProjects: (state.projects || []).filter((p) => p.isActive).length,
    };
  }

  getChartData() {
    const stats = this.getStats();

    const statusColors = {
      'Backlog': '#64748b',
      'Lined Up': '#8b5cf6',
      'WIP': '#f59e0b',
      'Done': '#22c55e',
      'Stuck': '#ef4444',
    };

    const priorityColors = {
      'Urgent': '#ef4444',
      'High': '#f97316',
      'Medium': '#3b82f6',
      'Low': '#22c55e',
    };

    const statusData = [
      { label: 'Backlog', value: stats.backlog, color: statusColors['Backlog'] },
      { label: 'Lined Up', value: stats.linedup, color: statusColors['Lined Up'] },
      { label: 'WIP', value: stats.wip, color: statusColors['WIP'] },
      { label: 'Done', value: stats.done, color: statusColors['Done'] },
      { label: 'Stuck', value: stats.stuck, color: statusColors['Stuck'] },
    ].filter(item => item.value > 0);

    const priorityData = [
      { label: 'Urgent', value: stats.urgent, color: priorityColors['Urgent'] },
      { label: 'High', value: stats.high, color: priorityColors['High'] },
      { label: 'Medium', value: stats.medium, color: priorityColors['Medium'] },
      { label: 'Low', value: stats.low, color: priorityColors['Low'] },
    ].filter(item => item.value > 0);

    return {
      statusPie: JSON.stringify(statusData),
      priorityBar: JSON.stringify(priorityData),
      completionDonut: JSON.stringify([
        { label: 'Completed', value: stats.done, color: '#22c55e' },
        { label: 'Pending', value: stats.backlog + stats.linedup + stats.wip + stats.stuck, color: '#64748b' },
      ].filter(item => item.value > 0)),
    };
  }

  render() {
    const stats = this.getStats();
    const chartData = this.getChartData();

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }

        .page-header {
          margin-bottom: 30px;
        }

        .page-header h2 {
          font-size: 2rem;
          font-weight: 700;
          margin: 0 0 10px 0;
          color: var(--text-primary);
        }

        .section-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 20px;
          color: var(--text-primary);
        }

        .charts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }

        .kanban-section {
          margin-top: 30px;
        }

        .chart-card {
          background: white;
          border-radius: 8px;
          padding: 16px;
          box-shadow: var(--shadow);
          transition: transform 0.2s;
        }

        .chart-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
        }

        .page-header {
          margin-bottom: 30px;
        }

        .page-header > div {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .btn-add-todo {
          padding: 12px 24px;
          font-size: 14px;
          font-weight: 600;
          border: none;
          border-radius: 8px;
          background: #3b82f6;
          color: white;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-add-todo:hover {
          background: #2563eb;
        }
      </style>

      <div class="page-header">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <h2>Dashboard</h2>
          <button id="btn-add-todo" class="btn-add-todo">
            + Add Todo
          </button>
        </div>
      </div>

      <div class="charts-grid">
        <div class="chart-card">
          <pie-chart-component
            id="status-pie"
            data='${chartData.statusPie}'
            title="Status Distribution">
          </pie-chart-component>
        </div>
        <div class="chart-card">
          <bar-chart-component
            id="priority-bar"
            data='${chartData.priorityBar}'
            title="Priority Breakdown">
          </bar-chart-component>
        </div>
        <div class="chart-card">
          <donut-chart-component
            id="completion-donut"
            data='${chartData.completionDonut}'
            title="Completion Rate">
          </donut-chart-component>
        </div>
      </div>

      <div class="kanban-section">
        <h3 class="section-title">Kanban Board</h3>
        <kanban-board-component></kanban-board-component>
      </div>
    `;
  }

  setupEventListeners() {
    // Listen for todo updates on window
    window.addEventListener('todo-saved', () => {
      this.render();
    });

    window.addEventListener('todo-deleted', () => {
      this.render();
    });

    // Add todo button
    const addTodoBtn = this.shadowRoot.querySelector('#btn-add-todo');
    if (addTodoBtn) {
      addTodoBtn.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('open-todo-modal', {
          detail: { todoId: null },
        }));
      });
    }
  }
}

customElements.define('dashboard-page', DashboardPage);

export default DashboardPage;
