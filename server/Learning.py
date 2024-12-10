import torch
import torch.nn as nn
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sqlalchemy import create_engine
from sklearn.preprocessing import LabelEncoder, MinMaxScaler
from sklearn.metrics import mean_squared_error, mean_absolute_error
from torch.utils.data import DataLoader, TensorDataset
from scipy import stats
import numpy as np
from sklearn.metrics import r2_score
import mysql.connector
import sys
from sqlalchemy import create_engine

# 5. 모델 정의 (LSTM 제거하고 MLP 사용)
class ElectricityUsagePredictor(nn.Module):
    def __init__(self, feature_size, hidden_size=64, output_size=12):
        super(ElectricityUsagePredictor, self).__init__()
        self.fc1 = nn.Linear(feature_size, hidden_size)
        self.relu1 = nn.ReLU()
        self.fc2 = nn.Linear(hidden_size, hidden_size)
        self.relu2 = nn.ReLU()
        self.fc3 = nn.Linear(hidden_size, output_size)

    def forward(self, x_features):
        out = self.fc1(x_features)
        out = self.relu1(out)
        out = self.fc2(out)
        out = self.relu2(out)
        out = self.fc3(out)
        return out

# MySQL 서버에 연결
# connection = mysql.connector.connect(
#     host='localhost',          # 호스트 주소 (예: 'localhost')
#     user='root',       # 사용자명
#     password='1234',    # 비밀번호
#     database='electricity',
#     charset="utf8mb4"
# )
engine = create_engine('mysql+pymysql://root:1234@localhost:3306/electricity')
try:
    # cursor = connection.cursor()

    # 1. MySQL 데이터 불러오기 및 데이터프레임 생성

    # Create a cursor to interact with the MySQL server
    #2017~2020
    # cursor.execute("use `electricity`")
    # cursor.execute("ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '1234';")
    df = pd.read_sql("select * from `전력소비2017~2020`", engine)
    # 데이터 전처리: 특성 및 시계열 데이터 분리
    df = df.astype('float64')
    x_features = df[["Year", "Contracttype", "City", "Attempt","spring","Summer","Fall","Winter"]]  # 특성 데이터 ,"봄","여름","가을","겨울"
    y_target = df.iloc[:, 9:].values  # Month별 데이터

    # 3. 데이터 정규화
    scaler = MinMaxScaler()
    # x_features_scaled = scaler.fit_transform(x_features)
    x_features = torch.tensor(x_features.to_numpy(), dtype=torch.float32)
    # y_target_scaled = scaler.fit_transform(y_target)
    y_target = torch.tensor(y_target, dtype=torch.float32)

    # 4. 이상치 탐지 및 제거 (IQR 방법 사용)
    # y_target의 IQR 계산
    Q1 = np.percentile(y_target.numpy(), 30, axis=0)
    Q3 = np.percentile(y_target.numpy(), 70, axis=0)
    IQR = Q3 - Q1

    # 이상치 조건 설정
    lower_bound = Q1 - 1.5 * IQR
    upper_bound = Q3 + 1.5 * IQR

    # 이상치가 아닌 데이터만 선택
    filtered_entries = ~((y_target.numpy() < lower_bound) | (y_target.numpy() > upper_bound)).any(axis=1)

    x_features_filtered = x_features[filtered_entries]
    y_target_filtered = y_target[filtered_entries]

    # 모델 인스턴스 생성
    feature_size = x_features_filtered.size(1)
    model = ElectricityUsagePredictor(feature_size)

    # 모델 가중치 로드
    model.load_state_dict(torch.load('./final_50Percent.pth', weights_only=True))


    # 모델을 평가 모드로 설정
    model.eval()

    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    model.to(device)

    # y_true_np = y_true.cpu().numpy()  # GPU에서 CPU로 이동
    # y_pred_np = y_pred.cpu().numpy()  # GPU에서 CPU로 이  동
    # r2 = r2_score(y_true_np, y_pred_np)

    # print(f"R² 스코어: {r2:.4f}")
    #[2020, 1, 1, 1,12.0,23.9,14.1,0.9]
    #입력 데이터 2020 1  1  1 12.0 23.9 14.1 0.9
    # data = input("예측 데이터 입력").split(",")
    data = sys.argv #.split(",")
    # print([float(x.strip()) for x in data[1:]])
    x_features_new = torch.tensor([float(x.strip()) for x in data[1:]], dtype=torch.float32).to(device)  # 예시 특성 데이터 ,12.0,23.9,14.1,0.9

    with torch.no_grad():
        y_new_pred = model(x_features_new)

    # print("예측 결과 (다음 해의 Month별 전기 사용량):")
    print(y_new_pred.flatten().cpu().numpy())  # GPU에서 CPU로 이동하여 결과 출력
except Exception as e:
    print(f"모델 로드 오류: {e}")
    exit(1)