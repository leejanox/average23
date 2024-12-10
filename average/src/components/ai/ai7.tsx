import { useEffect, useState } from "react";
import {motion} from "framer-motion";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
//npm install --save-dev @types/react-syntax-highlighter

const slides = [
    {
        title: "1. MySQL 데이터 조회",
        description: (
            <>
                electricity 데이터베이스에서 전력소비 데이터를 가져옵니다.
            </>
            ),
        code: 
            `
                # Python MySQL 데이터 조회
                import pymysql
                import pandas as pd

                # DB 연결
                connection = pymysql.connect(
                    host='localhost',
                    user='root',
                    password='password',
                    database='electricity'
                )

                # 데이터 가져오기
                query = "SELECT * FROM electricity_consumption"
                data = pd.read_sql(query, connection)

                # 결과 출력
                print(data.head())
            `
        ,
    },
    {
        title: "2. 날짜 인덱스 변환 및 수치형 변환",
        description: (
            <>
                날짜 데이터를 처리하기 위해 날짜를 연, 월, 일로 분해하고 Pandas를 사용해 수치형 데이터로 변환합니다.
            </>
            ),
        code: 
            `
                # 날짜 인덱스 변환 및 수치형으로 변환
                data['date'] = pd.to_datetime(data['date'])
                data['year'] = data['date'].dt.year
                data['month'] = data['date'].dt.month
                data['day'] = data['date'].dt.day
            `
        ,
    },
    {
        title: "3. 데이터 스케일링",
        description: (
            <>
                MinMaxScaler를 사용하여 데이터를 [0, 1] 범위로 스케일링합니다.
            </>
            ),
        code: 
            `
                # 데이터 스케일링
                from sklearn.preprocessing import MinMaxScaler

                features = ['year', 'month', 'day', 'temperature', 'contracttype']
                target = 'usage'

                scaler = MinMaxScaler()
                data_scaled = scaler.fit_transform(data[features + [target]])
                data_scaled = pd.DataFrame(data_scaled, columns=features + [target], index=data.index)
            `
        ,
    },
    {
        title: "4. 모델 정의",
        description: (
            <>
            LSTM 모델을 PyTorch를 사용하여 정의합니다.<br/>
            작동 흐름:<br/>
                (1) 입력 시계열 데이터(x)를 LSTM 레이어에 전달하여 시간적 관계를 학습<br/>
                (2) 마지막 LSTM 레이어의 은닉상태(hn[-1])을 가져옴<br/>
                (3)은닉 상태를 두 개의 완전 연결층(fc1,fc2)에 차례로 통과시켜 최종 출력 값을 생성<br/>
            </>
            )
            ,
        code: 
            `
                # LSTM 모델 정의
                import torch.nn as nn
                import torch

                class LSTMModel(nn.Module):
                    def __init__(self, input_dim, hidden_dim, output_dim, num_layers):
                        super(LSTMModel, self).__init__()
                        self.lstm = nn.LSTM(input_dim, hidden_dim, num_layers, batch_first=True, dropout=0.2)
                        self.fc1 = nn.Linear(hidden_dim, hidden_dim // 2)
                        self.fc2 = nn.Linear(hidden_dim // 2, output_dim)

                    def forward(self, x):
                        _, (hn, _) = self.lstm(x)
                        hn = hn[-1]  # 마지막 LSTM 레이어의 hidden state
                        out = torch.relu(self.fc1(hn)) # 첫 번째 은닉층 추가
                        out = self.fc2(out) # 출력층
                        return out
            `
        ,
        },    
        {
            title: "5. 학습 함수",
            description:(
            <>
                순전파: 모델을 통해 예측 값을 생성<br/>
                손실 계산: 예측 값과 실제 값의 차이를 계산<br/>
                역전파: 손실 값을 기반으로 그래디언트를 계산<br/>
                가중치 업데이트: 그래디언트를 사용하여 모델의 파라미터를 업데이트<br/>
                손실 추적: 에포크별 손실 값을 저장하고 시각화<br/>
            </>
            ),
            code: 
                `
                    # LSTM 모델 정의
                    import torch.nn as nn
                    import torch

                    class LSTMModel(nn.Module):
                        def __init__(self, input_dim, hidden_dim, output_dim, num_layers):
                            super(LSTMModel, self).__init__()
                            self.lstm = nn.LSTM(input_dim, hidden_dim, num_layers, batch_first=True, dropout=0.2)
                            self.fc1 = nn.Linear(hidden_dim, hidden_dim // 2)
                            self.fc2 = nn.Linear(hidden_dim // 2, output_dim)

                        def forward(self, x):
                            _, (hn, _) = self.lstm(x)
                            hn = hn[-1]  # 마지막 LSTM 레이어의 hidden state
                            out = torch.relu(self.fc1(hn)) # 첫 번째 은닉층 추가
                            out = self.fc2(out) # 출력층
                            return out
                `
            ,
        },
];

const Slide = () => {

    const [curr, setCurr] = useState(0);

    const Prev = () => {
        setCurr((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const Next = () => {
        setCurr((next) => (next + 1) % slides.length);
    };

    const handleAreaClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const clickX = e.clientX;
        const elementWidth = e.currentTarget.offsetWidth;
        if (clickX < elementWidth / 2) {
            Prev();
        } else {
            Next();
        }
      };
      

    useEffect(()=>{
        setCurr(0);
        console.log("slide 길이: ",slides.length);
    },[])
    
    return (
        <div className="fc-c">
            <motion.div
                id="Slider"
                key={curr}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{
                    ease: "easeIn",
                    duration: 1,
                    y: { duration: 0.5 }
                }}
                className="ai-7-slider"
                onMouseDown={handleAreaClick}  
                onContextMenu={(e) => e.preventDefault()}
            >
                <div className="ai-7-text">
                    <p className="ai-7-text-click">Click screen!</p>
                    <h1 className="ai7-text-title"># 간단한 코드 설명 및 예측 모델 학습과정</h1>
                    <h2 className="text-3xl font-bold mb-4">{slides[curr].title}</h2>
                    <p className="ai7-text-description">{slides[curr].description}</p>
                </div>
                <SyntaxHighlighter 
                    language="python" 
                    style={vscDarkPlus}
                >
                    {slides[curr].code.trim()}
                </SyntaxHighlighter>
            </motion.div>
            <div className="ai-indicator"> 
                {slides.map((_, index) => ( 
                    <div 
                        key={index} 
                        className={`indicator ${ index === curr ? "bg-purple-500" : "bg-gray-300" }`} 
                    ></div> 
                ))} 
            </div>
        </div>
    );
};

export default Slide;
