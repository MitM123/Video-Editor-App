import { Undo2, Redo2, Upload } from 'lucide-react';
import logo from '../../assets/logo.jpg';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../Slices/store';
import { ActionCreators } from 'redux-undo';
import { addWatermark } from '../../Helper/ffmpegUtils';
import { addImageOverlay } from '../../Helper/ffmpegUtils';
import { useState } from 'react';
import { setProcessedVideo } from '../../Slices/Video/Video.slice';

interface HeaderControlsProps {
    projectName: string;
    onProjectNameChange: (name: string) => void;
    onExportClick: () => void;
}

const HeaderControls = ({ projectName, onProjectNameChange, onExportClick }: HeaderControlsProps) => {
    const dispatch = useDispatch();
    const { past, future } = useSelector((state: RootState) => state.shapes);
    const uploadedVideos = useSelector((state: RootState) => state.video.uploadedVideos);
    const texts = useSelector((state: RootState) => state.text.texts);
    const images = useSelector((state: RootState) => state.image.uploadedImages);
    const [processing, setProcessing] = useState(false);

    const processVideo = async () => {
        if (!uploadedVideos.length) {
            console.error('No video available to process');
            return null;
        }

        try {
            setProcessing(true);
            const currentVideo = uploadedVideos[0];
            let processedVideoUrl = currentVideo.url;
            let result;

            if (texts.length > 0) {
                for (const text of texts) {
                    result = await addWatermark(processedVideoUrl, {
                        text: text.content,
                        position: {
                            x: text.position.x.toString(),
                            y: text.position.y.toString()
                        },
                        style: {
                            fontSize: text.style.fontSize,
                            fontColor: text.style.color,
                            opacity: 1
                        }
                    });

                    if (result) {
                        const blob = new Blob([result.buffer], { type: 'video/mp4' });
                        if (processedVideoUrl !== currentVideo.url) {
                            URL.revokeObjectURL(processedVideoUrl);
                        }
                        processedVideoUrl = URL.createObjectURL(blob);
                    }
                }
            }

            if (images.length > 0) {
                for (const image of images) {
                    result = await addImageOverlay(processedVideoUrl, image.url, {
                        x: image.position.x,
                        y: image.position.y
                    });

                    if (result) {
                        const blob = new Blob([result.buffer], { type: 'video/mp4' });
                        if (processedVideoUrl !== currentVideo.url) {
                            URL.revokeObjectURL(processedVideoUrl);
                        }
                        processedVideoUrl = URL.createObjectURL(blob);
                    }
                }
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
            console.error('Error processing video:', error);
            throw error;
        } finally {
            setProcessing(false);
        }
    };

    const handleExport = async () => {
        const currentVideo = uploadedVideos[0];
        if (!currentVideo) {
            console.error('No video available to export');
            return;
        }

        try {
            const processedResult = await processVideo();

            if (processedResult) {
                const blob = new Blob([processedResult.buffer], { type: 'video/mp4' });
                const url = URL.createObjectURL(blob);

                const a = document.createElement('a');
                a.href = url;
                a.download = `${projectName || 'edited'}-video.mp4`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);

                URL.revokeObjectURL(url);
            } else if (currentVideo.processedUrl) {
                const a = document.createElement('a');
                a.href = currentVideo.processedUrl;
                a.download = `${projectName || 'edited'}-video.mp4`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            } else {
                onExportClick();
            }
        } catch (error) {
            console.error('Error during video export:', error);
            alert('Failed to export video. Please try again.');
        }
    };

    return (
        <div className="flex items-center font-dmsans justify-between px-8 py-2 bg-[#f1f3f4] flex-shrink-0 shadow-sm">
            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-5">
                    <div className="w-10 h-10 flex items-center justify-center">
                        <img src={logo} alt="Logo" className='rounded-full w-full h-full object-cover' />
                    </div>
                    <input
                        type="text"
                        value={projectName}
                        onChange={(e) => onProjectNameChange(e.target.value)}
                        className="w-32 px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-lg text-center text-slate-700 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
                        placeholder="Project Name"
                    />
                </div>
            </div>

            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-white/80 rounded-lg px-2 py-1 shadow-sm">
                    <button
                        className={`p-1.5 cursor-pointer hover:bg-gray-100 rounded-md transition-colors ${!past.length ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title="Undo"
                        onClick={() => dispatch(ActionCreators.undo())}
                        disabled={!past.length}
                    >
                        <Undo2 className="w-5 h-5 text-gray-600" />
                    </button>
                    <button
                        className={`p-1.5 cursor-pointer hover:bg-gray-100 rounded-md transition-colors ${!future.length ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title="Redo"
                        onClick={() => dispatch(ActionCreators.redo())}
                        disabled={!future.length}
                    >
                        <Redo2 className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                <button
                    onClick={handleExport}
                    className="flex items-center space-x-2 cursor-pointer px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-md transition-all shadow-md hover:shadow-lg"
                    disabled={!uploadedVideos.length || processing}
                >
                    <Upload className="w-4 h-4" />
                    <span className='text-sm font-semibold'>{processing ? 'Processing...' : 'Export'}</span>
                </button>
            </div>
        </div>
    );
};

export default HeaderControls;