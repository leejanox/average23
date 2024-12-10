import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const PredictionAccuracyChart = () => {
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const chartInstanceRef = useRef<Chart | null>(null);

    useEffect(() => {
        if (chartRef.current) {
        const ctx = chartRef.current.getContext("2d");
        if (ctx) {
            if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
            }

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
                    label: "실제 사용량",
                    data: [3.0, 2.8, 2.6, 2.4, 2.2, 2.0, 2.5, 3.0],
                    borderColor: "#4AEAE3",
                    borderWidth: 2,
                    tension: 0.4,
                    pointStyle: "circle",
                    pointRadius: 5,
                    pointBackgroundColor: "#4AEAE3",
                },
                {
                label: "예측 사용량",
                data: [1.0, 1.2, 1.1, 1.0, 0.8, 0.9, 1.0, 1.1],
                borderColor: "#EA3236",
                borderWidth: 2,
                borderDash: [5, 5],
                tension: 0.4,
                pointStyle: "cross",
                pointRadius: 5,
                pointBackgroundColor: "#EA3236",
                },
            ],
        };

            const options = {
            responsive: true,
            plugins: {
                legend: {
                    position: "top" as const,
                        labels: {
                            font: {
                                size: 14,
                                weight: "bold" as const,
                            },
                            color: "#FFFFFF",
                        },
                },
                    title: {
                        display: true,
                        text: "실제 사용량과 예측 사용량",
                            font: {
                                size: 18,
                                weight: "bold" as const,
                            },
                        color: "#63F7FF",
                    },
                    datalabels: {
                        display: true, // 데이터 라벨 표시
                        align: "top" as const, // 데이터 라벨 위치
                        color: "#FFFFFF", // 데이터 라벨 색상 
                        font: {
                            size: 12, // 데이터 라벨 폰트 크기
                            weight: "bold" as const,
                        },
                        formatter: (value:number) => value.toFixed(3), // 소수점 세 자리
                    },
                },
                scales: {
                    x: {
                        ticks:{
                            color: "#FFFFFF",
                        },
                        title: {
                            display: true,
                            text: "Date",
                            font: {
                                size: 14,
                                },
                        color: "#FFFFFF",
                    },
                },
                y: {
                    ticks:{
                        color: "#FFFFFF",
                    },
                    title: {
                        display: true,
                        text: "사용량 (Usage)",
                        font: {
                            size: 14,
                            },
                    color: "#FFFFFF",
                },
                },
            },
        };
        chartInstanceRef.current = new Chart(ctx, {
            type: "line",
            data: data,
            options: options,
        });
    }
}

    return () => {
        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
        }
    };
}, []);

    return <canvas ref={chartRef} />;
};

export default PredictionAccuracyChart;
