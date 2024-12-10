import { motion } from "framer-motion";

interface ScrollAnimateDivProps{
    children:React.ReactNode;
}

const ScrollAnimateDiv:React.FC<ScrollAnimateDivProps>=({children})=>{
    return(
        <motion.div 
            className="scroll-animate-div"
            initial={{opacity:0,y:80}}
            whileInView={{opacity:1,y:0}}
            viewport={{once:false}}
            transition={{
                ease:"easeInOut",
                duration:2,
                y:{duration:1},
            }}>
                {children}
        </motion.div>
    );
}

export default ScrollAnimateDiv;