import React, { useEffect, useRef } from 'react';
import { Chart, BarElement, CategoryScale, LinearScale } from 'chart.js';

Chart.register(BarElement, CategoryScale, LinearScale);

interface Props {
  value: number;
  max: number;
}

const MetricBar: React.FC<Props> = ({ value, max }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const chart = new Chart(canvasRef.current, {
      type: 'bar',
      data: {
        labels: [''],
        datasets: [
          {
            data: [value],
            backgroundColor: '#3b82f6',
            barPercentage: 1,
            categoryPercentage: 1,
          },
        ],
      },
      options: {
        indexAxis: 'y',
        animation: false,
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        scales: {
          x: { display: false, max, beginAtZero: true },
          y: { display: false },
        },
      },
    });
    return () => chart.destroy();
  }, [value, max]);

  return <canvas ref={canvasRef} width={120} height={16} className="metric-chart" />;
};

export default MetricBar;

