import React, { useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const HorizontalBarChart = ({ data, InformationRequest }) => {
  const abortControllerRef = useRef(null);
  const { t, i18n } = useTranslation();
  const percentages = data.map((item) => item[0]);
  const labels = data.map((item) => item[1]);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: '%',
        data: percentages,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    indexAxis: 'y',
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        const label = labels[index];

        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();
        const abortController = abortControllerRef.current;

        InformationRequest(label, abortController);
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function (value) {
            return value + '%'; // Append percent sign
          },
          color: '#ffffff',
        },
      },
      y: {
        ticks: {
          color: '#ffffff', // Set the y-axis text color to white
        },
      },
    },

    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: t('title_results'),
      },
    },
    // Change text color of labels
  };

  // Calculate height dynamically
  const chartHeight = `${25 * data.length}px`;

  const chartStyle = {
    height: chartHeight,
    width: '100%', // Ensure it takes full width of the container
  };

  return (
    <div className='flex flex-col' style={{ height: chartHeight }}>
      <div className='flex-grow'>
        <Bar data={chartData} options={options} style={chartStyle} />
      </div>
    </div>
  );
};

export default HorizontalBarChart;
