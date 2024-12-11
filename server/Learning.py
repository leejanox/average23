import numpy as np
import pandas as pd
import torch
import torch.nn as nn
from sklearn.preprocessing import MinMaxScaler
from torch.utils.data import DataLoader, Dataset
import mysql.connector
import matplotlib.pyplot as plt
import joblib
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import sys
import random as ra

# 모델과 스케일러 경로
MODEL_PATH = './lstm_model.pth'
SCALER_PATH = './scaler.pkl'

# 저장된 모델 구조와 동일한 하이퍼파라미터 설정
features = ['year', 'month', 'day', 'Contracttype', 'Attempt', 'Temperature']
INPUT_DIM = len(features)  # 입력 차원 (features의 개수)
HIDDEN_DIM = 64  # 은닉 뉴런 수
OUTPUT_DIM = 1  # 출력 차원
NUM_LAYERS = 3  # 저장된 모델의 LSTM 레이어 수

# 모델 정의
class LSTMModel(nn.Module):
    def __init__(self, input_dim, hidden_dim, output_dim, num_layers):
        super(LSTMModel, self).__init__()
        self.lstm = nn.LSTM(input_dim, hidden_dim, num_layers, batch_first=True, dropout=0.2, bidirectional=False)
        self.fc1 = nn.Linear(hidden_dim, hidden_dim // 2)
        self.fc2 = nn.Linear(hidden_dim // 2, output_dim)

    def forward(self, x):
        _, (hn, _) = self.lstm(x)
        hn = hn[-1]  # 마지막 LSTM 레이어의 hidden state
        out = torch.relu(self.fc1(hn))  # 첫 번째 은닉층 추가
        out = self.fc2(out)  # 출력층
        return out

# 모델 초기화 및 저장된 가중치 로드
model = LSTMModel(INPUT_DIM, HIDDEN_DIM, OUTPUT_DIM, NUM_LAYERS)
model.load_state_dict(torch.load(MODEL_PATH, weights_only=True))
model.eval()

# 스케일러 로드
scaler = joblib.load(SCALER_PATH)

# 새로운 입력 데이터 예측 함수
def predict_new(model, scaler, input_data):
    # 입력 데이터에 Usage 더미 값 추가
    input_data_with_dummy = input_data + [0]  # Usage는 0으로 설정
    input_scaled = scaler.transform([input_data_with_dummy])[:, :-1]  # Usage는 제외
    input_tensor = torch.tensor(input_scaled, dtype=torch.float32).unsqueeze(0)
    predicted_scaled = model(input_tensor).detach().numpy()
    predicted_original = scaler.inverse_transform(
        np.concatenate((input_scaled, predicted_scaled), axis=1)
    )[0, -1]
    return predicted_original

# 콘솔 입력을 통한 데이터 예측
def get_user_input_and_predict():
    try:
        data_list = []
        randata = []
        # 리스트 형태로 데이터 입력받기
        user_input = sys.argv[1]
        input_data = eval(user_input)  # 문자열을 리스트로 변환
        if not isinstance(input_data, list) or len(input_data) != 6:
            raise ValueError("Input must be a list of six numerical values.")
        input_data[0] = 2020
        # input_data[4] = 1
        # print(input_data)
        for i in range(1,13):
            input_data[1] = i
            # input_data[3] = 1
            input_data[3] = [2, 4, 3, 1, 5, 2, 1, 5, 5, 1, 5, 2][i-1]#ra.randint(1,5)
            randata.append(input_data[3])
            #input_data[5] = 5.9
            predicted_value = predict_new(model, scaler, input_data)
            data_list.append(predicted_value)
        print(f"{data_list}")
        print(randata)
    except Exception as e:
        print(f"Error: {e}. Please enter a valid input list.")

# 사용자 입력 데이터 예측
get_user_input_and_predict()
