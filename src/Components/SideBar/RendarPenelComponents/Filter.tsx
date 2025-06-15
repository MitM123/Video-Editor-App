import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../../Slices/store';
import { setVideoFilter } from '../../../Slices/Video/Video.slice';

interface VideoItem {
  url: string;
  name: string;
  duration: number;
  appliedFilter?: string;
}

interface FilterOption {
  name: string;
  value: string;
  cssFilter: string;
}

const Filter = () => {
  const dispatch = useDispatch();
  const uploadedVideos = useSelector((state: RootState) => state.video.uploadedVideos);

  const FILTER_OPTIONS: FilterOption[] = [
    { name: 'Original', value: 'none', cssFilter: 'none' },
    { name: 'Grayscale', value: 'grayscale', cssFilter: 'grayscale(100%)' },
    { name: 'Sepia', value: 'sepia', cssFilter: 'sepia(100%)' },
    { name: 'Blur', value: 'blur', cssFilter: 'blur(5px)' },
    { name: 'Brightness', value: 'brightness', cssFilter: 'brightness(1.5)' },
    { name: 'Contrast', value: 'contrast', cssFilter: 'contrast(1.5)' },
  ];

  const handleFilterSelect = (videoUrl: string, filterValue: string) => {
    dispatch(setVideoFilter({
      url: videoUrl,
      filter: filterValue
    }));
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
        uploadedVideos.map((video) => (
          <div key={video.url} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {FILTER_OPTIONS.map((filter) => {
                const isSelected = video.appliedFilter === filter.value ||
                  (!video.appliedFilter && filter.value === 'none');
                return (
                  <div
                    key={`${video.url}-${filter.value}`}
                    className={`flex flex-col items-center p-3 rounded-lg cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-blue-100 border-2 border-blue-500 shadow-md'
                        : 'bg-gray-100 hover:bg-gray-200 border border-gray-300'
                    }`}
                    onClick={() => handleFilterSelect(video.url, filter.value)}
                  >
                    <div className="w-full h-32 overflow-hidden rounded-md mb-2">
                      <video
                        src={video.url}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          filter: filter.cssFilter
                        }}
                        muted
                        playsInline
                      />
                    </div>
                    <p className={`text-sm font-medium text-center ${
                      isSelected ? 'text-blue-700 font-semibold' : 'text-gray-700'
                    }`}>
                      {filter.name}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Filter;