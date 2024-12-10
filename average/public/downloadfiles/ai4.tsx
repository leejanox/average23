import { useEffect} from "react";
import { motion } from "framer-motion";
import {industryDataType,cityDataType} from "components/types/aiDataType";
import axios from "axios";
import {useDataContext} from "components/context/aidataContext";

const AI4 = () => {

    const { setIndustryData, setCityData, setRegionTemperatureData } = useDataContext();
    const {industryData,cityData,regionTemperatureData}=useDataContext();

    useEffect(() => {
        const fetchData = async () => {
          try {
            const industryRes = await axios.get<industryDataType[]>(`http://localhost:5000/api/fetchelectrodata2`);
            setIndustryData(industryRes.data);
    
            const cityRes = await axios.get<cityDataType[]>(`http://localhost:5000/api/fetchelectrodata3`);
            setCityData(cityRes.data);
    
            const temperatureRes = await axios.get(`http://localhost:5000/api/fetchelectrodata4`);
            const mappedData = temperatureRes.data.map((item: any) => ({
              year: item["연"],
              spring: item["봄"],
              summer: item["여름"],
              autumn: item["가을"],
              winter: item["겨울"],
            }));
            setRegionTemperatureData(mappedData);
          } catch (error) {
            console.error("데이터 불러오기 실패: ", error);
          }
        };
    
        fetchData();
    }, [setIndustryData, setCityData, setRegionTemperatureData]);

    useEffect(()=>{
        //console.log("ai4 데이터: ",industryData,cityData,regionTemperatureData);
    },[industryData,cityData,regionTemperatureData])
    
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
            className="ai-4"
        >
            <h1 className="ai4-text-title pt-2"># 예측 모델을 위한 전처리된 데이터</h1>
            <div className="ai4-group">
                <div className="ai4-left-item">
                    <h1 className="ai4-text-title"> 데이터 전처리 설명 </h1>
                    <div className="ai-left-item-content">
                        <div
                            className="ai4-left-item-content-text"
                        >
                            <h2 className="ai5-text-title">"Q : 전력 사용량 csv에서 어떤 데이터를 사용했나요?"</h2>
                            <div className="text-start ml-16">
                                <h2>"A : 학습을 위해 사용한 데이터는 연도, 시도, 업종별로 구분된 1~12월 전력 사용량입니다.</h2>
                                <h2>데이터를 학습시킬 때 한글 사용은 불가능해 이름별로 숫자를 붙여 따로 분리했습니다.</h2>
                                <h2>no 컬럼에 1,2,3,4,5,6 번째 데이터를 사용 했는데 그 이유는 </h2>
                                <h2>일반용은 무엇인지 확인이 안되어 제외했고, </h2>
                                <h2>심야,합계는 전력 사용량에 이상치 데이터가 많아 제외했습니다.</h2>
                                <h2>지역별 기온데이터를 기상청에서 가져왔고 학습 데이터로 Avg Temperature을 사용했습니다."</h2>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="ai4-right-item">
                    <div className="ai-right-item-content-1">
                        <h2 className="ai4-text-subtitle">산업 데이터</h2>
                        <table className="ai4-motion-table">
                            <thead className="ai4-table-thead">
                            <tr>
                                <th className="ai4-table-tr-th">ID | </th>
                                <th className="ai4-table-tr-th">산업명</th>
                            </tr>
                            </thead>
                            <tbody className="ai4-table-tbody">
                            {industryData.map((item, index) => (
                                <tr
                                    key={index}
                                    className="ai4-table-tbody-tr"
                                >
                                <td className="td-ppb">{item.id}</td>
                                <td className="td-ppb">{item.name}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <h2 className="ai4-text-subtitle">도시 데이터</h2>
                        <table className="ai4-motion-table">
                            <thead className="ai4-table-thead">
                            <tr className="ai5-table-tr-th">
                                <th className="ai4-table-tr-th">ID | </th>
                                <th className="ai4-table-tr-th">도시명</th>
                            </tr>
                            </thead>
                            <tbody className="ai4-table-tbody">
                            {cityData.slice(0, 8).map((item, index) => (
                                <tr
                                    key={index}
                                    className="ai4-table-tbody-tr"
                                >
                                <td className="td-ppb">{item.id}</td>
                                <td className="td-ppb">{item.name}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <h2 className="ai4-text-subtitle">지역별 온도 데이터</h2>
                            <table className="ai4-motion-table">
                                <thead className="ai4-table-thead">
                                <tr>
                                    <th className="ai4-table-tr-th">{`date(날짜)`}</th>
                                    <th className="ai4-table-tr-th">봄 평균기온</th>
                                    <th className="ai4-table-tr-th">여름 평균기온</th>
                                    <th className="ai4-table-tr-th">가을 평균기온</th>
                                    <th className="ai4-table-tr-th">겨울 평균기온</th>
                                </tr>
                                </thead>
                                <tbody className="ai4-table-tbody">
                                {regionTemperatureData.slice(0, 10).map((item, index) => (
                                    <tr
                                        key={index}
                                        className="ai4-table-tbody-tr"
                                    >
                                    <td className="td-ppb">{item.year}</td>
                                    <td className="td-ppb">{item.spring}</td>
                                    <td className="td-ppb">{item.summer}</td>
                                    <td className="td-ppb">{item.autumn}</td>
                                    <td className="td-ppb">{item.winter}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                            <h2 className="mt-3 ml-[320px]">출처 | 기상청</h2>
                        </div>
                </div>
            </div>
        </motion.div>
    );
};

export default AI4;