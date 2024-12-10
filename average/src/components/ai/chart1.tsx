import { Chart } from 'chart.js/auto';
import { useEffect, useRef } from 'react';
import chartDataLabels from 'chartjs-plugin-datalabels';

const Chart1 = () => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy();
        }

        Chart.register(chartDataLabels);

        const actualData = [9070, 9248, 9040, 9068, 9068];
        const offsetActualData = actualData.map(item => item + 3000); 
        const predictedData = [8830, 9070, 9300, 8950, 8930];
        const OchaData = actualData.map((item, index) => item - predictedData[index]);

        chartInstanceRef.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['07/23', '07/24', '07/25', '07/26', '07/27'],
            datasets: [
              {
                label: '예측치',
                backgroundColor: 'rgba(75,192,192,0.0)',
                borderColor: '#FFFFFF', 
                data: predictedData,
                borderWidth: 2,
                pointStyle: 'circle',
                pointRadius: 5,
                pointBackgroundColor: '#FFFFFF',
                datalabels: {
                  align: 'top',
                  anchor: 'end',
                  color: 'white',
                  font: {
                    weight: 'bold',
                  },
                  formatter: (item) => `${item}`, 
                },
              },
              {
                label: '실제값',
                backgroundColor: 'rgba(75,192,192,0.0)',
                borderColor: '#99D9EA', 
                data: offsetActualData,
                borderWidth: 2,
                pointStyle: 'circle',
                pointRadius: 5,
                pointBackgroundColor: '#99D9EA',
                datalabels: {
                  align: 'top',
                  anchor: 'end',
                  color: '#99D9EA',
                  font: {
                    weight: 'bold',
                  },                  
                  formatter: (item, context) => {
                    const originalValue = actualData[context.dataIndex]; 
                    return `${originalValue}`;
                  },
                },
              },
              {
                label: '오차',
                backgroundColor: 'rgba(75,192,192,0.0)',
                borderColor: '#FF0000',
                data: OchaData,
                borderDash: [5, 5],
                pointStyle: 'rect',
                pointRadius: 5,
                pointBackgroundColor: '#FF0000',
                datalabels: {
                  align: 'top',
                  anchor: 'center',
                  color: '#FF0000',
                  font: {
                    weight: 'bold',
                  },
                },
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
                legend: {
                  position: 'bottom',
                  labels: {
                    font: {
                      size: 14, 
                      weight: 'bold',
                    },
                    color: '#FFFFFF',
                  },
                },
              },
            scales: {
              x: {
                beginAtZero: true,
                grid: {
                  display: false, 
                },
              },
              y: {
                beginAtZero: true,
                display:false,
                grid: {
                  display: false, 
                },
              },
            },
          },
        });
      }
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="canvas-medium">
      <canvas ref={chartRef} />
    </div>
  );
};

export default Chart1;
