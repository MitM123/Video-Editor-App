import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../Slices/store';
import TimelineControls from './TimeLineControls';
import TimelineHeader from './TimeLineHeader';
import Track from './Track';
import { videoRefs } from '../Preview';

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


const Timeline = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [timelineScale, setTimelineScale] = useState(1);
  const [draggedClip, setDraggedClip] = useState<{ clipId: string; offset: number } | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const playheadRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>(0);

  const uploadedVideos = useSelector((state: RootState) => state.video.uploadedVideos);
  console.log('Uploaded Videos:', uploadedVideos);

  const totalDuration = useMemo(() => {
    if (!uploadedVideos || uploadedVideos.length === 0) return 10;
    const calculatedDuration = uploadedVideos.reduce((max, video) => {
      const start = 0;
      const end = start + video.duration;
      return Math.max(max, end);
    }, 0);
    // console.log('Calculated Duration:', calculatedDuration);
    return calculatedDuration;
  }, [uploadedVideos]);

  const pixelsPerSecond = 50 * timelineScale;

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
        duration: video.duration,
        trackId: 'video-1',
        src: video.url
      }))
    },

  ]);


  useEffect(() => {
    const videoTrack: TrackType = {
      id: 'video-1',
      name: 'Video Track',
      type: 'video',
      clips: uploadedVideos.map((video, index) => ({
        id: `video-clip-${index}`,
        type: 'video',
        name: video.name,
        startTime: index * 3,
        duration: video.duration,
        trackId: 'video-1',
        src: video.url
      }))
    };
    setTracks([videoTrack]);
  }, [uploadedVideos]);

  useEffect(() => {
    if (!isPlaying) {
      Object.values(videoRefs).forEach(ref => {
        if (ref.current) {
          ref.current.currentTime = currentTime;
        }
      });
    }
  }, [currentTime, isPlaying]);

  useEffect(() => {
    const updateCurrentTime = () => {
      if (isPlaying) {
        let minTime = Infinity;
        Object.values(videoRefs).forEach(ref => {
          if (ref.current && !ref.current.paused) {
            minTime = Math.min(minTime, ref.current.currentTime);
          }
        });
        if (minTime !== Infinity) {
          setCurrentTime(minTime);
        }
        animationFrameRef.current = requestAnimationFrame(updateCurrentTime);
      }
    };

    if (isPlaying) {
      animationFrameRef.current = requestAnimationFrame(updateCurrentTime);
    } else if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying]);


  const togglePlayback = () => {
    setIsPlaying(prev => {
      const nextState = !prev;

      Object.values(videoRefs).forEach(ref => {
        if (ref.current) {
          if (nextState) {
            ref.current.currentTime = currentTime;
            ref.current.play();
          } else {
            ref.current.pause();
            setCurrentTime(ref.current.currentTime);
          }
        }
      });
      return nextState;
    });
  };

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

      <div className="flex flex-col overflow-hidden relative">
        <div
          ref={playheadRef}
          className="absolute left-0 w-0.5 bg-blue-500 z-50 pointer-events-none"
          style={{
            top: '0',
            bottom: '0',
            transform: `translateX(${currentTime * pixelsPerSecond}px)`
          }}
        >
          <div className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 rounded-full"></div>
        </div>

        <TimelineHeader
          totalDuration={totalDuration}
          pixelsPerSecond={pixelsPerSecond}
          currentTime={currentTime}
        />

        <div className="flex-1 overflow-auto relative z-30">
          <div
            ref={timelineRef}
            className="relative bg-white"
            style={{ width: `${totalDuration * pixelsPerSecond}px` }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onClick={handleTimelineClick}
          >
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