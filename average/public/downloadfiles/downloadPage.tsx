import DownloadTable from "components/download/downloadTable";
import UserSideBar from "components/download/userSideBar";
import MainLayout from "components/layouts/mainLayout";
import { useState } from "react";

type FavoriteFiletype = {
    u_id: number;
    f_info: { f_id: number; filename: string; sectiontype: string };
}

const DownloadPage=()=>{

    const [favorites, setFavorites] = useState<FavoriteFiletype[]>([]);

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