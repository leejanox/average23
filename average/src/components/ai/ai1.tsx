import { motion } from "framer-motion";
import Chart1 from "./chart1";

interface AI1Props {
    handleClick: (value:string) => void;
}

const AI1:React.FC<AI1Props>=({handleClick})=>{
    return (
        <div className="ai-1">
            <motion.div
                className="flex flex-col gap-10"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
            >
                <h1 className="ai-text-title logo-gradient">
                    여름철 전력 수요 예측 모델: <br />
                    에너지 효율성을 높이는 핵심 전략
                </h1>
                <h1 className="text-subtitle">전력수요예측 모델 개발이 왜 필요한가?</h1>
                <h2 className="text-content">
                    최근 2018년도 부터 기록적인 폭염으로 인해 전력 사용량이 급격히 증가하면서 <br />
                    정부의 전력 수요 예측이 크게 빗나갔습니다. <br />
                    이러한 예측 오류는 전력 수급 불안정을 초래하며, <br />
                    사회적·경제적·환경적으로 심각한 문제를 야기할 수 있습니다. <br />
                    따라서, 보다 정확한 전력 수요 예측 모델의 개발이 필수적입니다.
                </h2>
                <span className="text-click">Click me!</span>
                <div className="flex gap-6">
                    <motion.button
                        name="wktpgl"
                        onClick={()=>handleClick("wktpgl")}
                        className="ai-btn"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <span>자세히 보기</span>
                    </motion.button>
                    <motion.button
                        name="trymodel"
                        onClick={()=>handleClick("try")}
                        className="ai-btn"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <span>모델 체험해보기</span>
                    </motion.button>
                </div>
            </motion.div>
            <motion.div
                className="chart-group"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
            >
                <h1 className="text-sm mb-3">단위: 만kW</h1>
                <Chart1/>
                <h1 className="text-wrap text-content mt-10">
                    평균적인 한 가정당 하루 전력 소비량 평균은 30kW 정도입니다.<br />
                    이렇게 전력 소비량 예측이 200만 kW가 빗나가게 되면 <br />
                    67,000 가구가 하루동안 써야 할 전력 공급에 문제를 가져와 사회에 혼란을 일으킵니다.
                </h1>
            </motion.div>            
        </div>
    );
}

export default AI1;