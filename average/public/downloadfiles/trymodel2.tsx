import { useState } from "react";
import Slider from "react-slider";
import axios from "axios";
import LinkButton from "components/buttons/linkbutton";
import PredictionChart from "./predictChart";

const djqwhddhqtus = ["주택용", "교육용", "산업용", "농사용", "가로등"];
const wldurdhqtus = [
    "서울특별시", "부산광역시", "대구광역시", "인천광역시", "광주광역시",
    "대전광역시", "울산광역시", "경기도", "강원도", "충청북도",
    "충청남도", "전라북도", "전라남도", "경상북도", "경상남도",
    "제주특별자치도", "세종특별자치시", "황해북도"
];

const TRYMODEL = () => {
    const [c, setC] = useState(djqwhddhqtus[0]); 
    const [r, setR] = useState(wldurdhqtus[0]); 
    const [t, setT] = useState(0); 
    const [date, setDate] = useState(""); 
    const [err, setErr] = useState(""); 

    const ChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        const dateRegex = /^\d{4}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])$/;

        setDate(value);
        if (!dateRegex.test(value) && value.length === 8) {
            setErr("날짜 형식을 맞춰주세요! Ex) YYYYMMDD");
        } else {
            setErr("");
        }
    };

    const [predictions, setPredictions] = useState<number[] | null>(null);
    const [loading, setLoading] = useState(false); 

    const handleSubmit = async () => {

        //x_features = df[["Year", "Contracttype", "City", "Attempt","spring","Summer","Fall","Winter"]] 
        //특성 순서 -> 연, 월 , 일 , 업종, 지역, 평균 기온 (민찬이가 수정했다는 버전)
        const features = [Number(date.slice(0,4)),Number(date.slice(4,6)),Number(date.slice(6,8)),djqwhddhqtus.indexOf(c), wldurdhqtus.indexOf(r),t];
        setLoading(true); 
        setPredictions(null);
        try {
            const result = await sendPredictionRequest(features);
            setPredictions(result);
        } catch (error) {
            console.error("예측요청 실패: ", error);
        } finally {
            setLoading(false); 
        }
    };

    const sendPredictionRequest = async (features: number[]) => {
        try {
            const response = await axios.post("http://localhost:5000/api/predict", {
                features,
            });
            return response.data.predictions;
        } catch (error) {
            console.error("Error while fetching predictions:", error);
            throw error;
        }
    };

    return (
        <div className="try-ai">
            <h1 className="try-ai-title">"저희가 만든 전력 사용량 예측 모델을 사용해보세요!"</h1>
            <div className="try-ai-left">
                <h1 className="try-ai-left-subtitle">
                    입력값 {date.slice(0,4)}년 ,{date.slice(4,6)}월 ,{date.slice(6,8)}일, 
                    {c}, {r}, {t}°C 로 예측한 결과입니다
                </h1>
                <div className="try-ai-left-content">
                    {loading ? (<h1>예측 중입니다... 잠시만 기다려 주세요! ⏳</h1>
                    ) : 
                        predictions ? (<PredictionChart predictions={predictions} />

                        ) : (
                            <h1>예측 결과가 여기에 표시됩니다.</h1>
                        )}
                </div>
                <LinkButton
                        Link={() => handleSubmit()}
                        text={"예측 시작!"}
                        classname="link-button-try-ai"
                    />
            </div>
            <div className="try-ai-right">
                <div className="try-ai-wldurquf">
                    <label className="try-ai-subtitle">1_ 어느 지역의 전력 사용량을 예측하고 싶으신가요?</label>
                    <select
                        value={r}
                        onChange={(e) => setR(e.target.value)}
                        className="try-ai-wldurquf2"
                    >
                        {wldurdhqtus.map((item, index) => (
                            <option key={index} value={item}>
                                {`${index + 1}번 옵션 : ${item}`}
                            </option>
                        ))}
                    </select>
                    <h1 className="try-wldur-result">현재 선택된 지역: {r}</h1>
                </div>
                <div className="try-ai-dhseh">
                    <label className="try-ai-subtitle">2_ 전력 사용량을 예측하고 싶은 날의 평균 기온은 몇도인가요?</label>
                    <h2 className="try-dhseh-text1">평균 최저 온도 : -10°C</h2>
                    <Slider
                        min={-10}
                        max={30}
                        value={t}
                        onChange={(value: number | number[]) => setT(value as number)}
                        className="try-ai-dhseh-slider"
                        thumbClassName="dhseh-slider-thumb"
                        trackClassName="dhseh-slider-track"
                    />
                    <h2 className="try-dhseh-text2">평균 최고 온도 : 30°C</h2>
                    <h1 className="try-dhseh-result">현재 선택 온도: {t}°C</h1>
                </div>
                <div className="try-ai-djqwhd">
                    <label className="try-ai-subtitle">3_ 어떤 업종에서 사용되는 전력양을 예측하시겠습니까?</label>
                    <select
                        value={c}
                        onChange={(e) => setC(e.target.value)}
                        className="try-ai-djqwhd2"
                    >
                        {djqwhddhqtus.map((option, index) => (
                            <option key={index} value={option}>
                                {`${index + 1}번 옵션 : ${option}`}
                            </option>
                        ))}
                    </select>
                    <h1 className="try-djqwhd-result">현재 선택된 업종: {c}</h1>
                </div>
                <div className="try-ai-date">
                    <label className="try-ai-subtitle">4_ 전력 사용량을 예측하고 싶은 날짜를 입력해주세요!</label>
                    <h2 className="try-ai-input-des">날짜 입력: </h2>
                    <input
                        name="date"
                        value={date}
                        onChange={ChangeInput}
                        placeholder="YYYYMMDD"
                        className="try-ai-date-input"
                    />
                    <h1 className="try-ai-input-result1">현재 입력된 날짜: {date}</h1>
                    {err && <h1 className="try-ai-input-result3">{err}</h1>}
                </div>
            </div>
        </div>
    );
};

export default TRYMODEL;

/*                <div className="try-ai-left">
                    {loading ? (
                        <p>예측 중입니다... 잠시만 기다려 주세요! ⏳</p>
                    ) : predictions ? (
                        <div>
                            <h2>예측 결과:</h2>
                            <ul>
                                {predictions.map((prediction, index) => (
                                    <li key={index}>{`결과 ${index + 1}: ${prediction}`}</li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <p>예측 결과가 여기에 표시됩니다.</p>
                    )}
                    <LinkButton Link={()=>handleSubmit()} text={"예측 시작!"} classname="link-button-main"/>
                </div> */