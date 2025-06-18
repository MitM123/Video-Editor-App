import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../../Slices/store';
import { setVideoEffect } from '../../../Slices/Video/Video.slice';
import { useState } from 'react';

interface EffectOption {
  name: string;
  value: string;
  cssEffect: string;
  ffmpegFilter: string[];
}

const Effects = () => {
  const dispatch = useDispatch();
  const uploadedVideos = useSelector((state: RootState) => state.video.uploadedVideos);
  const [selectedEffects, setSelectedEffects] = useState<{ [url: string]: string }>({});

  const FilterOptions: EffectOption[] = [
    {
      name: 'None',
      value: 'none',
      cssEffect: 'none',
      ffmpegFilter: []
    },
    {
      name: 'Vintage',
      value: 'vintage',
      cssEffect: 'sepia(70%) brightness(80%) contrast(120%)',
      ffmpegFilter: ['-vf', 'colorchannelmixer=.393:.769:.189:0:.349:.686:.168:0:.272:.534:.131,eq=brightness=0.08:contrast=1.2']
    },
    {
      name: 'Cool Tone',
      value: 'cool',
      cssEffect: 'brightness(90%) contrast(110%) hue-rotate(180deg)',
      ffmpegFilter: ['-vf', 'eq=brightness=0.9:contrast=1.1,hue=h=180']
    },
    {
      name: 'Warm Tone',
      value: 'warm',
      cssEffect: 'brightness(110%) contrast(90%) hue-rotate(-20deg)',
      ffmpegFilter: ['-vf', 'eq=brightness=1.1:contrast=0.9,hue=h=-20']
    },
    {
      name: 'Cinematic',
      value: 'cinematic',
      cssEffect: 'contrast(130%) brightness(90%) saturate(110%)',
      ffmpegFilter: ['-vf', 'eq=contrast=1.3:brightness=0.9:saturation=1.1']
    },
    {
      name: 'Black & White',
      value: 'bw',
      cssEffect: 'grayscale(100%) contrast(120%)',
      ffmpegFilter: ['-vf', 'format=gray,eq=contrast=1.2']
    },
  ];

  const handleEffectSelect = (videoUrl: string, effectValue: string) => {
    setSelectedEffects((prev) => ({
      ...prev,
      [videoUrl]: effectValue,
    }));

    dispatch(
      setVideoEffect({
        url: videoUrl,
        effect: effectValue === 'none' ? undefined : effectValue,
      })
    );
  };

  return (
    <div className="space-y-8 p-4">
      {uploadedVideos.length === 0 ? (
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500">
            <p className="text-sm">No uploaded videos</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {uploadedVideos.map((video) => (
            <div key={video.url}>
              <div className="grid grid-cols-1 gap-4">
                {FilterOptions.map((effect: EffectOption) => {
                  const isSelected = selectedEffects[video.url] === effect.value;
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
                          className="w-full h-full object-cover"
                          style={{ filter: effect.cssEffect }}
                          muted
                          playsInline
                        />
                      </div>
                      <p
                        className={`text-sm font-medium text-center ${isSelected ? 'text-blue-700 font-semibold' : 'text-gray-700'
                          }`}
                      >
                        {effect.name}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Effects;
