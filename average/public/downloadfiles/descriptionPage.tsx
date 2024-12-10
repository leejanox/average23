import AIContent from "components/ai/aiContent";
import LinkButton from "components/buttons/linkbutton";
import Carousel from "components/contents/carousel";
import MainLayout from "components/layouts/mainLayout";
import { SectionID } from "components/types/type";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const DescriptionPage = () => {

    const navigate=useNavigate();

  const sections: SectionID[] = [
    "Main",
    "Description",
    "UI_UX_Design",
    "Web_Architecture",
    "API_Integration_Database",
    "Machine_Learning",
    "Download"
  ];

  const [selectSection, setSelectSection] = useState<SectionID>("Description");

  const handleSelectSection = (value: SectionID) => {
    switch(value){
      case "Main":
        navigate("/main");
        break;
      case "Download":
        navigate("/download");
        break;
      default:
        setSelectSection(value);
    }
  };

  useEffect(()=>{
    //console.log("description selectSection: ",selectSection);
  },[selectSection])

  return (
    <MainLayout>
      {selectSection==="Machine_Learning"?(
        <div className="ai-content-container">
          <div className="ai-menu">
              {sections.map((section, index) => (
                <div key={section}>
                  <LinkButton
                    classname={`link-button-ai
                      ${section === selectSection ? 
                        "" 
                        : 
                        "link-button-ainot"
                      }`
                    }
                    section={section}
                    handleSelectSection={()=>handleSelectSection(section)}
                    text={`#_0${index} ${section}`}
                  />
                </div>
              ))}
          </div>
          <div>
            <AIContent/>
          </div>
        </div>
      ):(
        <div className="description-content-container">
          <div className="description-l-content">
            <Carousel value={selectSection} />
          </div>
          <div className="description-r-content">
            <h1>카테고리</h1>
            {sections.map((section, index) => (
              <div key={section}>
                <LinkButton
                  classname={`link-button ${section === selectSection ? "" : "noDes"}`}
                  section={section}
                  handleSelectSection={()=>handleSelectSection(section)}
                  text={`#_0${index} ${section} ${section === selectSection ? "" : "->"}`}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default DescriptionPage;
