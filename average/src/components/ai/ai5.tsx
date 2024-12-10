import { motion } from "framer-motion"
import {useDataContext} from "components/context/aidataContext";
import { useEffect } from "react";

const AI5=()=>{
    const { industryData,cityData,regionTemperatureData } = useDataContext();

    useEffect(()=>{
        console.log("학습용 데이터 표에 쓸 거: ",industryData,cityData,regionTemperatureData);
    },[industryData,cityData,regionTemperatureData]);

    return(
        <motion.div 
            className="ai-5"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{
                ease: "easeIn",
                duration: 1,
                y: { duration: 0.5 }
            }}
        >
            <h1 className="ai5-text-title">"Q : 그럼 학습용 데이터는 최종적으로 어떤 모습으로 사용되었나요?"</h1>
            <div className="ai5-group">
                <div className="ai5-left-item">
                    <h1 className="ai5-text-subtitle">학습 사용 데이터 설명</h1>
                    {[
                        {
                        title: "no",
                        content: (
                            <>
                            데이터를 구분할 번호 (약 54900개의 데이터)
                            </>
                        ),
                        },
                        {
                        title: "date",
                        content: (
                            <>
                            시계열 예측에 사용될 시간 데이터
                            </>
                        ),
                        },
                        {
                        title: "Contracttype",
                        content: (
                            <>
                            한글은 데이터 학습이 불가함으로 숫자로 바꾸어 <br />
                            <span className="font-bold">(1: 주택용,3: 교육용, 4: 산업용, 5: 농사용, 6: 가로등)</span>
                            으로 되어 있으며 이 컬럼은 특성값으로 사용.
                            </>
                        ),
                        },
                        {
                        title: "Attempt",
                        content: (
                            <>
                            지역별 전력사용량을 나누기 위해 사용됨. 한국어로 학습시킬 수 없기 때문에 숫자로 바꾸어 특성값으로 사용.
                            </>
                        ),
                        },
                        {
                        title: "Temperature",
                        content: (
                            <>
                            평균 온도로 온도에 따라 전력 사용량이 바뀔 것이라 생각하여 특성값으로 사용.
                            </>
                        ),
                        },
                        {
                        title: "Usage",
                        content: (
                            <>
                            전력 사용량으로 y값인 결과 값으로 사용됨.
                            </>
                        ),
                        },
                    ].map((item,index)=>(
                        <div
                            key={index}
                            className="ai5-text-content"
                        >
                            <h2 className="text-3xl mb-2 ai2-title-gradient">{item.title} : </h2>
                            <p className="text-2xl font-thin text-start">{item.content}</p>
                        </div>
                    ))}
                </div>
                <div className="ai5-right-item">
                    <h1 className="ai5-text-subtitle">학습에 사용된 데이터</h1>
                    <table className="ai5-motion-table">
                        <thead className="ai5-table-thead">
                            <tr className="ai5-table-tr-th">
                                <th className="ai5-table-tr-th">No</th>
                                <th className="ai5-table-tr-th">Date</th>
                                <th className="ai5-table-tr-th">Contracttype</th>
                                <th className="ai5-table-tr-th">Attempt</th>
                                <th className="ai5-table-tr-th">Temperature</th>
                                <th className="ai5-table-tr-th">Usage</th>
                            </tr>
                        </thead>
                        <tbody className="ai5-table-tbody">
                            {regionTemperatureData.map((data, index) => (
                            <tr 
                                key={index}
                                className="ai5-table-tbody-tr"
                            >
                                <td className="td-ppb">{index + 1}</td>
                                <td className="td-ppb">{`${data.year}-01-01 0:00`}</td>
                                <td className="td-ppb">1</td> 
                                <td className="td-ppb">1</td> 
                                <td className="td-ppb">{data.spring}</td> 
                                <td className="td-ppb">{data.summer * 1000000}</td> 
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );

}

export default AI5;