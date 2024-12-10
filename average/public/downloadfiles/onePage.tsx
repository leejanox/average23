import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainFooter from "components/main/mainFooter";
import UserSideBar from "components/onepage/userSideBar";
import NavSection from "components/onepage/navSection";
import Carousel from "components/onepage/carousel";
import DowmloadSection from "components/onepage/downloadSection";

const OnePage = () => {
  const [updateFavorite, setUpdateFavorite] = useState<string>("default");
  const [activeSectionStatus, setActiveSectionStatus] = useState<string>("Nav");
  const navigate = useNavigate();

  const handleUpdateFavorite = (favoriteStatus: string) => {
    setUpdateFavorite(favoriteStatus);
    if (favoriteStatus === "update") {
      setTimeout(() => setUpdateFavorite("default"), 500); // 0.5초 후 초기화
    }
  };

  useEffect(() => {
    setUpdateFavorite("update"); // 첫 렌더링 시 선호작 리스트 로드 트리거
  }, []);

  const renderContent = () => {
    switch (activeSectionStatus) {
      case "UI_UX_Design":
      case "Web_Architecture":
      case "API_Integration":
      case "Machine_Learning":
      case "Database":
        return <Carousel section={activeSectionStatus} />;
      case "Download":
        return (
          <DowmloadSection
            section={activeSectionStatus}
            hadleUpdateFavorite={handleUpdateFavorite}
          />
        );
      default:
        return <NavSection sendActiveSection={setActiveSectionStatus} />;
    }
  };

  return (
    <div className="relative w-full h-screen bg-mainBG">
      <div className="absolute left-0">
        <UserSideBar updateFavorite={updateFavorite} />
      </div>
      <div className="absolute left-[400px] h-screen">
        {renderContent()}
      </div>
      <footer className="absolute w-full bottom-12">
        <MainFooter />
      </footer>
    </div>
  );
};

export default OnePage;
