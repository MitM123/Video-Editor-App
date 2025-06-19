import { Undo2, Redo2, Upload } from 'lucide-react';
import logo from '../../assets/logo.jpg';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../Slices/store';
import { ActionCreators } from 'redux-undo';
import { addWatermark, adjustVideoSpeed, applyVideoEffect, trimVideo, addImageOverlay } from '../../Helper/ffmpegUtils';
import { useState } from 'react';
import { setProcessedVideo } from '../../Slices/Video/Video.slice';

interface HeaderControlsProps {
    projectName: string;
    onProjectNameChange: (name: string) => void;
    onExportClick: () => void;
    splitPoints?: { startTime: number; endTime: number; }[];
}

const HeaderControls = ({ projectName, onProjectNameChange, onExportClick, splitPoints = [] }: HeaderControlsProps) => {
    const dispatch = useDispatch();
    const { past, future } = useSelector((state: RootState) => state.shapes);
    const { uploadedVideos } = useSelector((state: RootState) => state.video);
    const texts = useSelector((state: RootState) => state.text.texts);
    const images = useSelector((state: RootState) => state.image.uploadedImages);
    const [processing, setProcessing] = useState(false);
    const playbackSpeed = useSelector((state: RootState) => state.video.playbackSpeed) || 1;

    const processVideo = async () => {
        if (!uploadedVideos.length) return console.error('No video available');

        try {
            setProcessing(true);
            const currentVideo = uploadedVideos[0];
            if (!currentVideo.url) throw new Error('Invalid video URL');

            let processedVideoUrl = currentVideo.url;
            let result;

            if (splitPoints.length) {
                const { startTime, endTime } = splitPoints[splitPoints.length - 1];
                result = await trimVideo(processedVideoUrl, startTime, endTime - startTime);
                if (!result) throw new Error('Trim failed');
                processedVideoUrl = updateProcessedUrl(result, processedVideoUrl, currentVideo.url);
            }

            if (currentVideo.appliedEffect) {
                result = await applyVideoEffect(processedVideoUrl, currentVideo.appliedEffect);
                if (!result) throw new Error('Effect failed');
                processedVideoUrl = updateProcessedUrl(result, processedVideoUrl, currentVideo.url);
            }

            if (playbackSpeed !== 1) {
                result = await adjustVideoSpeed(processedVideoUrl, playbackSpeed);
                if (!result) throw new Error('Speed adjustment failed');
                processedVideoUrl = updateProcessedUrl(result, processedVideoUrl, currentVideo.url);
            }

            for (const image of images) {
                if (!image.url) continue;
                result = await addImageOverlay(processedVideoUrl, image.url, { x: 30, y: 30 });
                if (!result) throw new Error('Image overlay failed');
                processedVideoUrl = updateProcessedUrl(result, processedVideoUrl, currentVideo.url);
            }

            for (const text of texts) {
                result = await addWatermark(processedVideoUrl, {
                    text: text.content,
                    position: { x: text.position.x.toString(), y: text.position.y.toString() },
                    style: {
                        fontSize: text.style.fontSize,
                        fontColor: text.style.color,
                        opacity: 1
                    }
                });
                if (!result) throw new Error('Text overlay failed');
                processedVideoUrl = updateProcessedUrl(result, processedVideoUrl, currentVideo.url);
            }

            if (result) {
                dispatch(setProcessedVideo({
                    url: currentVideo.url,
                    processedUrl: processedVideoUrl,
                    processedData: result
                }));
                return result;
            }
            return null;
        } catch (error) {
            console.error('Processing error:', error);
            alert('Processing failed. Please try again.');
            return null;
        } finally {
            setProcessing(false);
        }
    };

    const updateProcessedUrl = (result: Uint8Array, currentUrl: string, originalUrl: string) => {
        const blob = new Blob([result], { type: 'video/mp4' });
        if (currentUrl !== originalUrl) URL.revokeObjectURL(currentUrl);
        return URL.createObjectURL(blob);
    };

    const handleExport = async () => {
        const currentVideo = uploadedVideos[0];
        if (!currentVideo) return console.error('No video available');

        try {
            const processedResult = await processVideo();
            const exportUrl = processedResult
                ? URL.createObjectURL(new Blob([processedResult.buffer], { type: 'video/mp4' }))
                : currentVideo.processedUrl;

            if (exportUrl) {
                const a = document.createElement('a');
                a.href = exportUrl;
                a.download = `${projectName || 'edited'}-video.mp4`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(exportUrl);
            } else {
                onExportClick();
            }
        } catch (error) {
            console.error('Export error:', error);
            alert('Export failed. Please try again.');
        }
    };

    return (
        <div className="flex items-center font-dmsans justify-between px-8 py-2 bg-[#f1f3f4] flex-shrink-0 shadow-sm">
            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-5">
                    <img src={logo} alt="Logo" className="rounded-full w-10 h-10 object-cover" />
                    <input
                        type="text"
                        value={projectName}
                        onChange={(e) => onProjectNameChange(e.target.value)}
                        className="w-32 px-3 py-1.5 bg-white/80 rounded-lg text-center text-slate-700 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="Project Name"
                    />
                </div>
            </div>

            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-white/80 rounded-lg px-2 py-1 shadow-sm">
                    <button
                        className={`p-1.5 hover:bg-gray-100 rounded-md ${!past.length ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={() => dispatch(ActionCreators.undo())}
                        disabled={!past.length}
                    >
                        <Undo2 className="w-5 h-5 text-gray-600" />
                    </button>
                    <button
                        className={`p-1.5 hover:bg-gray-100 rounded-md ${!future.length ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={() => dispatch(ActionCreators.redo())}
                        disabled={!future.length}
                    >
                        <Redo2 className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                <button
                    onClick={handleExport}
                    className="flex items-center cursor-pointer space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-md shadow-md hover:shadow-lg"
                    disabled={!uploadedVideos.length || processing}
                >
                    <Upload className="w-4 h-4" />
                    <span className="text-sm font-semibold">{processing ? 'Processing...' : 'Export'}</span>
                </button>
            </div>
        </div>
    );
};

export default HeaderControls;