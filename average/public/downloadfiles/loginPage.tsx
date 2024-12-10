import LoginFooter from "components/login/loginFooter";
import LoginForm from "components/login/loginform";
import SocialLogin from "components/login/socialLogin";
import LoginHeader from "components/login/loginHeader";
import { Link } from "react-router";
import { useState } from "react";
import Forget from "components/login/forget";

const LoginPage=()=>{

    const [isModalOpen, setIsModalOpen] = useState(false);

    return(
        <div className="relative main w-full h-screen bg-loginBG font-Ubuntu">
            {isModalOpen && <Forget onClose={() => setIsModalOpen(false)} />}
            <header className="py-10 px-10">
                <LoginHeader/>
            </header>
            <form className="absolute bottom-52 left-56">
                <div className="absolute w-full top-0 text-center">
                    <h1 className="text-4xl text-white font-bold">Hello, <span className="logo-gradient">Everyone!</span></h1>
                    <h4 className="text-white text-xs mt-4">로그인 하시면 저희가 만든 project를 보실 수 있어요! </h4>
                    <div className="mt-10 ml-16">
                        <SocialLogin/>
                    </div>
                    <div className="absolute top-44 left-10 flex flex-row space-x-4">
                        <div className="w-[220px] border-b-[1px] border-spacing-2 border-gray-400 bg-transparent"></div>
                        <span className="text-xs text-gray-400">or continue with e-mail</span>
                        <div className="w-[220px] border-b-[1px] border-spacing-2 border-gray-400 bg-transparent"></div>
                    </div>
                </div>
                <LoginForm/>
                <Link 
                    to="#"
                    onClick={(e) => {e.preventDefault(); setIsModalOpen(true);}} 
                    className="absolute bottom-24 left-[246px] logo-gradient text-sm font-medium">Forgot email? or Password?</Link>
                <div className="absolute bottom-10 left-[200px] text-gray-400 text-sm">
                    Don’t have an account?
                    <Link to="/signup" className="logo-gradient pl-4 font-bold text-sm">Sign Up</Link>
                </div>
            </form>
            <footer className="flex absolute bottom-0">
                <LoginFooter/>
            </footer>
        </div>
    );
}

export default LoginPage;