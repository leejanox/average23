import Router from "components/router";
import axios from "axios"; //앱의 시작 부분에 withCredentials 옵션을 설정하여 모든 Axios 요청에 적용
import { DataProvider } from "components/context/aidataContext";

// Axios 설정
axios.defaults.withCredentials = true;

function App() {
  return (
    <DataProvider>
      <Router/>
    </DataProvider>
  );
}

export default App;
