import DownloadTable from "components/download/downloadTable";
import UserSideBar from "components/download/userSideBar";
import MainLayout from "components/layouts/mainLayout";
import { useState,useEffect } from "react";
import axios from "axios";
import { useAuth } from "components/context/authContext";

type FavoriteFiletype = {
    u_id: number;
    f_info: { f_id: number; filename: string; sectiontype: string };
}

const DownloadPage=()=>{

    const [favorites, setFavorites] = useState<FavoriteFiletype[]>([]);
    const { userInfo } = useAuth();
    const userId = userInfo?.id;

    const fetchFavorites = async () => {
      try {
          const res = await axios.post("http://localhost:5000/api/favoritelist", { userId });
          if (res.status === 200) {
              setFavorites(res.data.favorites);
          } else {
              console.error("즐겨찾기 데이터를 가져오지 못했습니다.");
          }
      } catch (error) {
          console.error("즐겨찾기 데이터 불러오기 실패:", error);
      }
    };

    useEffect(() => {
      if (userId) {
          fetchFavorites();
      }
    }, [userId]);

    const handleFavoriteFile = (value: FavoriteFiletype, remove = false) => {
        if (remove) {
          setFavorites((prevFavorites) =>
            prevFavorites.filter((fav) => fav.f_info.f_id !== value.f_info.f_id)
          );
        } else {
          setFavorites((prevFavorites) => {
            const isAlreadyFavorite = prevFavorites.some(
              (fav) => fav.f_info.f_id === value.f_info.f_id
            );
            if (!isAlreadyFavorite) {
              return [...prevFavorites, value];
            }
            return prevFavorites;
          });
        }
      };
    
    return(
        <MainLayout>
            <div className="downloadpage-container">
                <UserSideBar favoriteFiles={favorites} handleFavoriteFile={handleFavoriteFile}/>
                <DownloadTable favoriteFiles={favorites} handleFavoriteFile={handleFavoriteFile}/>
            </div>
        </MainLayout>
    );
}

export default DownloadPage;