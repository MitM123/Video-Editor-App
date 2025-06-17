import React, { useEffect  } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../Slices/store';
import PreviewMedia from '../Components/Preview/PreviewMedia';

export const videoRefs: Record<number, React.RefObject<HTMLVideoElement | null>> = {};
export const imageRefs: Record<number, React.RefObject<HTMLImageElement | null>> = {};

const Preview = () => {
  const uploadedVideos = useSelector((state: RootState) => state.video.uploadedVideos);
  const uploadedImages = useSelector((state: RootState) => state.image.uploadedImages);
  const stickers = useSelector((state: RootState) => state.sticker.stickers);

  useEffect(() => {
    uploadedVideos.forEach((_, index) => {
      if (!videoRefs[index]) {
        videoRefs[index] = React.createRef<HTMLVideoElement>();
      }
    });

    uploadedImages.forEach((_, index) => {
      if (!imageRefs[index]) {
        imageRefs[index] = React.createRef<HTMLImageElement>();
      }
    });
  }, [uploadedVideos, uploadedImages]);

  const hasMedia = uploadedVideos.length > 0 || uploadedImages.length > 0 || stickers.length > 0;

  return (
    <div className="relative flex flex-col items-center justify-center font-monasans font-semibold p-4 min-h-[500px]">
      {!hasMedia ? (
        <p className="text-gray-600 text-lg">No media uploaded yet.</p>
      ) : (
        <>
          <PreviewMedia />
        </>
      )}
    </div>
  );
};

export default Preview;