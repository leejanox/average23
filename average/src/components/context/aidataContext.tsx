import { createContext, useContext, useState } from "react";
import { DataContextType,industryDataType,cityDataType ,regionTemperatureDataType} from "components/types/aiDataType";



const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [industryData, setIndustryData] = useState<industryDataType[]>([]);
  const [cityData, setCityData] = useState<cityDataType[]>([]);
  const [regionTemperatureData, setRegionTemperatureData] = useState<regionTemperatureDataType[]>([]);

  return (
    <DataContext.Provider
      value={{
        industryData,
        cityData,
        regionTemperatureData,
        setIndustryData,
        setCityData,
        setRegionTemperatureData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("Context 프로바이더 써서 제대로 쓰셈");
  }
  return context;
};
