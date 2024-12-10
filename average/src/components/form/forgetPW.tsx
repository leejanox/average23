import axios from "axios";
import { forwardRef, useEffect, useRef, useState } from "react";
import Input from "./input";

type ForgetProps={
    isOpen:boolean;
    onClose:()=>void;
}

const ForgetPW=forwardRef<HTMLDivElement,ForgetProps>(({isOpen, onClose},ref)=>{

    const modalRef=useRef<HTMLDivElement|null>(null);

    const [isUserEmail, setIsUserEmail]=useState<string>("");
    const OutsideClick=(e:MouseEvent)=>{
        e.preventDefault();
        if(modalRef.current && !modalRef.current.contains(e.target as Node)){
            onClose();
        };
    };

    useEffect(()=>{
        if(isOpen){
            document.addEventListener("mousedown",OutsideClick);
            if (modalRef.current) { 
                const firstInput = modalRef.current.querySelector("input"); 
                if (firstInput) { 
                  firstInput.focus(); 
                } 
            }
        }else{
            document.removeEventListener("mousedown",OutsideClick);
        };

        return()=>{
            document.removeEventListener("mousedown",OutsideClick);
        }
    },[isOpen]);

    const handleInputChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
        setIsUserEmail(e.target.value);
    };

    const hadleResetPW=async()=>{
        try {
            
            console.log("이메일 입력상태: ",isUserEmail);
            const res = await axios.post("http://localhost:5000/api/resetpassword",isUserEmail);
            if(res.status===200){
                alert("입력하신 이메일로 재설정 링크를 보냈습니다. 이메일 확인 후 링크에 접속해 비밀번호를 재설정해주세요.");
            }
        } catch (error) {
            if(axios.isAxiosError(error)){
                alert(`${error.response?.data.message||"이메일 전송 실패"}`);
            }else{
                alert("이메일 전송 실패");
            };
        };
    };
    if(!isOpen){
        return null;
    }

    return(
        isOpen&&(
            <div className="fixed-ref" ref={ref}>
                <div ref={modalRef} className="ref-group">
                    <h2 className="ref-title">비밀번호 재설정을 위해 이메일을 입력해주세요</h2>
                    <Input 
                        type="email"
                        name="email"
                        onChange={handleInputChange}
                        placeholder="test@email.com"
                    />
                    <button onClick={()=>hadleResetPW()} className="mt-20 searchbox">
                        Send Reset-PW Mail
                    </button>
                    <button onClick={onClose} className="absolute top-2 right-2 p-1 text-red-500">닫기</button>
                </div>
            </div>
        )
    );
});

export default ForgetPW;