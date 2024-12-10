import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { originUsageType } from "components/types/aiDataType";
import axios from "axios";

const AI3 = () => {
  const [originUsage, setOriginUsage] = useState<originUsageType[]>([]);

  useEffect(() => {
    const fetchelectrodata1 = async () => {
      try {
        const res = await axios.get<originUsageType[]>(
          `http://localhost:5000/api/fetchelectrodata1`
        );
        //console.log("응답_전력사용량 데이터: ", res.data);
        setOriginUsage(res.data);
      } catch (error) {
        console.error("전력사용량 데이터 불러오기 실패: ", error);
      }
    };

    fetchelectrodata1();
  }, []);

  useEffect(()=>{   
    //console.log("저장된 데이터: ",originUsage)
    //console.log(originUsage[1].attempt);
  },[originUsage])

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false }}
      transition={{
          ease: "easeIn",
          duration: 1,
          y: { duration: 0.5 }
      }}
      className="ai-3"
    >
      <h1 className="ai3-text-title"># 예측 모델을 만들기 위한 과정</h1>
      <div className="electro-usage-group">
        <div className="ai3-left-item">
          <h2 className="ai3-text-subtitle">첫번째 과정: 학습을 위한 데이터 수집 및 전처리</h2>
          <div className="ai3-left-item-content">
            {[
              {
                title: "(1) 불완전한 데이터 처리",
                content:
                  "<p>결측값과 이상치를 처리하여 모델 학습 정확도 향상</p>",
              },
              {
                title: "(2) 데이터 일관성 유지",
                content:
                  "<p>데이터 형식을 통일시켜 모델이 제대로 이해하도록 함</p>",
              },
              {
                title: "(3) 스케일 조정 및 정규화",
                content: "<p>특성 값의 범위를 맞추어 모델 성능 개선</p>",
              },
              {
                title: "(4) 특성 선택 및 차원 축소",
                content:
                  "<p>불필요한 특성을 제거하거나 차원 축소하여 효율성 향상</p>",
              },
              {
                title: "(5) 범주형 데이터 처리",
                content:
                  "<p>범주형 데이터를 수치형으로 변환해 모델이 이해할 수 있게 함</p>",
              },
              {
                title: "(6) 학습 속도 향상",
                content: "<p>데이터 크기와 복잡도를 줄여 학습 속도 개선</p>",
              },
              {
                title: "(7) 오버피팅 방지",
                content:
                  "<p>과도한 학습을 방지하고 모델의 일반화 능력 향상</p>",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="ai3-left-item-content-text"
              >
                <h1>{item.title}</h1> &nbsp;{":"}&nbsp; 
                <h1 dangerouslySetInnerHTML={{ __html: item.content }} />
              </motion.div>
            ))}
          </div>
        </div>
        <div className="ai3-right-item">
          <h2 className="ai3-text-subtitle"># 전처리 하기 전의 전력 사용량 데이터는 어떻게 생겼나요?<br/>
          <span className="text-2xs ml-[880px]">{`(단위: Kw/h) | 출처:KEPCO`}</span>
          </h2>
          <div className="ai3-usage-table-wrap">
            <table
                className="ai3-motion-table"
            >
                <thead className="ai3-table-thead">
                    <tr>
                        <th className="ai3-table-tr-th">연도</th> 
                        <th className="ai3-table-tr-th">시도</th>
                        <th className="ai3-table-tr-th">시군구</th>
                        {Array.from({length:12}).map((_,index)=>(
                            <th className="ai3-table-tr-th">{`${index+1}월`}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="ai3-table-tbody">
                    {originUsage.map((value,index)=>{
                        return(
                            <tr
                                key={index}
                                className="ai3-table-tbody-tr"
                            >
                                <td className="td-ppb">{value.year}</td>
                                <td className="td-ppb">서울특별시</td>
                                <td className="td-ppb">{value.city}</td>
                                {Object.entries(value.month).map(([month,value])=>(
                                    <td className="td-ppb">{value}</td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AI3;
