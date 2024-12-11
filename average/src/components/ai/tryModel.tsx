import { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

interface TryModelProps {
  predictions: number[];
}

const TryModel = () => {
  const [features, setFeatures] = useState([0, 0, 0]);
  const [predictionResult, setPredictionResult] = useState<number[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const featureRanges = [
    { min: 2010, max: 2025 },
    { min: 1, max: 5 },     
    { min: 0, max: 100 }, 
  ];

  const handleFeatureChange = (index: number, value: number) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post<TryModelProps>('/api/predict', {
        features,
      });
      setPredictionResult(response.data.predictions);
    } catch (err) {
      setError('Failed to get predictions.');
    } finally {
      setLoading(false);
    }
  };
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
          <motion.div
            className="w-full max-w-lg p-6 bg-white rounded-xl shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h1 className="text-3xl font-semibold text-center text-blue-600">저희가 만든 AI 모델로 원하는 연도의 전력 사용량을 에측해보세요!</h1>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex flex-col">
                  <label className="text-gray-700">
                    {index === 0? '연도 (2010-2025)': index === 1? '계약 유형 (1-5)': '도시 (0-100)'}
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="range"
                      min={featureRanges[index].min}
                      max={featureRanges[index].max}
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, parseFloat(e.target.value))}
                      className="w-full"
                    />
                    <span>{feature}</span>
                  </div>
                </div>
              ))}
              <button
                type="submit"
                className={`w-full p-2 mt-4 text-white rounded-md ${loading ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'}`}
                disabled={loading}
              >
                {loading ? '로딩 중...' : '예측 받기'}
              </button>
            </form>
    
            {error && (
              <motion.div
                className="mt-4 text-red-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {error}
              </motion.div>
            )}
    
            {predictionResult && (
              <motion.div
                className="mt-6 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h2 className="text-xl font-medium text-blue-600">예측 결과</h2>
                <div className="mt-4 text-lg text-gray-700">
                  {predictionResult.map((prediction, index) => (
                    <p key={index}>예측 {index + 1}: {prediction.toFixed(2)} kWh</p>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
    );
};

export default TryModel;