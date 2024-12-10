import { Line } from "react-chartjs-2";
import {Chart as ChartJS,CategoryScale,LinearScale,PointElement,LineElement,Title,Tooltip,Legend,} from "chart.js";
ChartJS.register(CategoryScale,LinearScale,PointElement,LineElement,Title,Tooltip,Legend);  
//npm install chart.js react-chartjs-2

const TrainingLossChart=()=>{

    const data = {
        labels: Array.from({ length: 40 }, (_, i) => i + 1),
        datasets: [
            {
                label: "Loss",
                data: [
                0.035, 0.032, 0.029, 0.025, 0.020, 0.018, 0.015, 0.013, 0.012, 0.011,
                0.010, 0.009, 0.008, 0.007, 0.0065, 0.006, 0.0058, 0.0055, 0.0052,
                0.005,
                ],
                borderColor: "#FFAEC9",
                borderWidth: 2,
                //tension: 0.1,
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
                text: "오차율",
            },
        },
        scales: {
            x: {
                title: {
                display: true,
                text: "Epoch",
                },
            },
                y: {
                title: {
                    display: true,
                    text: "Loss",
                },
            },
        },
    };
    
    return <Line data={data} options={options} />;
};


export default TrainingLossChart;