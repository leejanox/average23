import { motion } from 'framer-motion';

const AI2 = () => {
  return (
    <motion.div 
      initial={{opacity:0}}
      animate={{opacity:1}}
      transition={{duration:0.5}}
      className="ai-2"
    >
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="ai2-text-title">01_ 전력 수요 예측 모델의 필요성</h1>
          <div className="ai2-grid">
            {[
              {
                title: '전력 공급 부족 (블랙아웃 발생 가능성)',
                content:
                  '<p>(1) 전력 공급 부족으로 인한 블랙아웃</p><p>(2) 전력 의존 인프라 등 공공서비스 마비</p>',
              },
              {
                title: '비용 증가 및 전기료 상승',
                content: '<p>(1) 비상 발전기 가동 & 외부 전력 구매</p><p>(2) 결과적으로 전기료 상승 초래</p>',
              },
              {
                title: '환경 오염 및 탄소 배출 증가',
                content:
                  '<p>(1) 전력 공급 부족으로 인한 블랙아웃</p><p>(2) 전력 의존 인프라 등 공공서비스 마비</p>',
              },
              {
                title: '재난 대응 및 복구 계획 지원',
                content:
                  '<p>(1) 전력 공급 부족으로 인한 블랙아웃</p><p>(2) 전력 의존 인프라 등 공공서비스 마비</p>',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="ai2-item mr-[80px]"
                initial={{ opacity: 0, y: 50 }}
                viewport={{once:false}}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.3, duration: 0.8 }}
              >
                <h1 className="ai3-text-title mb-2">{item.title}</h1>
                <h2 className="text-content" dangerouslySetInnerHTML={{ __html: item.content }}></h2>
              </motion.div>
          ))}
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="ai2-text-title">02_ 예측 모델의 기대 효과</h1>
          <div className="ai2-grid">
            {[
              {
                title: '전력 공급 안정성 향상',
                content:
                  '<p>(1) 정확한 수요 예측을 통해 전력 공급의 안정성을 확보</p><p>(2) 블랙아웃과 같은 대규모 정전을 예방</p>',
              },
              {
                title: '비용 절감 & 환경 보호',
                content:
                  '<p>(1) 비상 발전기 가동이나 외부 전력 구매에 드는 추가 비용 절감</p><p>(2) 화력 발전소 가동을 줄여 탄소 배출을 최소화</p>',
              },
              {
                title: '경제 효율성 & 에너지 효율성 개선',
                content:
                  '<p>(1) 전력 인프라의 효율적인 운영, 관리</p><p>(2) 자원의 최적 활용을 도모</p>',
              },
              {
                title: '정책 및 계획 수립 지원',
                content:
                  '<p>(1) 정확한 데이터를 바탕으로 에너지 정책을 수립</p><p>(2) 장기적인 전력 계획을 세울 수 있도록 지원</p>',
              },
            ].map((item, index) => (
            <motion.div
              key={index}
              className="ai2-item"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.3, duration: 0.8 }}
            >
              <h1 className="ai3-text-title mb-2">{item.title}</h1>
              <h2 className="text-content ml-10" dangerouslySetInnerHTML={{ __html: item.content }}></h2>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AI2;
