import {motion} from "framer-motion";
import TrainingLossChart from "components/ai/ai8_1";
import PredictionAccuracyChart from "components/ai/ai8_2";

const AI8=()=>{
    return(
        <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{
                ease: "easeIn",
                duration: 1,
                y: { duration: 0.5 }
            }}
            className="ai-8"
        >
            <h1 className="ai8-text-title">"Q: 학습이 완료 된 모델의 LOSS & 테스트 데이터로 평가한 예측결과의 정확도는 어떤가요?"</h1>
            <div className="ai-8-content">
                <div className="w-[40%] h-[40vh]">
                    <TrainingLossChart/>
                </div>
                <div className="w-[40%] h-[40vh]">
                    <PredictionAccuracyChart/>
                </div>
            </div>
        </motion.div>
    );
}

export default AI8;