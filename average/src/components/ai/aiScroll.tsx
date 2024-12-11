import { useEffect, useState } from "react";
import { motion } from "framer-motion"

interface AISCrollProps {
    children:React.ReactNode;
}

const AISCroll: React.FC<AISCrollProps> = ({children}) => {
    const [curr, setCurr] = useState<number>(0);
    const [node, setNode] = useState<React.ReactNode[]>([]);

    useEffect(()=>{
        if(children){
            setNode([children]);
        }
    },[children])

    const Prev = () => {
        setCurr((prev) => (prev - 1 + node.length) % node.length);
    };

    const Next = () => {
        setCurr((next) => (next + 1) % node.length);
    };

    const handleMouseToggle = (e: React.MouseEvent) => {
        if (e.button === 0) {
        Next();
        } else if (e.button === 2) {
        Prev();
        }
    };

    return (
        <motion.div
            id="Slider"
            key={curr}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{
                ease: "easeIn",
                duration: 1,
                y: { duration: 0.5 }
            }}
            onMouseDown={handleMouseToggle}  
            onContextMenu={(e) => e.preventDefault()}
            className="ai-slider"
        >
            {children}
            <span className='ai-text-scroll'>
                밑으로 스크롤!<br/>
                ↓↓
            </span>
        </motion.div>
    );
};

export default AISCroll;
