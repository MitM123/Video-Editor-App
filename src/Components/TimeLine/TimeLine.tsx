import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../Slices/store';
import TimelineControls from './TimeLineControls';
import TimelineHeader from './TimeLineHeader';
import Track from './Track';
import { videoRefs } from '../Preview';
import type { TrackType } from '../../Components/types';
import { setPlaybackSpeed, addSplitPoint } from '../../Slices/Video/Video.slice';


const Timeline = () => {
  const dispatch = useDispatch();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [timelineScale, setTimelineScale] = useState(1);
  const [draggedClip, setDraggedClip] = useState<{ clipId: string; offset: number } | null>(null);
  const playbackSpeed = useSelector((state: RootState) => state.video.playbackSpeed);
  const timelineRef = useRef<HTMLDivElement>(null);
  const playheadRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>(0);

  const uploadedVideos = useSelector((state: RootState) => state.video.uploadedVideos);
  const pixelsPerSecond = 50 * timelineScale;

  const totalDuration = useMemo(() => (
    uploadedVideos?.length ?
      Math.max(...uploadedVideos.map(v => v.duration), 10) : 10
  ), [uploadedVideos]);

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
    }
  ]);

  useEffect(() => {
    setTracks([{
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
    }]);
  }, [uploadedVideos]);

  useEffect(() => {
    if (!isPlaying) {
      Object.values(videoRefs).forEach(ref => {
        ref.current && (ref.current.currentTime = currentTime);
      });
    }
  }, [currentTime, isPlaying]);

  useEffect(() => {
    const updateCurrentTime = () => {
      if (isPlaying) {
        const minTime = Math.min(...Object.values(videoRefs)
          .filter(ref => ref.current && !ref.current.paused)
          .map(ref => ref.current!.currentTime));

        if (minTime !== Infinity) setCurrentTime(minTime);
        animationFrameRef.current = requestAnimationFrame(updateCurrentTime);
      }
    };

    isPlaying
      ? animationFrameRef.current = requestAnimationFrame(updateCurrentTime)
      : cancelAnimationFrame(animationFrameRef.current);

    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [isPlaying]);

  const togglePlayback = () => {
    setIsPlaying(prev => {
      Object.values(videoRefs).forEach(ref => {
        if (ref.current) {
          prev ? ref.current.pause() : (ref.current.currentTime = currentTime, ref.current.play());
        }
      });
      return !prev;
    });
  };

  const zoomIn = () => setTimelineScale(prev => Math.min(prev * 1.5, 3));
  const zoomOut = () => setTimelineScale(prev => Math.max(prev / 1.5, 0.5));

  const handleTimelineClick = (e: React.MouseEvent) => {
    if (timelineRef.current) {
      const newTime = Math.max(0, Math.min(
        (e.clientX - timelineRef.current.getBoundingClientRect().left) / pixelsPerSecond,
        totalDuration
      ));
      setCurrentTime(newTime);
    }
  };

  const handleClipMouseDown = (e: React.MouseEvent, clipId: string) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setDraggedClip({ clipId, offset: e.clientX - rect.left });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggedClip && timelineRef.current) {
      const newPosition = (e.clientX - timelineRef.current.getBoundingClientRect().left - draggedClip.offset) / pixelsPerSecond;
      setTracks(prevTracks => prevTracks.map(track => ({
        ...track,
        clips: track.clips.map(clip =>
          clip.id === draggedClip.clipId ? { ...clip, startTime: Math.max(0, newPosition) } : clip
        )
      })));
    }
  };

  useEffect(() => {
    Object.values(videoRefs).forEach(ref => {
      ref.current && (ref.current.playbackRate = playbackSpeed);
    });
  }, [playbackSpeed]);

  const handlePlaybackSpeedChange = (speed: number) => {
    dispatch(setPlaybackSpeed(speed));
  };

  const handleSplitClick = () => {
    dispatch(addSplitPoint({
      startTime: 0,
      endTime: currentTime
    }));
  };

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
        playbackSpeed={playbackSpeed}
        onPlaybackSpeedChange={handlePlaybackSpeedChange}
        onSplitClick={handleSplitClick}
      />

      <div className="flex flex-col overflow-hidden relative">
        <div
          ref={playheadRef}
          className="absolute left-0 w-0.5 bg-blue-500 z-40 pointer-events-none"
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
            onMouseUp={() => setDraggedClip(null)}
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