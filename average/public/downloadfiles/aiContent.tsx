import { motion } from "framer-motion";
import AI1 from "./ai1";
import AI2 from "./ai2";
import { useState, useEffect } from "react";
import TRYMODEL from "./trymodel2";
import AI3 from "./ai3";
import AI4 from "./ai4";
import AI5 from "./ai5";
import AI6 from "./ai6";
import AI7 from "./ai7";
import AI8 from "./ai8";
import AI9 from "./ai9";

const Nodes: React.ReactNode[] = [<AI2 />, <AI3 />, <AI4 />, <AI5 />,<AI6/>,<AI7/>,<AI8/>,<AI9/>];

const AIContent = () => {
  
  const [render, setRender] = useState<"first" | "wktpgl" | "try">("first");
  const [visible,setVisible]=useState<boolean>(false);

  const GoToTop=()=>{
    window.scrollTo({
      top:0,
      behavior:"smooth",
    });
  };

  const handleClick = (value: string) => {
    if (value !== render) {
      value === "wktpgl" ? setRender("wktpgl") : setRender("try");
    }
  };

  useEffect(() => {
    setRender("first");
  }, []);
  useEffect(()=>{
    if(render==="wktpgl"){
      setVisible(true);
    }
  },[render])

  const handleRender = () => {
    switch (render) {
      case "wktpgl":
        return (
          <div>
            {Nodes.map((Node, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {Node}              
                <span className='ai-text-scroll'>밑으로 스크롤!<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓↓</span>
                {visible&&(
                  <button className="ai-gotop" onClick={GoToTop}>&nbsp;&nbsp;&nbsp;↑↑<br/>위로 스크롤!</button>
                )}
              </motion.div>
            ))}
          </div>
        );
      case "try":
        return <TRYMODEL/>;
      default:
        return <AI1 handleClick={handleClick} />;
    }
  };

  return (
    <motion.div
      className={`ai-content`}
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: false }}
      transition={{
        ease: "easeIn",
        duration: 1,
        x: { duration: 0.5 },
      }}
    >
      {handleRender()}
    </motion.div>
  );
};

export default AIContent;
