import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "components/context/authContext";
import folder_icon from "images/icons/folder_icon.png";
import profile from "images/profile.png";

type FavoriteFiletype = {
  u_id: number;
  f_info: { f_id: number; filename: string; sectiontype: string };
}

interface UserSideBarProps {
  favoriteFiles: FavoriteFiletype[];
  handleFavoriteFile: (value: FavoriteFiletype, remove?: boolean) => void;
}

const UserSideBar: React.FC<UserSideBarProps> = ({ favoriteFiles, handleFavoriteFile }) => {
  const { userInfo, Logout } = useAuth();
  const [isFavoriteFiles, setIsFavoriteFiles] = useState<FavoriteFiletype[]>(favoriteFiles);
  const userId = userInfo?.id;

  useEffect(() => {
    setIsFavoriteFiles(favoriteFiles);
  }, [favoriteFiles]);

  const handleRemoveFavorite = async (fileId: number) => {
    try {
      const res = await axios.post("http://localhost:5000/api/removeFavorite", {
        userId,
        fileId,
      });
      if (res.status === 200) {
        setIsFavoriteFiles((prevFavorites) =>
          prevFavorites.filter((file) => file.f_info.f_id !== fileId)
        );
        handleFavoriteFile({ u_id: userId!, f_info: { f_id: fileId, filename: "", sectiontype: "" } }, true);
        alert("즐겨찾기에서 파일 삭제 성공");
      }
    } catch (error) {
      console.error("즐겨찾기 삭제 실패:", error);
      alert("즐겨찾기 삭제 실패");
    }
  };

  return (
    <div className="relative w-[400px] h-screen border-r-[1px] border-opacity-10 text-white">
      <div className="absolute top-18 left-[44px] w-[310px] h-[700px]">
        <div className="absolute top-4 left-[14px] border-b-[3px] rounded-md w-[280px] h-[90px] pl-4 pt-4">
          <img alt="profile" src={profile} className="absolute top-[21px] w-12 h-12 rounded-full" />
          <div className="absolute top-6 left-[80px] text-white text-md flex flex-col gap-0">
            <p className="text-sm">{userInfo?.name}</p>
            <p>{userInfo?.email}</p>
          </div>
          <div className="absolute top-12 right-4 text-xs">
            <button 
              className="text-xs hover:underline"
              onClick={()=>Logout()}
            >
              로그아웃!
            </button>
          </div>
        </div>
        <div className="absolute top-[140px] left-[20px] text-white">
          <h1 className="absolute left-[10px] text-2xl font-medium">My_Favorite</h1>
          {isFavoriteFiles.length > 0 ? (
            <div className="absolute top-[60px] w-[248px] max-h-[500px] overflow-y-auto text-wrap space-y-3">
              <ul className="space-y-3">
                {isFavoriteFiles.map((favorite, index) => (
                  <li
                    key={`${favorite.f_info.f_id}-${index}`}
                    className="w-full h-[40px] flex flex-row gap-3 items-center pt-1.5 bg-gray-300 bg-opacity-10 rounded-lg"
                  >
                    <img alt="folder" src={folder_icon} className="w-[20px] h-[20px]" />
                    <div className="flex-1 text-md">
                      <span className={`${favorite.f_info.sectiontype==="client"?"text-purple-200":"text-teal-200"}`}>
                        {`${favorite.f_info.sectiontype}`}
                      </span>
                        : {`${favorite.f_info.filename}`}
                      </div>
                    <button
                      className="text-md text-red-500 hover:text-red-700 mr-4"
                      onClick={() => handleRemoveFavorite(favorite.f_info.f_id)}
                    >
                      삭제!
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="absolute w-[200px] top-[60px] left-[10px] text-md">
              <span>단골아님!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserSideBar;
