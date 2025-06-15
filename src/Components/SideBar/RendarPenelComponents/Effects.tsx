import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../../Slices/store';
import { setVideoEffect } from '../../../Slices/Video/Video.slice';

interface VideoItem {
  url: string;
  name: string;
  duration: number;
  appliedEffect?: string;
}

interface EffectOption {
  name: string;
  value: string;
  cssEffect: string;
}

const Effects = () => {
  const dispatch = useDispatch();
  const uploadedVideos = useSelector((state: RootState) => state.video.uploadedVideos);

  const EFFECT_OPTIONS: EffectOption[] = [
    { name: 'None', value: 'none', cssEffect: 'none' },
    { name: 'Vintage', value: 'vintage', cssEffect: 'sepia(70%) brightness(80%) contrast(120%)' },
    { name: 'Cool Tone', value: 'cool', cssEffect: 'brightness(90%) contrast(110%) hue-rotate(180deg)' },
    { name: 'Warm Tone', value: 'warm', cssEffect: 'brightness(110%) contrast(90%) hue-rotate(-20deg)' },
    { name: 'Cinematic', value: 'cinematic', cssEffect: 'contrast(130%) brightness(90%) saturate(110%)' },
    { name: 'Black & White', value: 'bw', cssEffect: 'grayscale(100%) contrast(120%)' },
  ];

  const handleEffectSelect = (videoUrl: string, effectValue: string) => {
    dispatch(setVideoEffect({
      url: videoUrl,
      effect: effectValue === 'none' ? undefined : effectValue
    }));
  };

  return (
    <div className="space-y-8 p-4">
      {uploadedVideos.map((video) => (
        <div key={video.url} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {EFFECT_OPTIONS.map((effect) => {
              const isSelected = video.appliedEffect === effect.value ||
                (!video.appliedEffect && effect.value === 'none');
              return (
                <div
                  key={`${video.url}-${effect.value}`}
                  className={`flex flex-col items-center p-3 rounded-lg cursor-pointer transition-all ${isSelected
                      ? 'bg-blue-100 border-2 border-blue-500 shadow-md'
                      : 'bg-gray-100 hover:bg-gray-200 border border-gray-300'
                    }`}
                  onClick={() => handleEffectSelect(video.url, effect.value)}
                >
                  <div className="w-full h-32 overflow-hidden rounded-md mb-2">
                    <video
                      src={video.url}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        filter: effect.cssEffect
                      }}
                      muted
                      playsInline
                    />
                  </div>
                  <p className={`text-sm font-medium text-center ${isSelected ? 'text-blue-700 font-semibold' : 'text-gray-700'
                    }`}>
                    {effect.name}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Effects;