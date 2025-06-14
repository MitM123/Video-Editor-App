import { Play } from "lucide-react";
import video1 from "../../../assets/video1.mp4";
import video2 from "../../../assets/video2.mp4";
import video3 from "../../../assets/video3.mp4";

const Videos = () => {
    const videoSources = [video1, video2, video3];
    
    return (
        <div className="grid grid-cols-2 gap-4">
            {videoSources.map((video, index) => (
                <div 
                    key={index} 
                    className="relative aspect-video bg-gradient-to-br from-blue-200 to-purple-200 rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform"
                >
                    <video 
                        src={video} 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-10 transition-all">
                        <Play className="w-8 h-8 text-white" />
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Videos;