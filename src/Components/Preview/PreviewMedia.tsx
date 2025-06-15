import React from 'react';
import PreviewVideos from './PreviewVideos';
import PreviewImages from './PreviewImages';
import PreviewStickers from './PreviewStickers';

const PreviewMedia = () => {
  return (
    <div className="flex flex-col items-center justify-center font-monasans font-semibold p-4">
      <PreviewStickers />
      <PreviewVideos />
      <PreviewImages />
    </div>
  );
};

export default PreviewMedia;