import video1 from "../../../assets/video1.mp4";
import video2 from "../../../assets/video2.mp4";
import video3 from "../../../assets/video3.mp4";

const Videos = () => {
    const videoSources = [video1, video2, video3];

    return (
        <div className="grid grid-cols-1 gap-4">
            {videoSources.map((video, index) => (
                <div
                    key={index}
                    className="relative aspect-video bg-gradient-to-br from-blue-200 to-purple-200 rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform"
                >
                    <video
                        src={video}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                        }}
                        muted
                        playsInline
                    />
                </div>
            ))}
        </div>
    )
}

export default Videos;