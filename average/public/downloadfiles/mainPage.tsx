import MainBtn from "components/main/mainBtn";
import MainFooter from "components/main/mainFooter";
import MainHeader from "components/main/mainHeader";
import profile from "images/profile.png";
import {useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "components/context/authContext";
import StarsBackground from "components/main/starbackground";


const MainPage = ()=>{

    const [isClick,setIsClick]=useState<boolean>(false);
    const {isLogined}=useAuth();
    const navigate = useNavigate();

    const handlerBtnClick:React.MouseEventHandler<HTMLButtonElement>=()=>{
        setIsClick(true);
    };

    useEffect(()=>{
        if(isClick){
            isLogined===true?navigate("/one"):navigate("/login");
        }
    },[isClick,isLogined,navigate])

    return(
        <div className="relative w-full h-screen font-Ubuntu">
            <StarsBackground/>
            <header className="header absolute w-full top-0 py-10 px-10">
                <MainHeader/>
            </header>
            <div className="absolute w-full bottom-28 z-10 text-center flex-col space-y-6">
                <MainBtn handlerBtnClick={handlerBtnClick}/>
                <div className="text-white text-xs flex justify-center items-center space-x-8">
                    <div className="flex flex-row -space-x-4">
                        {Array.from({length:5}).map((_,index)=>(
                            <img key={index} alt="img" src={profile} className="w-8 h-8 rounded-full overflow-clip"/>
                        ))}
                    </div>
                    <span>project를 만든 과정들이 들어있어요.</span>
                </div>
            </div>
            <footer className="absolute w-full bottom-12">
                <MainFooter/>
            </footer>
        </div>
    );

}

export default MainPage;