import React, { FC } from 'react';
import { Bar } from 'react-chartjs-2';
// import Data from './Data';
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

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: false,
      text: 'Chart.js Bar Chart',
    },
  },
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true
    }
  }
};
function TimeChart(props){
  const data = props.data.map((element) => {
    const labels: string[] = [];
    // const datasetsLabel: string[] =
    // const datasetsData: number[][] =
    // const datasetsBgColor: string[] =

    return {
      labels,
      datasets: [
        {
          label: datasetsLabel[0],
          data: datasetsData[0],
          backgroundColor: datasetsBgColor[0],
        },
        {
          label: datasetsLabel[1],
          data: datasetsData[1],
          backgroundColor: datasetsBgColor[1]
        }
      ]
    };
});
}
// console.log(Data);
const labels: string[] = ['04/23/2022', '04/24/2022','04/25/2022', '04/26/2022', '04/27/2022', '04/28/2022','04/29/2022'];
const datasetsLabel: string[] = ['Normtid', 'Differense'];
const datasetsData: number[][] = [[0, 0, 7, 7, 7, 8.5, 5],[0, 0, 0.5, -0.5, 0, 0, 2]];
const datasetsBgColor: string[] = ['rgba(62, 142, 208, 0.5)','rgba(240, 58, 95, 0.5)'];

export const data = {
  labels,
  datasets: [
    {
      label: datasetsLabel[0],
      data: datasetsData[0],
      backgroundColor: datasetsBgColor[0],
    },
    {
      label: datasetsLabel[1],
      data: datasetsData[1],
      backgroundColor: datasetsBgColor[1]
    }
  ]
};




const Graph: FC = () => {
    return <Bar options={options} data={data} />;
}
export default Graph