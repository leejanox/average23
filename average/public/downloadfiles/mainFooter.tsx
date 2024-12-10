import git from "images/githubicon.png";

const MainFooter=()=>{
    return(
        <footer className="relative w-full text-gray-400">
            <span className="absolute text-sm top-4 left-6">© 2024 average 23  Inc.</span>
            <div className="absolute top-0 right-6 flex flex-row gap-3">
                <span className="text-sm pt-3">Kim Go-eun & Kim Min-chan</span>
                <a href="https://github.com/leejanox">
                    <img alt="git" src={git} className="w-10 h-10"/>
                </a>
            </div>
        </footer>
    );
}

export default MainFooter;