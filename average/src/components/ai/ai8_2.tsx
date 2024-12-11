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
                    "2021-01"
                ],
            datasets: [
                {
                    label: "실제 사용량",
                    data: [
                        2815030.0,2663309.9, 2421470.0, 2394980.0, 2231210.0, 2159610.0, 
                        2121410.0, 2176000.0, 2312889.9, 2487270.0, 2711280.0, 2819169.9, 
                        2933429.9, 2775460.0, 2549790.0, 2520529.9, 2363120.0, 2278340.0, 
                        2222200.0, 2395890.0, 2491249.9, 2669400.0, 2863719.9, 2982220.0, 
                        166936.0, 142980.9, 139740.9, 120539.9, 116713.01, 111140.0, 119631.03, 
                        127520.0, 119255.0, 122605.9, 138500.0, 181140.03, 3129940.0, 3016859.9, 
                        2781720.0, 2725379.9, 2529570.0, 2403540.0, 2296630.0, 2415860.0, 2499570.0, 
                        2737620.0, 3009479.9, 3149459.9
                    ],
                    borderColor: "#4AEAE3",
                    borderWidth: 2,
                    tension: 1,
                    pointStyle: "circle",
                    pointRadius: 5,
                    pointBackgroundColor: "#4AEAE3",
                },
                {
                label: "예측 사용량",
                data: [2633270, 2633270, 2633270,
                    2493253.33333333, 2349220, 2261933.33333333,
                    2170743.33333333, 2152340, 2203433.33333333,
                    2325386.66666667, 2503813.33333333, 2672573.33333333,
                    2821293.33333333, 2842686.66666667, 2752893.33333333,
                    2615260, 2477813.33333333, 2387330,
                    2287886.66666667, 2298810, 2369780,
                    2518846.66666667, 2674790, 2838446.66666667,
                    2004292, 1097379,  149886,
                     134420.66666667, 125664.66666667,  116131,
                     115828, 119430.33333333,  122135.33333333,
                     123127, 126787,  147415.33333333,
                    1149860, 2109313.33333333, 2976173.33333333,
                    2841320, 2678890, 2552830,
                    2409913.33333333, 2372010, 2404020,
                    2551016.66666667, 2748890, 2965520],
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
                        formatter: (value:number) => value.toFixed(1), // 소수점 세 자리
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
