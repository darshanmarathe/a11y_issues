class BarChartComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.data = [];
    this.title = '';
  }

  static get observedAttributes() {
    return ['data', 'title'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      try {
        this.data = JSON.parse(this.getAttribute('data') || '[]');
        this.title = this.getAttribute('title') || '';
        this.render();
      } catch (e) {
        console.error('Failed to parse bar chart data:', e);
      }
    }
  }

  connectedCallback() {
    this.data = JSON.parse(this.getAttribute('data') || '[]');
    this.title = this.getAttribute('title') || '';
    this.render();
  }

  render() {
    if (!this.data || this.data.length === 0) {
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 200px;
            color: #64748b;
          }
        </style>
        <div>No data available</div>
      `;
      return;
    }

    const maxValue = Math.max(...this.data.map((item) => item.value));
    const chartHeight = 200;
    const barWidth = 50;
    const barGap = 15;
    const chartWidth = this.data.length * (barWidth + barGap) + 40;

    const bars = this.data
      .map((item, index) => {
        const barHeight = maxValue > 0 ? (item.value / maxValue) * chartHeight : 0;
        const x = 20 + index * (barWidth + barGap);
        const y = chartHeight - barHeight;

        return `
          <g class="bar-group">
            <rect 
              class="bar" 
              x="${x}" 
              y="${y}" 
              width="${barWidth}" 
              height="${barHeight}" 
              fill="${item.color}" 
              rx="4"
            />
            <text 
              class="bar-label" 
              x="${x + barWidth / 2}" 
              y="${y - 8}" 
              text-anchor="middle" 
              fill="#0f172a" 
              font-size="12" 
              font-weight="600"
            >${item.value}</text>
            <text 
              class="bar-category" 
              x="${x + barWidth / 2}" 
              y="${chartHeight + 20}" 
              text-anchor="middle" 
              fill="#64748b" 
              font-size="11"
            >${item.label}</text>
          </g>
        `;
      })
      .join('');

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }

        .chart-container {
          padding: 16px;
        }

        .chart-title {
          font-size: 16px;
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 16px;
          text-align: center;
        }

        .chart-svg {
          width: 100%;
          max-width: ${chartWidth}px;
          margin: 0 auto;
          display: block;
        }

        .bar {
          transition: filter 0.2s, transform 0.2s;
          cursor: pointer;
        }

        .bar:hover {
          filter: brightness(1.15);
        }

        @media (max-width: 600px) {
          .bar-category {
            font-size: 9px;
          }
        }
      </style>

      <div class="chart-container">
        ${this.title ? `<div class="chart-title">${this.title}</div>` : ''}
        <svg class="chart-svg" viewBox="0 0 ${chartWidth} ${chartHeight + 40}">
          ${bars}
        </svg>
      </div>
    `;
  }
}

customElements.define('bar-chart-component', BarChartComponent);

export default BarChartComponent;
