import g from "images/icons/google.png";
import a from "images/icons/apple.png";

const LoginDeco=()=>{
    return(
        <div className="login-deco-container">
            <h1 className="text-white-title">Hello, <span className="logo-gradient">Everyone!</span></h1>
            <h2 className="text-gray-content">로그인 하시면 저희가 만든 프로젝트 파일들을 다운로드 하실 수 있어요!</h2>
            <div className="login-socialdeco-group">
                <div className="login-socialdeco">
                    <img alt="google" src={g} className="image-sm"/>
                    <button className="text-[#9c9c9c]">Sign In with Google</button>
                </div>
                <div className="login-socialdeco">
                    <img alt="apple" src={a} className="w-[18px] h-[18px]"/>
                    <button className="text-[#9c9c9c]">Sign In with Apple</button>
                </div>
            </div>
            <div className="fr-c gap-2"> 
                <div className="line"></div>
                <div className="text-[#616161]">or continue with e-mail</div>
                <div className="line"></div>
            </div>
        </div>
    );
}

export default LoginDeco;