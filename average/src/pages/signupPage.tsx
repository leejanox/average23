import MainLayout from "components/layouts/mainLayout";
import SignUpForm from "components/form/signupForm";
import { useState } from "react";

const SignUpPage = () => {
    const [isChecked, setIsChecked] = useState<boolean>(false);

    const handleClick = () => {
        setIsChecked((prev) => !prev);
    };

    return (
        <MainLayout>
            <div className="signup-page-container relative flex flex-col items-center">
                <h1 className="mt-16 logo-gradient text-4xl font-bold">Sign Up Now!</h1>
                <h2 className="mt-6 text-lg text-white">회원가입하면 게살버거 비법소스 볼 수 있음!</h2>
                <form className="mt-10 w-[800px]">
                    <SignUpForm isChecked={isChecked}/>
                </form>
                <div className="flex flex-row justify-center items-center mt-8 gap-4">
                    <button
                        onClick={handleClick}
                        className={`agree-btn ${isChecked ? "checked" : ""}`}
                        aria-pressed={isChecked}
                    >
                        {isChecked ? "✔" : ""}
                    </button>
                    <p className="text-sm text-white underline mt-2">
                        <a href="#">개인 정보 처리방침 및 이용 동의</a>
                    </p>
                </div>
            </div>
        </MainLayout>
    );
};

export default SignUpPage;
