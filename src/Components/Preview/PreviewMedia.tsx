import PreviewVideos from './PreviewVideos';
import PreviewImages from './PreviewImages';
import PreviewStickers from './PreviewStickers';
import PreviewText from './PreviewText';
import PreviewShapes from './PreviewShapes';


const PreviewMedia = () => {
    return (
        <div className="flex flex-col items-center justify-center font-monasans font-semibold p-4">
            <PreviewShapes />
            <PreviewText />
            <PreviewStickers />
            <PreviewVideos />
            <PreviewImages />
        </div>
    );
};

export default PreviewMedia;