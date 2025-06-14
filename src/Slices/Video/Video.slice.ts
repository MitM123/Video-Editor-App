import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface VideoItem {
  url: string;
  name: string;
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
      const videoToRemove = state.uploadedVideos[action.payload];
      if (videoToRemove) {
        URL.revokeObjectURL(videoToRemove.url);
      }
      state.uploadedVideos.splice(action.payload, 1);
    },
    clearVideos: (state) => {
      state.uploadedVideos.forEach(video => URL.revokeObjectURL(video.url));
      state.uploadedVideos = [];
    },
  },
});

export const { addVideos, removeVideo, clearVideos } = videoSlice.actions;
export default videoSlice.reducer;
