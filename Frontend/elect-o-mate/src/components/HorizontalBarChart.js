import React, { useRef, useEffect } from 'react';
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
import 'chartjs-plugin-datalabels'; // Import the datalabels plugin
import { ClassNames } from '@emotion/react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const HorizontalBarChart = ({ data, InformationRequest, setParty }) => {
  const abortControllerRef = useRef(null);
  const { t, i18n } = useTranslation();
  const percentages = data.map((item) => item[0]);
  const labels = data.map((item) => item[1]);
  const parytnames = data.map((item) => item[2]);
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: '%',
        data: percentages,
        backgroundColor: 'rgba(251, 207, 232, 0.2)',
        borderColor: '#f7d0eb',
        borderWidth: 1,
        borderRadius: 10,
      },
    ],
  };

  const options = {
    indexAxis: 'y',
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        const label = labels[index];
        const partyname = parytnames[index];
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();
        const abortController = abortControllerRef.current;
        setParty(label);
        InformationRequest(label, partyname, abortController);
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
          font: {
            weight: 'bold', // Make ticks bold
          },
          mirror: true,
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
        color: '#ffffff',
      },
      datalabels: {
        color: '#ffffff',
        anchor: 'end',
        align: 'top', // Position the labels to the end (right) of the bars
      },
    },
  };

  // Calculate height dynamically
  const chartHeight = `${Math.max(500, 27 * data.length)}px`;

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
