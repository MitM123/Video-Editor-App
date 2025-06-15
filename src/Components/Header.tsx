import { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../Slices/store';
import HeaderControls from './Export/HeaderControls';
import ExportQualityModal from './Export/ExportQualityModal';
import ExportProcessingModal from './Export/ExportProcessingModal';
import ExportCompleteModal from './Export/ExportCompleteModal';
import { toast } from 'sonner';

const Header = () => {
    const [projectName, setProjectName] = useState('New Project');
    const [exportState, setExportState] = useState<'idle' | 'selecting-quality' | 'processing' | 'ready'>('idle');
    const [selectedQuality, setSelectedQuality] = useState<'720p' | '1080p'>('1080p');
    const [processedVideo, setProcessedVideo] = useState<{
        url: string;
        name: string;
        size: string;
    } | null>(null);

    const uploadedVideos = useSelector((state: RootState) => state.video.uploadedVideos);

    const handleExportClick = () => {
        if (uploadedVideos.length === 0) {
            toast.error('Please upload a video first.');
            return;
        }
        setExportState('selecting-quality');
    };

    const handleQualitySelect = async (quality: '720p' | '1080p') => {
        setSelectedQuality(quality);
        setExportState('processing');

        try {
            const video = uploadedVideos[0];
            const videoElement = document.createElement('video');
            videoElement.src = video.url;
            await new Promise((resolve) => {
                videoElement.onloadedmetadata = resolve;
            });

            const processedUrl = await processVideo(videoElement, quality);

            setProcessedVideo({
                url: processedUrl,
                name: `${projectName.replace(/\s+/g, '-')}-${quality}.mp4`,
                size: '1.0 MB'
            });
            setExportState('ready');
        } catch (error) {
            console.error('Export failed:', error);
            alert('Export failed. Please try again.');
            setExportState('idle');
        }
    };

    const processVideo = async (videoElement: HTMLVideoElement, quality: string): Promise<string> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(videoElement.src);
            }, 2000);
        });
    };

    const handleDownload = () => {
        if (!processedVideo) return;
        const a = document.createElement('a');
        a.href = processedVideo.url;
        a.download = processedVideo.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setExportState('idle');
    };

    const handleNewExport = () => {
        if (processedVideo) {
            URL.revokeObjectURL(processedVideo.url);
        }
        setProcessedVideo(null);
        setExportState('idle');
    };

    return (
        <>
            <HeaderControls
                projectName={projectName}
                onProjectNameChange={setProjectName}
                onExportClick={handleExportClick}
            />

            {exportState === 'selecting-quality' && (
                <ExportQualityModal
                    selectedQuality={selectedQuality}
                    onQualitySelect={handleQualitySelect}
                    onClose={() => setExportState('idle')}
                />
            )}

            {exportState === 'processing' && (
                <ExportProcessingModal selectedQuality={selectedQuality} />
            )}

            {exportState === 'ready' && processedVideo && (
                <ExportCompleteModal
                    processedVideo={processedVideo}
                    onDownload={handleDownload}
                    onEditAgain={() => setExportState('idle')}
                    onNewExport={handleNewExport}
                />
            )}
        </>
    );
};

export default Header;