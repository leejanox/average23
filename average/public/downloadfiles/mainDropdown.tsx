import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MainDropDownProps {
  options: string[]; 
  SelectOption:()=>void;
}

const MainDropDown = ({ options ,SelectOption}: MainDropDownProps) => {

  const [isOpen, setIsOpen] = useState<boolean>(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDropDown=()=>setIsOpen((prev=>!prev));

  const handleSelectOption = (option: string) => {
    SelectOption();
    setIsOpen(false);
  };

  const DropDownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ClickOutSide = (e: MouseEvent) => {
      if (DropDownRef.current && !DropDownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", ClickOutSide);
    return () => {
      document.removeEventListener("mousedown", ClickOutSide);
    };
  }, []);

  return (
    <div ref={DropDownRef} className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-transparent"
      >
        <span className="text-sm text-white pl-4 py-2">{options[0]}▼</span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, scale: 0.95, y: -5 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.95, y: -5 }} 
            transition={{ duration: 0.2 }} 
            className="absolute -left-14 z-10 mt-2 w-20 bg-transparent border rounded-md shadow-lg"
          >
            {options.map((option, index) => (
              <li
                key={index}
                onClick={() => handleSelectOption(option)
                }
                className="px-4 border-b-1 hover:underline text-white"
              >
                {option.toUpperCase()}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MainDropDown;
