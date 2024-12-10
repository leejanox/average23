import { useEffect, useState } from "react";
import axios from "axios";
import DropDown from "components/buttons/dropdown";
import { motion } from "framer-motion";
import { useAuth } from "components/context/authContext";

const burger = [
  "양상추",
  "토마토",
  "아메리칸치즈",
  "모짜렐라치즈",
  "볶은양파",
  "생양파",
  "피클",
  "할라피뇨",
  "베이컨",
  "소고기패티",
  "새우패티",
  "닭가슴살패티",
  "버터번",
  "케첩",
  "머스타드",
  "스리라차마요",
  "게살"
];

const getRandom = () => {
  const randomIndex = Math.floor(Math.random() * burger.length);
  return burger[randomIndex];
};


type FileListType = {
  id: number;
  sectiontype: string;
  filename: string;
  info: string;
}

type FavoriteFiletype = {
  u_id: number;
  f_info: { f_id: number; filename: string; sectiontype: string };
}

interface OptionType {
  sectiontype: string;
}

interface DownloadTableProps {
  favoriteFiles: FavoriteFiletype[];
  handleFavoriteFile: (value: FavoriteFiletype, remove?: boolean) => void;
}

const DownloadTable: React.FC<DownloadTableProps> = ({ favoriteFiles, handleFavoriteFile }) => {
  const [files, setFiles] = useState<FileListType[]>([]);
  const [options, setOptions] = useState<string[]>([]);
  const [selectOption, setSelectOption] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await axios.get<FileListType[]>(`http://localhost:5000/api/fetchfilelist`);
        setFiles(res.data);
      } catch (error) {
        console.error("fileList 불러오기 실패:", error);
      }
    };

    const fetchOptions = async () => {
      try {
        const res = await axios.get<OptionType[]>(`http://localhost:5000/api/fetchOptions`);
        const stringArrayOption = res.data.map((option) => option.sectiontype);
        setOptions(stringArrayOption);
      } catch (error) {
        console.error("dropdown options 불러오기 실패:", error);
      }
    };

    fetchFiles();
    fetchOptions();
  }, []);

  const handleSelectOption = (selectOption: string) => {
    setSelectOption(selectOption);
  };

  const filteredFiles = files
    .filter((file) => {
      const searchTermLower = searchTerm.toLowerCase();
      return (
        file.filename.toLowerCase().includes(searchTermLower) ||
        file.info.toLowerCase().includes(searchTermLower)
      );
    })
    .filter((file) => selectOption === "ALL" || file.sectiontype === selectOption);

  const { userInfo } = useAuth();
  const userId = userInfo?.id;

  const handleAddToFavorites = async (file: FileListType) => {
    try {
      const res = await axios.post("http://localhost:5000/api/addFavorite", {
        userId,
        fileId: file.id,
      });
      if (res.status === 200) {
        const addedFile = {
          u_id: userId|| 0,
          f_info: {
            f_id: file.id,
            filename: file.filename,
            sectiontype: file.sectiontype,
          },
        };
        alert(`${file.filename} add favorite 성공`);
        handleFavoriteFile(addedFile, false);
      }
    } catch (error) {
      console.error("add favorite 실패:", error);
      alert("add favorite 실패");
    }
  };

  const handleDownload = (fileId: number) => {
    window.location.href = `http://localhost:5000/api/downloadfile/${fileId}`;
  };

  return (
    <div className="downloadtable-group">
      <h1 className="downloadtable-title">게살버거 비법 소스</h1>
      <div className="text-center mb-6">
        <input
          placeholder="파일명 또는 정보로 검색"
          className="searchbox"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="downloadtable-wrap">
        <motion.table
          className="motion-table"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <thead className="table-thead">
            <tr>
              <th className="w-1/12 px-3 py-2 border-r-[1px]">
                <DropDown options={options} SelectOption={handleSelectOption} />
              </th>
              <th className="w-2/12 px-4 py-2 border-r-[1px]">File_name</th>
              <th className="w-5/12 px-4 py-2 border-r-[1px]">File_Info</th>
              <th className="w-1/12 px-4 py-2 border-r-[1px]">Favorite</th>
              <th className="w-3/12 px-4 py-2">Download</th>
            </tr>
          </thead>
          <motion.tbody
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { 
                opacity: 0, 
                y: 20 
              },
              visible: { 
                opacity: 1, 
                y: 0, 
                transition: { 
                  staggerChildren: 0.1 
                } 
              },
            }}
          >
            {filteredFiles.map((file) => {
              const isFavorite = favoriteFiles.some(
                (fav) => fav.f_info.f_id === file.id
              );
              
              const random = getRandom();

              return (
                <motion.tr
                  key={file.id}
                  className="table-tr"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <td className={`td-ppb ${file.sectiontype === "client" ? "text-purple-300" : "text-teal-200"}`}>
                    🗂️ {file.sectiontype.toUpperCase()}
                  </td>
                  <td className="td-ppb text-[#cfe7f7]">
                    💾 <span className="title-gradient">{file.filename}</span>
                  </td>
                  <td className="td-ppb text-[#effcee]">{file.info}</td>
                  <td className="td-ppb">
                    {isFavorite ? (
                      <span className="logo-gradient">이미 있어!</span>
                    ) : (
                      <button
                        data-id={file.id}
                        className="text-rose-400"
                        onClick={() => handleAddToFavorites(file)}
                      >
                        눌러!
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-2 border-b-[1px]">
                    <button
                      className="text-white  hover:text-violet-400"
                      onClick={() => handleDownload(file.id)}
                    >
                      {random}!
                    </button>
                  </td>
                </motion.tr>
              );
            })}
          </motion.tbody>
        </motion.table>
      </div>
    </div>
  );
};

export default DownloadTable;
