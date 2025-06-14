import React, { useState, useRef, useEffect } from 'react';
import { Play, Plus, Minus, Type, Music, Image, SquareSplitHorizontal, Trash } from 'lucide-react';
import { FaPlay } from "react-icons/fa6";
import { BsFillPauseFill } from "react-icons/bs";

interface Clip {
  id: string;
  type: 'text' | 'video' | 'audio' | 'image';
  name: string;
  startTime: number;
  duration: number;
  trackId: string;
}

interface Track {
  id: string;
  name: string;
  type: 'text' | 'video' | 'audio' | 'image';
  clips: Clip[];
}

const Timeline = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [timelineScale, setTimelineScale] = useState(1);
  const [draggedClip, setDraggedClip] = useState<{ clipId: string; offset: number } | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const playheadRef = useRef<HTMLDivElement>(null);

  const totalDuration = 24;
  const pixelsPerSecond = 50 * timelineScale;

  const [tracks, setTracks] = useState<Track[]>([
    {
      id: 'text-1',
      name: 'co zy',
      type: 'text',
      clips: [
        { id: 'text-clip-1', type: 'text', name: 'co zy', startTime: 0, duration: 4, trackId: 'text-1' }
      ]
    },
    {
      id: 'text-2',
      name: 'winter comfort line',
      type: 'text',
      clips: [
        { id: 'text-clip-2', type: 'text', name: 'winter comfort line', startTime: 0, duration: 6, trackId: 'text-2' }
      ]
    },
    {
      id: 'video-1',
      name: 'Video Track',
      type: 'video',
      clips: [
        { id: 'video-clip-1', type: 'video', name: '', startTime: 2, duration: 2.5, trackId: 'video-1' },
        { id: 'video-clip-2', type: 'video', name: '', startTime: 5.5, duration: 2.5, trackId: 'video-1' },
        { id: 'video-clip-3', type: 'video', name: '', startTime: 9, duration: 2.5, trackId: 'video-1' },
        { id: 'video-clip-4', type: 'video', name: '', startTime: 12.5, duration: 2.5, trackId: 'video-1' }
      ]
    },
    {
      id: 'audio-1',
      name: 'intro',
      type: 'audio',
      clips: [
        { id: 'audio-clip-1', type: 'audio', name: 'intro', startTime: 0, duration: 15, trackId: 'audio-1' }
      ]
    },
    {
      id: 'image-1',
      name: 'Images',
      type: 'image',
      clips: [
        { id: 'image-clip-1', type: 'image', name: '', startTime: 1, duration: 4, trackId: 'image-1' }
      ]
    }
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

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const handleTimelineClick = (e: React.MouseEvent) => {
    if (timelineRef.current) {
      const rect = timelineRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newTime = (clickX / pixelsPerSecond);
      setCurrentTime(Math.max(0, Math.min(newTime, totalDuration)));
    }
  };

  // const getClipIcon = (type: string) => {
  //   switch (type) {
  //     case 'text': return <Type className="w-3 h-3 text-gray-600" />;
  //     case 'video': return <Video className="w-3 h-3 text-gray-600" />;
  //     case 'audio': return <Music className="w-3 h-3 text-gray-600" />;
  //     case 'image': return <Image className="w-3 h-3 text-gray-600" />;
  //     default: return null;
  //   }
  // };

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

  const handleMouseUp = () => {
    setDraggedClip(null);
  };

  const zoomIn = () => setTimelineScale(prev => Math.min(prev * 1.5, 3));
  const zoomOut = () => setTimelineScale(prev => Math.max(prev / 1.5, 0.5));

  const addClip = () => {
    const newClip: Clip = {
      id: `clip-${Date.now()}`,
      type: 'video',
      name: 'New Clip',
      startTime: currentTime,
      duration: 3,
      trackId: 'video-1'
    };

    setTracks(prevTracks =>
      prevTracks.map(track =>
        track.id === 'video-1'
          ? { ...track, clips: [...track.clips, newClip] }
          : track
      )
    );
  };

  const timeMarkers = [];
  for (let i = 0; i <= totalDuration; i += 4) {
    timeMarkers.push(i);
  }

  return (
    <div className="w-full h-full  bg-white font-dmsans flex flex-col overflow-y-auto">
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="flex items-center cursor-pointer space-x-1">
            <SquareSplitHorizontal className="w-4 h-4 text-gray-500" />
            <span className="text-xs font-semibold text-gray-600">Split Clip</span>
          </div>
          <div className="flex items-center cursor-pointer space-x-1">
            <Trash className="w-4 h-4 text-gray-500" />
            <span className="text-xs font-semibold text-gray-600">Delete</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-sm font-dmsans text-gray-600">
            0:00.0 / 0:07.1
          </span>
          <button
            onClick={togglePlayback}
            className="flex items-center cursor-pointer justify-center w-9 h-9 bg-white border rounded-full hover:bg-gray-50 transition-colors border-gray-300"
          >
            {isPlaying ? <BsFillPauseFill className="w-6 h-6 text-gray-700" /> : <FaPlay className="w-4 h-4 text-gray-700 ml-0.5" />}
          </button>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-xs font-semibold text-gray-500">Timeline Scale</span>
          <button
            onClick={zoomOut}
            className="w-6 h-6 flex items-center justify-center border rounded hover:bg-gray-50"
            style={{ borderColor: '#dee1e3' }}
          >
            <Minus className="w-3 h-3 text-gray-600" />
          </button>
          <button
            onClick={zoomIn}
            className="w-6 h-6 flex items-center justify-center border rounded hover:bg-gray-50"
            style={{ borderColor: '#dee1e3' }}
          >
            <Plus className="w-3 h-3 text-gray-600" />
          </button>
        </div>
      </div>

      <div className=" flex flex-col overflow-hidden">
        <div className="relative bg-white border-b border-gray-200 h-8 overflow-x-auto">
          <div
            className="relative h-full"
            style={{ width: `${totalDuration * pixelsPerSecond}px` }}
          >
            {timeMarkers.map(time => (
              <div
                key={time}
                className="absolute top-0 flex flex-col items-start"
                style={{ left: `${time * pixelsPerSecond}px` }}
              >
                <span className="text-xs text-gray-500 ml-1 mt-1">{time}s</span>
                <div className="w-px h-2 bg-gray-300 ml-2"></div>
              </div>
            ))}
            {Array.from({ length: totalDuration }, (_, i) => i + 1).map(time => (
              <div
                key={`minor-${time}`}
                className="absolute top-6"
                style={{ left: `${time * pixelsPerSecond}px` }}
              >
                <div className="w-px h-1 bg-gray-200"></div>
              </div>
            ))}
          </div>
        </div>

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

            <div
              className="absolute top-0 bottom-0 bg-blue-100 opacity-50 border-l-2 border-blue-500 z-10"
              style={{ left: '0px', width: `${4 * pixelsPerSecond}px` }}>
            </div>

            {tracks.map((track, trackIndex) => (
              <div
                key={track.id}
                className="relative h-12 border-b"
                style={{
                  backgroundColor: trackIndex % 2 === 0 ? '#ffffff' : '#f8f9fa',
                  borderColor: '#e9ebed'
                }}
              >
                <div className="h-full relative">
                  {track.clips.map(clip => {
                    let clipContent;
                    let clipStyle = {
                      left: `${clip.startTime * pixelsPerSecond}px`,
                      width: `${clip.duration * pixelsPerSecond}px`
                    };

                    if (clip.type === 'text') {
                      clipContent = (
                        <div className="h-full flex items-center justify-center px-2 text-white bg-gray-500 font-medium text-xs rounded">
                          <Type className="w-3 h-3 mr-1" />
                          {clip.name}
                        </div>
                      );
                    } else if (clip.type === 'video') {
                      clipContent = (
                        <div className="h-full flex items-center justify-center rounded overflow-hidden bg-gray-300">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center bg-gray-500" >
                            <FaPlay className="w-3 h-3 text-white" />
                          </div>
                          <div className="w-6 h-6 rounded-full flex items-center justify-center ml-1 bg-gray-500">
                            <Play className="w-2 h-2 text-white" />
                          </div>
                        </div>
                      );
                    } else if (clip.type === 'audio') {
                      clipContent = (
                        <div className="h-full flex items-center px-2 rounded bg-green-400">
                          <Music className="w-3 h-3 text-white mr-1" />
                          <span className="text-white text-xs font-medium">{clip.name}</span>
                          <div className="flex items-center space-x-0.5 ml-2">
                            {Array.from({ length: Math.floor(clip.duration * 8) }).map((_, i) => (
                              <div
                                key={i}
                                className="w-0.5 bg-white opacity-60 rounded-full"
                                style={{ height: `${Math.random() * 12 + 4}px` }}
                              />
                            ))}
                          </div>
                        </div>
                      );
                    } else if (clip.type === 'image') {
                      clipContent = (
                        <div className="h-full rounded overflow-hidden"
                          style={{ backgroundColor: '#dee1e3' }}>
                          <div className="w-full h-full bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center">
                            <div className="w-8 h-6 bg-white rounded shadow-sm flex items-center justify-center">
                              <Image className="w-3 h-3 text-gray-400" />
                            </div>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={clip.id}
                        className="absolute top-1 bottom-1 cursor-move select-none"
                        style={clipStyle}
                        onMouseDown={(e) => handleClipMouseDown(e, clip.id)}
                      >
                        {clipContent}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Clip Button */}
        {/* <div className="p-3 bg-white border-t" style={{ borderColor: '#e9ebed' }}>
          <button
            onClick={addClip}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            <span>Add Clip</span>
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default Timeline;