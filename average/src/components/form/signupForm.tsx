import SubmitButton from "components/buttons/submitbutton";
import Input2 from "./input2";
import { useState, useEffect } from "react";
import axios from "axios";

interface SignUpFormProps{
  isChecked:boolean;
}

const SignUpForm:React.FC<SignUpFormProps> = ({isChecked}) => {
    const [info, setInfo] = useState({
        name: "",
        birth: "",
        email: "",
        phone: "",
        password: "",
        passwordconfirm: "",
    });

    const [error, setError] = useState({
        name: "",
        birth: "",
        email: "",
        phone: "",
        password: "",
        passwordconfirm: "",
    });

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInfo({ ...info, [name]: value });
    };

    useEffect(() => {
        const newError = { ...error };

        if (info.email) {
            newError.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(info.email) ? "" : "유효한 이메일 주소를 입력하세요.";
        }
        if (info.birth) {
            newError.birth = /^\d{8}$/.test(info.birth) ? "" : "생년월일은 YYYYMMDD 형식으로 입력하세요.";
        }
        if (info.password) {
            newError.password =
                info.password.length >= 5 && info.password.length <= 10
                    ? ""
                    : "비밀번호는 5~10자리 사이로 입력하세요.";
        }
        if (info.passwordconfirm) {
            newError.passwordconfirm =
                info.password === info.passwordconfirm ? "" : "비밀번호가 일치하지 않습니다.";
        }
        setError(newError);
    }, [info]);

    useEffect(()=>{
      console.log("체크? : ",isChecked);
    },[isChecked])

    const onSubmit = async () => {
        if (Object.values(error).some((err) => err !== "")||isChecked===false) {
            alert("모든 입력값을 올바르게 작성해주세요.");
            return;
        }

        const signupForm = {
            username: info.name,
            birth: info.birth,
            email: info.email,
            phone: info.phone,
            password: info.password,
        };

        try {
            const res = await axios.post(`http://localhost:5000/api/signup`, signupForm, {
                headers: { "Content-Type": "application/json" },
            });
            if (res.status === 200) {
                alert("회원가입 성공");
                window.location.href="/login";
            }
        } catch (error) {
            console.error("회원가입 오류:", error);
            alert("회원가입에 실패했습니다.");
        }
    };

    return (
        <div className="flex flex-col items-center w-full">
            <div className="grid grid-cols-2 gap-x-[180px] gap-y-16 w-[800px] mt-10">
                {Object.keys(info).map((key, index) => (
                    <div key={index} className="flex flex-col items-start">
                        <label className="text-sm font-bold text-gray-300">{key}</label>
                        <Input2
                            id={key}
                            type={key}
                            name={key}
                            placeholder={`${key}을 입력하세요`}
                            value={info[key as keyof typeof info]}
                            onChange={onChange}
                        />
                        <span className="mt-2 text-xs text-red-400">{error[key as keyof typeof error]}</span>
                    </div>
                ))}
            </div>
            <div className="mt-8">
                <SubmitButton SubmitHandler={() => onSubmit()} />
            </div>
        </div>
    );
};

export default SignUpForm;
