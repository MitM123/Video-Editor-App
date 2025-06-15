import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface VideoItem {
  url: string;
  name: string;
  duration: number;
  appliedFilter?: string;
  appliedEffect?: string;
  processedUrl?: string; 
}

interface VideoState {
  uploadedVideos: VideoItem[];
}

const initialState: VideoState = {
  uploadedVideos: [],
};

const videoSlice = createSlice({
  name: 'video',
  initialState,
  reducers: {
    addVideos: (state, action: PayloadAction<VideoItem[]>) => {
      state.uploadedVideos.push(...action.payload);
    },
    removeVideo: (state, action: PayloadAction<number>) => {
      URL.revokeObjectURL(state.uploadedVideos[action.payload].url);
      state.uploadedVideos.splice(action.payload, 1);
    },
    setVideoFilter: (state, action: PayloadAction<{ url: string; filter: string }>) => {
      const video = state.uploadedVideos.find(v => v.url === action.payload.url);
      if (video) {
        video.appliedFilter = action.payload.filter === 'none' ? undefined : action.payload.filter;
      }
    },
    setVideoEffect: (state, action: PayloadAction<{ url: string; effect?: string }>) => {
      const video = state.uploadedVideos.find(v => v.url === action.payload.url);
      if (video) {
        video.appliedEffect = action.payload.effect;
      }
    },
    setProcessedVideo: (state, action: PayloadAction<{ url: string; processedUrl: string }>) => {
      const video = state.uploadedVideos.find(v => v.url === action.payload.url);
      if (video) {
        video.processedUrl = action.payload.processedUrl;
      }
    },
  },
});

export const { addVideos, removeVideo, setVideoFilter, setVideoEffect, setProcessedVideo } = videoSlice.actions;
export default videoSlice.reducer;
