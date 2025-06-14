import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../Slices/store';
import TimelineControls from './TimeLineControls';
import TimelineHeader from './TimeLineHeader';
import Track from './Track';

interface Clip {
  id: string;
  type: 'text' | 'video' | 'audio' | 'image';
  name: string;
  startTime: number;
  duration: number;
  trackId: string;
  src?: string;
}


interface TrackType {
  id: string;
  name: string;
  type: 'video' | 'audio' | 'text' | 'image';
  clips: Clip[];
}


const Timeline: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [timelineScale, setTimelineScale] = useState(1);
  const [draggedClip, setDraggedClip] = useState<{ clipId: string; offset: number } | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const playheadRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  const uploadedVideos = useSelector((state: RootState) => state.video.uploadedVideos);
  const totalDuration = 24;
  const pixelsPerSecond = 50 * timelineScale;

  // Initialize tracks with uploaded videos
  const [tracks, setTracks] = useState<TrackType[]>([
    {
      id: 'video-1',
      name: 'Video Track',
      type: 'video',
      clips: uploadedVideos.map((video, index) => ({
        id: `video-clip-${index}`,
        type: 'video',
        name: video.name,
        startTime: index * 3,
        duration: 3,
        trackId: 'video-1',
        src: video.url
      }))
    },
    // Add other track types as needed
  ]);

  // Playback simulation
  useEffect(() => {
    let interval: number | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= totalDuration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 0.1;
        });
      }, 100);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, totalDuration]);

  const togglePlayback = () => setIsPlaying(!isPlaying);
  const zoomIn = () => setTimelineScale(prev => Math.min(prev * 1.5, 3));
  const zoomOut = () => setTimelineScale(prev => Math.max(prev / 1.5, 0.5));

  const handleTimelineClick = (e: React.MouseEvent) => {
    if (timelineRef.current) {
      const rect = timelineRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newTime = (clickX / pixelsPerSecond);
      setCurrentTime(Math.max(0, Math.min(newTime, totalDuration)));
    }
  };

  const handleClipMouseDown = (e: React.MouseEvent, clipId: string) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const offset = e.clientX - rect.left;
    setDraggedClip({ clipId, offset });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggedClip && timelineRef.current) {
      const rect = timelineRef.current.getBoundingClientRect();
      const newPosition = (e.clientX - rect.left - draggedClip.offset) / pixelsPerSecond;

      setTracks(prevTracks =>
        prevTracks.map(track => ({
          ...track,
          clips: track.clips.map(clip =>
            clip.id === draggedClip.clipId
              ? { ...clip, startTime: Math.max(0, newPosition) }
              : clip
          )
        }))
      );
    }
  };

  const handleMouseUp = () => setDraggedClip(null);

  return (
    <div className="w-full h-full bg-white font-dmsans flex flex-col overflow-y-auto">
      <TimelineControls
        isPlaying={isPlaying}
        currentTime={currentTime}
        totalDuration={totalDuration}
        timelineScale={timelineScale}
        onPlayPause={togglePlayback}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
      />

      <div className="flex flex-col overflow-hidden">
        <TimelineHeader
          totalDuration={totalDuration}
          pixelsPerSecond={pixelsPerSecond}
        />

        <div className="flex-1 overflow-auto">
          <div
            ref={timelineRef}
            className="relative bg-white"
            style={{ width: `${totalDuration * pixelsPerSecond}px` }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onClick={handleTimelineClick}
          >
            <div
              ref={playheadRef}
              className="absolute top-0 bottom-0 w-0.5 bg-blue-500 z-30 pointer-events-none"
              style={{ left: `${currentTime * pixelsPerSecond}px` }}
            >
              <div className="absolute -top-1 -left-1 w-2 h-2 bg-blue-500 rounded-full"></div>
            </div>

            {tracks.map((track, trackIndex) => (
              <Track
                key={track.id}
                track={track}
                pixelsPerSecond={pixelsPerSecond}
                onClipMouseDown={handleClipMouseDown}
                trackIndex={trackIndex}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;