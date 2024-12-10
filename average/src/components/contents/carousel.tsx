import { useEffect, useState } from "react";
import { SectionID } from "components/types/type";
import { motion } from "framer-motion";
import imageData from "data/images.json"; 

import API1 from "average/public/images/API_Integration_Database/API_1.jpg";
import API2 from "average/public/images/API_Integration_Database/API_2.jpg";
import API3 from "average/public/images/API_Integration_Database/API_3.jpg";
import API4 from "average/public/images/API_Integration_Database/API_4.jpg";
import API5 from "average/public/images/API_Integration_Database/API_5.jpg";
import API6 from "average/public/images/API_Integration_Database/API_6.jpg";
import API7 from "average/public/images/API_Integration_Database/API_7.jpg";
import API8 from "average/public/images/API_Integration_Database/API_8.jpg";
import API9 from "average/public/images/API_Integration_Database/API_9.jpg";
import API10 from "average/public/images/API_Integration_Database/API_10.jpg";
import API11 from "average/public/images/API_Integration_Database/API_11.jpg";
import API12 from "average/public/images/API_Integration_Database/API_12.jpg";
import API13 from "average/public/images/API_Integration_Database/API_13.jpg";

interface CarouselProps {
  value: SectionID;
}

const APIImages=[
  API1,
  API2,
  API3,
  API4,
  API5,
  API6,
  API7,
  API8,
  API9,
  API10,
  API11,
  API12,
  API13,
]

const Carousel: React.FC<CarouselProps> = ({ value }) => {
  const [section, setSection] = useState<SectionID>("Description");
  const [curr, setCurr] = useState<number>(0);
  const images = imageData[section] || [];

  useEffect(() => {
    setSection(value);
    setCurr(0);
  }, [value]);

  const Prev = () => {
    setCurr((prev) => (prev - 1 + images.length) % images.length);
  };

  const Next = () => {
    setCurr((next) => (next + 1) % images.length);
  };

  const handleAreaClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const clickX = e.clientX;
    const elementWidth = e.currentTarget.offsetWidth;
    if (clickX < elementWidth / 2) {
        Prev();
    } else {
        Next();
    }
  };
  
  return (
    <motion.div
      id="Slider"
      key={curr}
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: false }}
      transition={{
        ease: "easeIn",
        duration: 1,
        x: { duration: 0.5 }
      }}
      className="px-10 py-7 relative"
      onMouseDown={handleAreaClick}  
      onContextMenu={(e) => e.preventDefault()}
    >
      {(section==="API_Integration_Database"?(
        <img
          alt={`${section}_img_${curr + 1}`}
          src={`/images/${section}/${APIImages[curr]}`}
          className="w-auto h-[700px]"
        />
      ):(
        <img
          alt={`${section}_img_${curr + 1}`}
          src={`/images/${section}/${images[curr]}`}
          className="w-auto h-[700px]"
        />
      ))}
      <div className="carousel-indicator"> 
        {images.map((_, index) => ( 
          <div 
            key={index} 
            className={`indicator ${ index === curr ? "bg-purple-500" : "bg-gray-300" }`} 
          ></div> 
        ))} 
      </div>
    </motion.div>
  );
};

export default Carousel;
