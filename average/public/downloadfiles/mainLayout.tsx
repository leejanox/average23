import MainFooter from "./footers/mainFooter";
import MainHeader from "./headers/mainHeader";

interface MainLayoutProps{
    children:React.ReactNode;
}

const MainLayout:React.FC<MainLayoutProps>=({children})=>{
    return(
        <div className="relative w-full h-screen main-container bg-black overflow-clip">
            <header>
                <MainHeader/>
            </header>
            <div className="w-full h-auto">
                {children}
            </div>
            <footer className="absolute bottom-16 w-full">
                <MainFooter/>
            </footer>
        </div>
    );
}

export default MainLayout;