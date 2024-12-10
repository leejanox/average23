import { Routes, Route } from "react-router";
import MainPage from "pages/mainPage";
import DescriptionPage from "pages/descriptionPage";
import LoginPage from "pages/loginPage";
import SignUpPage from "pages/signupPage";
import DownloadPage from "pages/downloadPage";
import AuthRoute from "components/context/authRouter";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/main" element={<MainPage />} />
      <Route path="/description" element={<DescriptionPage />} />
      <Route 
        path="/login" 
        element={<LoginPage />} 
      />
      <Route 
        path="/signup" 
        element={<SignUpPage />} 
      />
      
      <Route
        path="/download"
        element={<AuthRoute><DownloadPage /></AuthRoute>}
      />
    </Routes>
  );
};

export default Router;
