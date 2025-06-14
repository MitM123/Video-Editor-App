import Header from "../Components/Header"
import Preview from "../Components/Preview"
import SideBar from "../Components/SideBar"
import TimeLine from "../Components/TimeLine"

const Editor = () => {
    return (
        <div className="flex flex-col h-screen bg-gray-100 text-gray-800 overflow-hidden">
            <div>
                <Header />
            </div>

            <div className="flex w-full h-full">
                <div>
                    <SideBar />
                </div>

                <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex-1 bg-primary overflow-hidden">
                        <Preview />
                    </div>

                    <div className="h-48 bg-secondary  overflow-y-auto shadow-inner">
                        <TimeLine />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Editor