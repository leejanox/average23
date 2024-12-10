import axios from 'axios';

//axios.defaults.withCredentials = true 설정은 Axios 라이브러리의 전역 설정
//모든 Axios 요청에 쿠키가 자동으로 포함되도록 하는 옵션
//클라이언트 측에서 axios를 사용하여 서버와 통신할 때, 모든 요청에 인증 쿠키가 함께 전송
//Axios를 사용하는 모든 곳에서 자동으로 적용
//App.tsx 파일이나 Axios 관련 설정 파일에서 설정

axios.defaults.withCredentials = true;


export default axios;