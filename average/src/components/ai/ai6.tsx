import {motion} from "framer-motion";

const AI6=()=>{

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
          className="ai-6"
        >
        <h1 className="ai6-text-title">"Q : 그럼 모델 학습방법은 무엇을 사용했나요?"</h1>
        <h1 className="ai6-text-subtitle">"A: 시계열 예측 LSTM(Long Short-Term Memory) 을 사용했습니다."</h1>
        
        <div className="ai6-group">
          <div className="ai6-left-item">
            <h2 className="ai6-text-subtitle">LSTM 모델을 활용한 시계열 예측 선정 이유</h2>
            <div className="ai6-item-content">
                <div className="mb-2 fr">
                    <h3 className="ai6-text-subtitle">"계절적 요인" :</h3>
                    <p className="ai6-text-content">
                        전력 소비는 여름(냉방 수요 증가)과 겨울(난방 수요 증가) 같은 계절 변화에 따라 크게 달라지며, <br/>월 단위로 분석하기 적합합니다.
                    </p>
                </div>
                <div className="mb-2 fr">
                    <h3 className="ai6-text-subtitle">"월별 주기성" :</h3>
                    <p className="ai6-text-content">
                        특정 달에 정기적인 행사나 공휴일이 포함될 경우 소비 패턴이 달라질 수 있습니다. <br/>LSTM은 이러한 월별 주기성을 효과적으로 학습할 수 있습니다.
                    </p>
                </div>
            </div>
          </div>
          <div className="ai6-right-item">
            <h2 className="ai6-text-subtitle">신경망 모델 구조</h2>
            <div className="ai6-item-content">
              <div className="mb-2 fr">
                <h3 className="ai6-text-subtitle">"입력 계층" :</h3>
                <p className="ai6-text-content">
                   Year, Month, Day, Contracttype, Attempt, Temperature 총 6개의 입력 계층으로 구성.
                </p>
              </div>
              <div className="mb-2 fr">
                <h3 className="ai6-text-subtitle">"은닉 계층" : </h3>
                <p className="ai6-text-content"> 64개의 LSTM 유닛으로 구성되어 복잡한 시간적 관계를 학습합니다.</p>
              </div>
              <div className="mb-4 fr">
                <h3 className="ai6-text-subtitle">"출력 계층" : </h3>
                <p className="ai6-text-content"> 1개의 노드로 구성되며, Usage 데이터를 출력합니다.</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
  
    );
}

export default AI6;