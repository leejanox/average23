import { useEffect, useState } from "react";
import { SectionID } from "components/types/type";
import { motion } from "framer-motion";
import imageData from "data/images.json"; 

interface CarouselProps {
  value: SectionID;
}

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
      <img
        alt={`${section}_img_${curr + 1}`}
        src={`/images/${section}/${images[curr]}`}
        className="w-auto h-[700px]"
      />
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
