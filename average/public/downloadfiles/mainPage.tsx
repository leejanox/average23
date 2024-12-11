import MainLayout from "components/layouts/mainLayout";
import LinkButton from "components/buttons/linkbutton";
import StarsBackground from "components/contents/starBackground";
import { useNavigate } from "react-router-dom";
import profile from "images/profile.png";

const MainPage =()=>{

    const navigate=useNavigate();

    return(
        <MainLayout>
            <StarsBackground/>
            <div className="absolute w-full bottom-28 z-10 text-center space-y-6">
                <LinkButton Link={()=>navigate("/description",{replace:true})} text="Get Started" classname="link-button-main"/>
                <div className="text-white text-xs center space-x-8">
                    <div className="fr -space-x-4">
                        {Array.from({length:5}).map((_,index)=>(
                            <img key={index} alt="img" src={profile} className="w-8 h-8 rounded-full overflow-clip"/>
                        ))}
                    </div>
                    <span>project를 만든 과정들이 들어있어요.</span>
                </div>
            </div>
        </MainLayout>
    );
}

export default MainPage;