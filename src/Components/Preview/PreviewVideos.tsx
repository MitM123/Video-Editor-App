import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import type { RootState } from '../../Slices/store';
import { videoRefs } from '../Preview';
import { useEffect } from 'react';

const PreviewVideos = () => {
    const uploadedVideos = useSelector((state: RootState) => state.video.uploadedVideos);

    useEffect(() => {
        uploadedVideos.forEach((video, index) => {
            const videoElement = videoRefs[index]?.current;
            if (videoElement) {
                const currentSrc = videoElement.querySelector('source')?.src;
                const newSrc = video.processedUrl || video.url;
                
                if (currentSrc !== newSrc) {
                    videoElement.querySelector('source')!.src = newSrc;
                    videoElement.load(); 
                    videoElement.currentTime = 0; 
                }
            }
        });
    }, [uploadedVideos]);

    const getMediaStyle = (media: any) => {
        const FILTER_STYLES: Record<string, string> = {
            none: 'none',
            grayscale: 'grayscale(100%)',
            sepia: 'sepia(100%)',
            blur: 'blur(5px)',
            brightness: 'brightness(1.5)',
            contrast: 'contrast(1.5)'
        };

        const EFFECT_STYLES: Record<string, string> = {
            none: 'none',
            vintage: 'sepia(70%) brightness(80%) contrast(120%)',
            cool: 'brightness(90%) contrast(110%) hue-rotate(180deg)',
            warm: 'brightness(110%) contrast(90%) hue-rotate(-20deg)',
            cinematic: 'contrast(130%) brightness(90%) saturate(110%)',
            bw: 'grayscale(100%) contrast(120%)'
        };

        const filterStyle = media.appliedFilter ? FILTER_STYLES[media.appliedFilter] || 'none' : 'none';
        const effectStyle = media.appliedEffect ? EFFECT_STYLES[media.appliedEffect] || 'none' : 'none';

        return filterStyle !== 'none' ? filterStyle : effectStyle;
    };

    if (uploadedVideos.length === 0) return null;

    return (
        <>
            {uploadedVideos.map((video: any, index: number) => (
                <motion.div
                    key={`video-${index}`}
                    className="mb-6 w-full max-w-2xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <video
                        ref={el => {
                            if (videoRefs[index]) {
                                videoRefs[index].current = el;
                                if (el) {
                                    el.muted = false;
                                    el.playsInline = true;
                                }
                            }
                        }}
                        width="480"
                        height="120"
                        controls
                        className="rounded-lg shadow-lg w-full"
                        style={{
                            filter: getMediaStyle(video)
                        }}
                    >
                        <source src={video.processedUrl || video.url} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </motion.div>
            ))}
        </>
    );
};

export default PreviewVideos;