import { Undo2, Redo2, Upload } from 'lucide-react';
import logo from '../../assets/logo.jpg';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../Slices/store';
import { ActionCreators } from 'redux-undo';
import { addWatermark, adjustVideoSpeed } from '../../Helper/ffmpegUtils';
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
    const playbackSpeed = useSelector((state: RootState) => state.video.playbackSpeed) || 1;

    const processVideo = async () => {
        if (!uploadedVideos.length) {
            console.error('No video available to process');
            return null;
        }

        try {
            setProcessing(true);
            console.log('Starting video processing...');
            const currentVideo = uploadedVideos[0];
            
            // Validate video URL
            if (!currentVideo.url) {
                throw new Error('Invalid video URL');
            }

            let processedVideoUrl = currentVideo.url;
            let result;

            if (playbackSpeed !== 1) {
                try {
                    console.log('Adjusting video speed...');
                    result = await adjustVideoSpeed(processedVideoUrl, playbackSpeed);
                    if (!result) {
                        throw new Error('Failed to adjust video speed - no result returned');
                    }
                    const blob = new Blob([result], { type: 'video/mp4' });
                    if (processedVideoUrl !== currentVideo.url) {
                        URL.revokeObjectURL(processedVideoUrl);
                    }
                    processedVideoUrl = URL.createObjectURL(blob);
                    console.log('Speed adjustment completed successfully');
                } catch (error: any) {
                    console.error('Error adjusting video speed:', error);
                    setProcessing(false);
                    throw error;
                }
            }

            // Process images first if present
            if (images.length > 0) {
                try {
                    console.log(`Processing ${images.length} images...`);
                    for (const image of images) {
                        if (!image.url) {
                            console.warn('Skipping image with invalid URL');
                            continue;
                        }
                        console.log('Processing image overlay...');
                        result = await addImageOverlay(processedVideoUrl, image.url, {
                            x: image.position.x,
                            y: image.position.y
                        });

                        if (!result) {
                            throw new Error('Failed to process image overlay - no result returned');
                        }
                        const blob = new Blob([result], { type: 'video/mp4' });
                        if (processedVideoUrl !== currentVideo.url) {
                            URL.revokeObjectURL(processedVideoUrl);
                        }
                        processedVideoUrl = URL.createObjectURL(blob);
                        console.log('Image overlay completed successfully');
                    }
                } catch (error) {
                    console.error('Error processing image overlay:', error);
                    setProcessing(false);
                    throw error;
                }
            }

            // Process texts if present
            if (texts.length > 0) {
                try {
                    console.log(`Processing ${texts.length} text overlays...`);
                    for (const text of texts) {
                        console.log('Processing text overlay...');
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

                        if (!result) {
                            throw new Error('Failed to process text overlay - no result returned');
                        }
                        const blob = new Blob([result], { type: 'video/mp4' });
                        if (processedVideoUrl !== currentVideo.url) {
                            URL.revokeObjectURL(processedVideoUrl);
                        }
                        processedVideoUrl = URL.createObjectURL(blob);
                        console.log('Text overlay completed successfully');
                    }
                } catch (error) {
                    console.error('Error processing text overlay:', error);
                    setProcessing(false);
                    throw error;
                }
            }

            if (result || (playbackSpeed !== 1 && processedVideoUrl !== currentVideo.url)) {
                console.log('Finalizing video processing...');
                const finalResult = result || await adjustVideoSpeed(processedVideoUrl, playbackSpeed);
                if (!finalResult) {
                    throw new Error('Failed to get final video result');
                }
                dispatch(setProcessedVideo({
                    url: currentVideo.url,
                    processedUrl: processedVideoUrl,
                    processedData: finalResult
                }));
                console.log('Video processing completed successfully');
                return finalResult;
            }

            return null;
        } catch (error: any) {
            console.error('Error processing video:', error);
            setProcessing(false);
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