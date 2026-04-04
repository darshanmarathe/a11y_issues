class DonutChartComponent extends HTMLElement {
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
        console.error('Failed to parse donut chart data:', e);
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
    const outerRadius = 80;
    const innerRadius = 50;

    let svgContent = '';
    let startAngle = 0;

    this.data.forEach((item, index) => {
      const sliceAngle = (item.value / total) * 360;
      const endAngle = startAngle + sliceAngle;

      const startRadOuter = (startAngle - 90) * (Math.PI / 180);
      const endRadOuter = (endAngle - 90) * (Math.PI / 180);
      const startRadInner = (endAngle - 90) * (Math.PI / 180);
      const endRadInner = (startAngle - 90) * (Math.PI / 180);

      const x1Outer = center + outerRadius * Math.cos(startRadOuter);
      const y1Outer = center + outerRadius * Math.sin(startRadOuter);
      const x2Outer = center + outerRadius * Math.cos(endRadOuter);
      const y2Outer = center + outerRadius * Math.sin(endRadOuter);

      const x1Inner = center + innerRadius * Math.cos(startRadInner);
      const y1Inner = center + innerRadius * Math.sin(startRadInner);
      const x2Inner = center + innerRadius * Math.cos(endRadInner);
      const y2Inner = center + innerRadius * Math.sin(endRadInner);

      const largeArcFlag = sliceAngle > 180 ? 1 : 0;

      const pathData = [
        `M ${x1Outer} ${y1Outer}`,
        `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2Outer} ${y2Outer}`,
        `L ${x1Inner} ${y1Inner}`,
        `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x2Inner} ${y2Inner}`,
        'Z',
      ].join(' ');

      svgContent += `<path 
        d="${pathData}" 
        fill="${item.color}" 
        stroke="white" 
        stroke-width="1"
        class="donut-slice"
        data-index="${index}"
      />`;

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

        .donut-svg {
          flex-shrink: 0;
        }

        .donut-slice {
          transition: transform 0.2s, filter 0.2s;
          cursor: pointer;
        }

        .donut-slice:hover {
          filter: brightness(1.1);
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
          <svg class="donut-svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
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

customElements.define('donut-chart-component', DonutChartComponent);

export default DonutChartComponent;
