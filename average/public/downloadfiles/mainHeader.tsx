import logo from "images/logo.png";
import { useAuth } from "components/context/authContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import MainDropDown from "components/buttons/mainDropdown";

const MainHeader = () => {
    const { isLogined, userInfo, isChecking,Logout } = useAuth(); 
    const navigate = useNavigate();

    useEffect(()=>{
        console.log("로그인 사용자 정보: ",userInfo);
    },[userInfo])

    if (isChecking) {
        return (
            <div className="relative w-full h-[80px] z-10">
                <div className="absolute top-6 left-[44px]">
                    <a href="/main" className="flex flex-row gap-6">
                        <img alt="logo" src={logo} className="w-12 h-12" />
                        <span className="py-1.5 text-gray-300 font-medium text-2xl">AVERAGE 23</span>
                    </a>
                </div>
                <div className="absolute top-6 right-[44px] text-white">
                    <span>Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full h-[80px] z-10">
            <div className="absolute top-6 left-[44px]">
                <a href="/main" className="flex flex-row gap-6">
                    <img alt="logo" src={logo} className="w-12 h-12" />
                    <span className="py-1.5 text-gray-300 font-medium text-2xl">AVERAGE 23</span>
                </a>
            </div>
            {isLogined && userInfo ? (
                <div className="absolute top-6 right-[60px] text-white">
                    <span className="text-[#fab9ca] text-xl">햄부기부기</span><span className="text-xl"> {userInfo.name}!</span>
                    <MainDropDown options={["","로그아웃!"]} SelectOption={()=>Logout()}/>
                </div>
            ) : (
                <div className="absolute top-6 right-[44px] flex flex-row">
                    <button
                        onClick={() => navigate("/login")}
                        className="py-1.5 text-gray-300 font-medium text-2xl">
                        login
                    </button>
                    <p className="py-1.5 text-gray-300 font-medium text-2xl">&nbsp;|&nbsp;</p>
                    <button
                        onClick={() => navigate("/signup")}
                        className="py-1.5 text-gray-300 font-medium text-2xl">
                        signup
                    </button>
                </div>
            )}
        </div>
    );
};

export default MainHeader;
