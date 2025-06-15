import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../Slices/store';

export const videoRefs: Record<number, React.RefObject<HTMLVideoElement | null>> = {};

const Preview = () => {
  const uploadedVideos = useSelector((state: RootState) => state.video.uploadedVideos);

  useEffect(() => {
    uploadedVideos.forEach((_, index) => {
      if (!videoRefs[index]) {
        videoRefs[index] = React.createRef<HTMLVideoElement>();
      }
    });
  }, [uploadedVideos]);

  const getVideoStyle = (video: any) => {
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

    const filterStyle = video.appliedFilter ? FILTER_STYLES[video.appliedFilter] || 'none' : 'none';
    const effectStyle = video.appliedEffect ? EFFECT_STYLES[video.appliedEffect] || 'none' : 'none';

    return filterStyle !== 'none' ? filterStyle : effectStyle;
  };

  return (
    <div className="flex flex-col items-center justify-cente font-monasans font-semibold p-4">
      {uploadedVideos.length === 0 ? (
        <p className="text-gray-600 text-lg">No videos uploaded yet.</p>
      ) : (
        uploadedVideos.map((video, index) => (
          <div key={index} className="mb-6">
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
              className="rounded-lg shadow-lg"
              style={{
                filter: getVideoStyle(video)
              }}
            >
              <source src={video.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            {/* <p className="text-center mt-2 text-gray-800 font-medium">{video.name}</p> */}
          </div>
        ))
      )}
    </div>
  );
};

export default Preview;