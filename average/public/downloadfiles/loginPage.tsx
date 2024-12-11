import LoginDeco from "components/form/loginDeco";
import LoginForm from "components/form/loginForm";
import MainLayout from "components/layouts/mainLayout";
import ForgetID from "components/form/forgetID";
import ForgetPW from "components/form/forgetPW";
import { Link } from "react-router-dom";
import {useState} from "react";

const LoginPage=()=>{

    const [isForgetIDOpen, setIsForgetIDOpen] = useState(false);
    const [isForgetPWOpen,setIsForgetPWOpen] = useState(false);

    return(
        <MainLayout>
            <div className="login-wrap">
                {isForgetIDOpen && <ForgetID isOpen={isForgetIDOpen} onClose={() => setIsForgetIDOpen(false)} />}
                {isForgetPWOpen && <ForgetPW isOpen={isForgetPWOpen} onClose={()=> setIsForgetPWOpen(false)}/>}

                {isForgetIDOpen ||isForgetPWOpen === true?"":
                <div>
                    <LoginDeco/>
                    <LoginForm/>
                <div className="login-link-group">
                    <div className="forget-link">
                        <Link
                            to="#"
                            onClick={(e:React.MouseEvent<HTMLAnchorElement>)=>setIsForgetIDOpen(true)}
                            className="link"
                        >
                            Forgot email
                        </Link>
                        <span className="text-white">&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;</span>
                        <Link
                            to="#"
                            onClick={(e:React.MouseEvent<HTMLAnchorElement>)=>setIsForgetPWOpen(true)}
                            className="link"
                        >
                            Forget Password?
                        </Link>
                    </div>
                    <div className="linking-signup">
                        <Link 
                            to="/signup"
                            className="text-white"
                        >
                            Don’t have an account?
                        </Link>
                        <Link 
                            to="/signup"
                            className="link-signup"
                        >
                            Sign Up!
                        </Link>
                    </div>
                </div>
                </div>
                }
            </div>
        </MainLayout>
    );
}

export default LoginPage;