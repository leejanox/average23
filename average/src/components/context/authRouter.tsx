import { Navigate } from "react-router-dom";
import { useAuth } from "./authContext";

interface AuthRouteProps{
    children:React.ReactNode;
}

const AuthRoute: React.FC<AuthRouteProps> = ({children}) => {
    const { isLogined, isChecking } = useAuth();

    if (isChecking) {
        return <div>Loading...</div>; 
    }

    if (!isLogined) {
        return <Navigate to="/login" />;
    }
    
    return <>{children}</>; 
};

export default AuthRoute;
