import Header from "../Components/Header";
import Preview from "../Components/Preview";
import SideBar from "../Components/SideBar/SideBar";
import TimeLine from "../Components/TimeLine/TimeLine";

const Editor = () => {
    return (
        <div className="flex flex-col h-screen bg-gray-100 text-gray-800 overflow-hidden">
            <div>
                <Header />
            </div>

            <div className="flex flex-1 w-full overflow-hidden">
                <div className="flex h-full">
                    <SideBar />
                </div>

                <div className="flex flex-col flex-1 h-full overflow-hidden">
                    <div className="flex-1 bg-primary overflow-auto">
                        <Preview />
                    </div>

                    <div className="h-64 bg-secondary overflow-y-auto shadow-inner">
                        <TimeLine />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Editor;