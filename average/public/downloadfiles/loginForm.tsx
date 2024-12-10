import { useAuth } from "components/context/authContext";
import { useState } from "react";
import Input from "./input";
import SubmitButton from "components/buttons/submitbutton";

const LoginForm = () => {
  const [isEmail, setIsEmail] = useState<string>("");
  const [isPw, setIsPw] = useState<string>("");
  const { Login } = useAuth(); 

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.name === "email" ? setIsEmail(e.target.value) : setIsPw(e.target.value);
  };

  const SubmitHandler = async () => {
    if (!isEmail || !isPw) {
      alert("이메일과 비밀번호를 입력하세요.");
      return;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(isEmail)) {
      alert("유효한 이메일 주소를 입력하세요.");
      return;
    }

    try {
      await Login(isEmail, isPw); 
      window.location.href = "/description";
    } catch (error) {
      alert("로그인에 실패했습니다.");
    }
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault(); 
    SubmitHandler();
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="login-form-container"
    >
      <div className="login-input-area">
        <Input
          id="email"
          type="email"
          name="email"
          placeholder="Enter your email @ email.com"
          onChange={handleChangeInput}
        />
        <Input
          id="password"
          type="password"
          name="password"
          placeholder="Enter your password"
          onChange={handleChangeInput}
        />
      </div>
      <div className="mt-10">
        <SubmitButton SubmitHandler={()=>SubmitHandler} />
      </div>
    </form>
  );
};

export default LoginForm;
