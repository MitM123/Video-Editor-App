export const getVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve) => {
        const video = document.createElement('video');
        video.preload = 'metadata';

        video.onloadedmetadata = () => {
            URL.revokeObjectURL(video.src);
            resolve(video.duration);
        };
        video.src = URL.createObjectURL(file);
    });
};