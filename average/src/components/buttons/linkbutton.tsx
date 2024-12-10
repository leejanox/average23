import { SectionID } from "components/types/type";

interface LinkButtonProps{
    section?:SectionID;
    handleSelectSection?:(value:SectionID)=>void;
    Link?:()=>void;
    text?:string;
    classname?:string;
}

const LinkButton:React.FC<LinkButtonProps>=({Link,text,classname,handleSelectSection,section})=>{

    const handleClick=()=>{
        if(Link){
            Link();
        }
        if(handleSelectSection&&section){
            handleSelectSection(section);
        }
    }

    return(
        <button
            onClick={handleClick}
            className={`${classname}`}
        >
            {text}
        </button>
    );
}

export default LinkButton;