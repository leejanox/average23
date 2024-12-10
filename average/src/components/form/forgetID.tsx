import { useState, useRef, useEffect, forwardRef } from "react";
import axios from "axios";
import Input from "./input";

type ForgetProps = {
  isOpen: boolean;
  onClose: () => void;
};

const ForgetID = forwardRef<HTMLDivElement, ForgetProps>(({ isOpen, onClose }, ref) => {
  // useRef
  const modalRef = useRef<HTMLDivElement | null>(null);

  // sendData -> userInfo search
  const [formData, setFormData] = useState({
    username: "",
    birth: "",
    phone: "",
    email: "",
  });

  // resData -> userEmail
  const [result, setResult] = useState<string>("");

  // outside clicks :close modal
  const OutsideClick = (e: MouseEvent) => {
    e.preventDefault();
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      // modal open -> add event listener
      document.addEventListener("mousedown", OutsideClick);
      if (modalRef.current) { 
        const firstInput = modalRef.current.querySelector("input"); 
        if (firstInput) { 
          firstInput.focus(); 
        } 
      }
    } else {
      // modal close -> remove event listener
      document.removeEventListener("mousedown", OutsideClick);
    }

    // ref unmount -> remove event listener
    return () => {
      document.removeEventListener("mousedown", OutsideClick);
    };
  }, [isOpen]);

  // input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    // input name, value -> user Input
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // API find-id
  const handleFindId = async (e: React.FormEvent) => {
    e.preventDefault();  // 폼 제출을 막기 위해 preventDefault() 사용
    try {
      const res = await axios.post("http://localhost:5000/api/find-id", {
        // send formData: userInfo
        username: formData.username,
        birth: formData.birth,
        phone: formData.phone,
      });
      // result : userEmail
      setResult(`email: ${res.data.email}`);
    } catch (error) {
      alert("입력 정보와 일치하는 사용자 정보가 없습니다.");
    }
  };

  // modal isOpen:false -> close modal
  if (!isOpen) {
    return null;
  }

  return (
    <form onSubmit={handleFindId}>
      <div className="fixed-ref" ref={ref}>
        <div className="ref-title">이메일 찾기</div>
        <div ref={modalRef} className="ref-group">
          <div className="mt-2 mb-6 ref-input">
            <span>이름을 입력해주세요</span>
            <Input
              type="name"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="이름"
            />
          </div>
          <div className="mb-6 ref-input">
            <span>생년월일 8자리를 입력해주세요</span>
            <Input
              type="text"
              name="birth"
              value={formData.birth}
              onChange={handleInputChange}
              placeholder="YYYYMMDD"
            />
          </div>
          <div className="ref-input">
            <span>가입시 사용한 핸드폰 번호를 입력해주세요</span>
            <Input
              type="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="010-0000-0000"
            />
          </div>
          <button type="submit" className="mt-12 ml-4 searchbox">
            이메일 찾기
          </button>
          {<p className="text-2xl text-center font-extrabold mt-4 logo-gradient">가입 {result}</p>}
          <button onClick={onClose} className="absolute top-2 right-2 p-1 text-red-500">
            닫기
          </button>
        </div>
      </div>
    </form>
  );
});

export default ForgetID;
