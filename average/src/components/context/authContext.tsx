import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

type AuthContextType = {
  isLogined: boolean;
  userInfo: { id: number; name: string; email: string } | null;
  Login: (email: string, password: string) => Promise<void>;
  Logout: () => Promise<void>;
  isChecking: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("컨텍스트 없음");
  }
  return context;
};

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const [userInfo, setUserInfo] = useState<{ 
    id: number, 
    name: string,
    email: string 
  } | null>(null);
  const [isLogined, setIsLogined] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(true); // 로그인 상태 확인 중 여부

  // 서버에 로그인 요청
  const Login = async (email: string, password: string) => {
    try {
      const response = await axios.post("http://localhost:5000/api/login", { email, password });
          // user 정보를 localStorage에 저장
      const user=response.data.user;
      localStorage.setItem("userInfo", JSON.stringify(user));
      //console.log("서버 응답: ",response.data);
      //const user = response.data.username;
      //console.log("유저 이름: ",user);
      setUserInfo(response.data.user);
      setIsLogined(true);
    } catch (error) {
      console.error("로그인 실패:", error);
      throw new Error("로그인에 실패했습니다.");
    }
  };

  // 서버에 로그아웃 요청
  const Logout = async () => {
    try {
      await axios.post("http://localhost:5000/api/logout");
      localStorage.removeItem("userInfo");
      setUserInfo(null);
      setIsLogined(false);
      window.location.href="/main";
    } catch (error) {
      console.error("로그아웃 실패:", error);
      throw new Error("로그아웃에 실패했습니다.");
    }
  };

  // 로그인 상태 확인
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/check-auth");
        const storedUser = localStorage.getItem("userInfo");
        if (storedUser&&response.data.user) {
          setUserInfo(JSON.parse(storedUser));
        //if (response.data.user) {
          //setUserInfo(response.data.user);
          setIsLogined(true);
        } else {
          setIsLogined(false);
        }
      } catch (error) {
        console.error("로그인 상태 확인 실패:", error);
        setIsLogined(false);
        setUserInfo(null);
        /* 이거 주석 해제하는 순간 지옥임; */
        //await Logout(); // 로그아웃 함수 호출
        //alert("세션이 만료되었습니다. 다시 로그인해주세요.");
        //window.location.href="/login"; // 로그인 페이지로 이동 
      } finally {
        setIsChecking(false); // 로그인 상태 확인 완료
      }
    };

    checkLoginStatus();
  }, []);
  //  [setIsChecking, setIsLogined, setUserInfo, Logout, history]
  // return null;
  return (
    <AuthContext.Provider value={{ isLogined, Login, Logout, userInfo, isChecking }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
