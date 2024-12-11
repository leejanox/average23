import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const PredictionChart = ({ predictions }: { predictions: number[] }) => {
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const chartInstanceRef = useRef<Chart | null>(null);

    useEffect(() => {
        if (chartRef.current && predictions) {
        const ctx = chartRef.current.getContext("2d");
        if (ctx) {
            if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
            }

            chartInstanceRef.current = new Chart(ctx, {
            type: "line",
            data: {
                labels: Array.from({ length: 12 }, (_, i) => `${i + 1}월`), // 1월~12월
                datasets: [
                {
                    label: "예측 사용량 (kW)",
                    data: predictions,
                    borderColor: "#F794FF", // 선 색상
                    borderWidth: 2,
                    pointStyle: "circle",
                    pointRadius: 4,
                    pointBackgroundColor: "#F794FF", // 점 색상
                },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                            position: "top" as const,
                            display: true,
                        labels: {
                        color: "#FFFFFF", // 범례 텍스트 색상
                        font: {
                            size: 14,
                            weight: "bold" as const,
                        },
                        }, 
                    },
                    title: {
                        display: true,
                        text: "월별 전기 사용량 예측 결과",
                        color: "#FFFFFF",
                        font: {
                        size: 18,
                        weight: "bold" as const,
                        },
                    },
                    datalabels: {
                        display: true, // 데이터 라벨 표시
                        align: "top" as const, // 데이터 라벨 위치
                        color: "#F794FF", // 데이터 라벨 색상 
                        font: {
                            size: 12, // 데이터 라벨 폰트 크기
                            weight: "bold" as const,
                        },
                        formatter: (value:number) => value.toFixed(1), // 소수점 세 자리
                        },
                    },
                    scales: {
                    x: {
                        title: {
                        display: true,
                        text: "월",
                        color: "#FFFFFF",
                        font: {
                            size: 14,
                        },
                        },
                        ticks: {
                        color: "#FFFFFF",
                        },
                    },
                    y: {
                        title: {
                        display: true,
                        text: "사용량 (kWh)",
                        color: "#FFFFFF",
                        font: {
                            size: 14,
                        },
                        },
                        ticks: {
                        color: "#FFFFFF",
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
    }, [predictions]);

    return (
        <div className="canvas-container">
        <canvas ref={chartRef} className="w-full h-[460px] bg-transparent" />
        </div>
    );
};

export default PredictionChart;
