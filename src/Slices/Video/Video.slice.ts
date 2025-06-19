import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface VideoItem {
  size: any;
  position: any;
  url: string;
  name: string;
  duration: number;
  appliedFilter?: string;
  appliedEffect?: string;
  processedUrl?: string;
  processedData?: Uint8Array;
}

interface VideoState {
  uploadedVideos: VideoItem[];
  playbackSpeed: number;
  splitPoints: Array<{
    startTime: number;
    endTime: number;
  }>;
}

const initialState: VideoState = {
  uploadedVideos: [],
  playbackSpeed: 1,
  splitPoints: []
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
      if (state.uploadedVideos[action.payload].processedUrl) {
        URL.revokeObjectURL(state.uploadedVideos[action.payload].processedUrl!);
      }
      state.uploadedVideos.splice(action.payload, 1);
    },
    setVideoFilter: (state, action: PayloadAction<{ url: string; effect?: string }>) => {
      const video = state.uploadedVideos.find(v => v.url === action.payload.url);
      if (video) {
        video.appliedEffect = action.payload.effect;
      }
    },
    setProcessedVideo: (state, action: PayloadAction<{ url: string; processedUrl: string; processedData: Uint8Array }>) => {
      const video = state.uploadedVideos.find(v => v.url === action.payload.url);
      if (video) {
        if (video.processedUrl) {
          URL.revokeObjectURL(video.processedUrl);
        }
        video.processedUrl = action.payload.processedUrl;
        video.processedData = action.payload.processedData;
      }
    },
    setPlaybackSpeed: (state, action: PayloadAction<number>) => {
      state.playbackSpeed = action.payload;
    },
    addSplitPoint: (state, action: PayloadAction<{ startTime: number; endTime: number }>) => {
      state.splitPoints.push(action.payload);
    },
  },
});

export const { addVideos, removeVideo, setVideoFilter, setProcessedVideo, setPlaybackSpeed, addSplitPoint } = videoSlice.actions;
export default videoSlice.reducer;
