import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
import chartDataLabels from "chartjs-plugin-datalabels";

Chart.register(...registerables, chartDataLabels);

const TrainingLossChart = () => {
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
            labels: Array.from({ length: 20 }, (_, i) => i + 1), // 1부터 20까지 레이블
            datasets: [
                {
                label: "Loss",
                data: [
                    0.035, 0.032, 0.029, 0.025, 0.020, 0.018, 0.015, 0.013, 0.012, 0.011,
                    0.010, 0.009, 0.008, 0.007, 0.0065, 0.006, 0.0058, 0.0055, 0.0052,
                    0.005,
                ],
                borderColor: "#FFFFFF", // 선 색상
                borderWidth: 2, // 선 두께
                pointStyle: "circle", // 데이터 포인트 스타일
                pointRadius: 5, // 데이터 포인트 크기
                pointBackgroundColor: "#B8EAA2", // 데이터 포인트 색상
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
                text: "예측데이터와 실제데이터 사이의 오차율",
                font: {
                    size: 18,
                    weight: "bold" as const,
                },
                color: "#63F7FF",
                },
                datalabels: {
                display: true, // 데이터 라벨 표시
                align: "top" as const, // 데이터 라벨 위치
                color: "#B8EAA2", // 데이터 라벨 색상 
                font: {
                    size: 12, // 데이터 라벨 폰트 크기
                    weight: "bold" as const,
                },
                formatter: (value:number) => value.toFixed(3), // 소수점 세 자리
                },
            },
            scales: {
                x: {
                title: {
                    display: true,
                    text: "학습률 (Epoch)",
                    font: {
                    size: 14,
                    },
                    color: "#FFFFFF",
                },
                ticks: {
                    color: "#FFFFFF",
                },
                },
                y: {
                title: {
                    display: true,
                    text: "오차율 (Loss)",
                    font: {
                    size: 14,
                    },
                    color: "#FFFFFF",
                },
                ticks: {
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

    return <canvas ref={chartRef} className="w-full h-full" />;
};

export default TrainingLossChart;
