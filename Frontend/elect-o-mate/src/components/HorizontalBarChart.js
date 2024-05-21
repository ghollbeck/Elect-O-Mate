import React, { useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';
import Spline from './Spline';
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
        borderWidth: 1,
      },
    ],
  };

  const options = {
    indexAxis: 'y',
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        const label = labels[index];

        // Cancel any ongoing request
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        // Create a new AbortController
        abortControllerRef.current = new AbortController();
        const abortController = abortControllerRef.current;

        // Call InformationRequest with the label and the new AbortController signal
        InformationRequest(label, abortController);
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        max: 100, // Set maximum scale to 100
      },
    },
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: t('title_results'),
      },
    },
    layout: {
      padding: {
        left: 50, // Adjust as needed
        right: 50, // Adjust as needed
      },
    },
    categorySpacing: 0.5, // Adjust spacing between bars
  };

  // Inline style to increase height
  const chartStyle = {
    height: '500px', // Set your desired height here
  };

  return (
    <div>
      <Spline />
      <Bar data={chartData} options={options} style={chartStyle} />
    </div>
  );
};

export default HorizontalBarChart;
