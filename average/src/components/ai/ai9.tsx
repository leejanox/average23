import { motion } from "framer-motion"

const AI9=()=>{

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
            className="ai-9"
        >
            <h1 className="ai9-title-gradient">결론</h1>

            <h2 className="ai9-subtitle-gradient">모델 학습 결과</h2>
            <p className="ai9-text-content">
                학습 초기에는 Loss가 빠르게 감소했으나, 20 Epoch 이후에는 감소 속도가 느려지고, 100 Epoch에 가까워지면서 수렴합니다.
            </p>

            <h2 className="ai9-subtitle-gradient">테스트 데이터 예측 결과</h2>
            <p className="ai9-text-content">
                Usage가 급격히 변화하는 시점에서 예측값의 변화가 충분히 반영되지 않았음을 확인할 수 있었습니다.
            </p>

            <h2 className="ai9-subtitle-gradient">개선 방안</h2>
            <div className="ai9-text-content">
                <p>데이터 전처리 강화: 이상값(Outliers) 및 급격한 변화(Spikes) 처리</p>
                <p>시간적 패턴: 월별 대신 시간 또는 일 단위로 데이터 처리</p>
                <p>이벤트 데이터: 자연재해, 정책 변화 등 처리</p>
            </div>

            <h2 className="ai9-subtitle-gradient">아쉬운 점</h2>
            <div className="ai9-text-content">
                <p>특성값 부족: 전력 사용량에 영향을 주는 특성값 추가 필요</p>
                <p>이상치 처리: 급격한 변화가 있는 데이터를 제거하지 못한 점</p>
            </div>
        </motion.div>
    );
}

export default AI9;