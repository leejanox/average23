export type originUsageType={ //시군구별 전력 사용량 2017~2020
    year:number; //연도
    city:string; //시도
    attempt:string; //시군구
    month:{
        usage:number; //전력 사용량
    }; //월
}

export type industryDataType={ //계약종별
    id:number;
    name:string;
}

export type cityDataType={ //시도
    id:number;
    name:string;
}

export type regionTemperatureDataType = { //지역별 기온
    year: number;
    spring: number;
    summer: number;
    autumn: number;
    winter: number;
};

export type DataContextType = {
    industryData: industryDataType[];
    cityData: cityDataType[];
    regionTemperatureData: regionTemperatureDataType[];
    setIndustryData: React.Dispatch<React.SetStateAction<industryDataType[]>>;
    setCityData: React.Dispatch<React.SetStateAction<cityDataType[]>>;
    setRegionTemperatureData: React.Dispatch<React.SetStateAction<regionTemperatureDataType[]>>;
  };