class PieChartComponent extends HTMLElement {
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
        console.error('Failed to parse pie chart data:', e);
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

    const total = this.data.reduce((sum, item) => sum + item.value, 0);
    const size = 200;
    const center = size / 2;
    const radius = 80;

    let svgContent = '';
    let startAngle = 0;

    this.data.forEach((item, index) => {
      const sliceAngle = (item.value / total) * 360;
      const endAngle = startAngle + sliceAngle;

      const startRad = (startAngle - 90) * (Math.PI / 180);
      const endRad = (endAngle - 90) * (Math.PI / 180);

      const x1 = center + radius * Math.cos(startRad);
      const y1 = center + radius * Math.sin(startRad);
      const x2 = center + radius * Math.cos(endRad);
      const y2 = center + radius * Math.sin(endRad);

      const largeArcFlag = sliceAngle > 180 ? 1 : 0;

      const pathData = [
        `M ${center} ${center}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        'Z',
      ].join(' ');

      svgContent += `<path 
        d="${pathData}" 
        fill="${item.color}" 
        stroke="white" 
        stroke-width="2"
        class="pie-slice"
        data-index="${index}"
      />`;

      // Add percentage label
      if (sliceAngle > 20) {
        const midAngle = ((startAngle + endAngle) / 2 - 90) * (Math.PI / 180);
        const labelRadius = radius * 0.65;
        const labelX = center + labelRadius * Math.cos(midAngle);
        const labelY = center + labelRadius * Math.sin(midAngle);
        const percentage = ((item.value / total) * 100).toFixed(0);

        svgContent += `<text 
          x="${labelX}" 
          y="${labelY}" 
          text-anchor="middle" 
          dominant-baseline="central" 
          fill="white" 
          font-size="12" 
          font-weight="bold"
          class="pie-label"
        >${percentage}%</text>`;
      }

      startAngle = endAngle;
    });

    const legendItems = this.data
      .map(
        (item, index) => `
        <div class="legend-item">
          <span class="legend-color" style="background: ${item.color}"></span>
          <span class="legend-text">${item.label}: ${item.value}</span>
        </div>
      `
      )
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

        .chart-wrapper {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .pie-svg {
          flex-shrink: 0;
        }

        .pie-slice {
          transition: transform 0.2s, filter 0.2s;
          cursor: pointer;
        }

        .pie-slice:hover {
          filter: brightness(1.1);
          transform: scale(1.05);
          transform-origin: center;
        }

        .legend {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .legend-color {
          width: 16px;
          height: 16px;
          border-radius: 3px;
          flex-shrink: 0;
        }

        .legend-text {
          font-size: 13px;
          color: #475569;
        }

        @media (max-width: 600px) {
          .chart-wrapper {
            flex-direction: column;
          }
        }
      </style>

      <div class="chart-container">
        ${this.title ? `<div class="chart-title">${this.title}</div>` : ''}
        <div class="chart-wrapper">
          <svg class="pie-svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
            ${svgContent}
          </svg>
          <div class="legend">
            ${legendItems}
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('pie-chart-component', PieChartComponent);

export default PieChartComponent;
