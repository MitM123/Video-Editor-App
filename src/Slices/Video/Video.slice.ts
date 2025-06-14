import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface VideoItem {
  url: string;
  name: string;
  duration: number;
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
    }
  },
});

export const { addVideos, removeVideo } = videoSlice.actions;
export default videoSlice.reducer;
