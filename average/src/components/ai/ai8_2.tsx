import { Line } from "react-chartjs-2";
import {Chart as ChartJS,CategoryScale,LinearScale,PointElement,LineElement,Title,Tooltip,Legend,} from "chart.js";
ChartJS.register(CategoryScale,LinearScale,PointElement,LineElement,Title,Tooltip,Legend);  

const PredictionAccuracyChart = () => {
    
    const data = {
        labels: [
            "2017-01",
            "2017-07",
            "2018-01",
            "2018-07",
            "2019-01",
            "2019-07",
            "2020-01",
            "2020-07",
        ], 
        datasets: [
            {
                label: "Actual Usage",
                data: [3.0, 2.8, 2.6, 2.4, 2.2, 2.0, 2.5, 3.0], 
                borderColor: "blue",
                borderWidth: 2,
                tension: 0.1,
                pointStyle: "circle",
            },
            {
                label: "Predicted Usage",
                data: [1.0, 1.2, 1.1, 1.0, 0.8, 0.9, 1.0, 1.1],
                borderColor: "red",
                borderDash: [5, 5],
                borderWidth: 2,
                tension: 0.1,
                pointStyle: "cross",
            },
        ],
    };
      
    const options = {
        responsive: true,
            plugins: {
            legend: {
                position: "top" as const,
            },
            title: {
                display: true,
                text: "Test Data vs Predicted Data (2017-2020)",
            },
        },
            scales: {
                x: {
                title: {
                display: true,
                text: "Date",
            },
        },
            y: {
                title: {
                display: true,
                text: "Usage",
            },
        },
        },
    };
      
    return <Line data={data} options={options} />;
};

export default PredictionAccuracyChart;