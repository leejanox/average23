import MainFooter from "components/main/mainFooter";
import SignUpForm from "components/signup/signupForm";
import SignUpHeader from "components/signup/signupHeader";

const SignUpPage = ()=>{
    return(
        <div className="relative bg-mainBG w-full h-screen">
            <header className="p-10">
                <SignUpHeader/>
            </header>
            <h1 className="absolute top-32 left-[780px] logo-gradient text-4xl font-bold">Sign Up Now!</h1>
            <form className="absolute top-52 left-[440px] text-center">
                <SignUpForm/>
                <div className="space-x-3">
                    <button className="rounded-3xl bg-white border w-[10px] h-[10px]"></button>
                    <span className="text-xs text-white underline">개인 정보 처리방침 및 이용 동의</span>
                </div>
            </form>
            <footer className="absolute bottom-12 w-full">
                <MainFooter/>
            </footer>
        </div>
    );
}

export default SignUpPage;