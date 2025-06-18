import { Image, Music, Play, Type } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { FaPlay } from 'react-icons/fa6';

interface Clip {
    id: string;
    type: 'text' | 'video' | 'audio' | 'image';
    name: string;
    startTime: number;
    duration: number;
    trackId: string;
    src?: string;
}

interface TrackProps {
    track: {
        id: string;
        name: string;
        type: 'text' | 'video' | 'audio' | 'image';
        clips: Clip[];
    };
    pixelsPerSecond: number;
    onClipMouseDown: (e: React.MouseEvent, clipId: string) => void;
    trackIndex: number;
}

const Track = ({ track, pixelsPerSecond, onClipMouseDown, trackIndex }: TrackProps) => {
    const [clipFrames, setClipFrames] = useState<Record<string, string[]>>({});
    const [isPreparing, setPreparing] = useState(true)

    const extractFrames = async (clip: Clip) => {
        if (!clip.src) return;

        const video = document.createElement('video');
        video.src = clip.src;
        video.crossOrigin = 'anonymous';

        await new Promise(resolve => {
            video.onloadedmetadata = resolve;
        });

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const frameInterval = 1;
        const totalDuration = video.duration;
        console.log(totalDuration);

        const numFrames = Math.floor(totalDuration / frameInterval);

        const targetWidth = 50;
        const scale = targetWidth / video.videoWidth;
        canvas.width = targetWidth;
        canvas.height = video.videoHeight * scale;

        const frames: string[] = [];

        for (let i = 0; i <= numFrames; i++) {
            const time = i * frameInterval;
            await new Promise<void>((resolve) => {
                video.currentTime = time;
                video.onseeked = () => {
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    frames.push(canvas.toDataURL());
                    resolve();
                };
            });
        }

        setClipFrames(prev => ({ ...prev, [clip.id]: frames }));
        setPreparing(false)
    };

    useEffect(() => {
        console.log("Track array", track)
        track.clips.forEach(clip => {
            if (clip.type === 'video' && clip.src && !clipFrames[clip.id]) {
                extractFrames(clip);
            }
        });
    }, [track.clips]);

    return (
        <div
            className="relative h-24 border-b mx-2"
            style={{
                backgroundColor: trackIndex % 2 === 0 ? '#ffffff' : '#f8f9fa',
                borderColor: '#e9ebed'
            }}
        >
            <div className="">
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
                        if (isPreparing) {
                            clipContent = (
                                <div className='flex items-center h-full '>
                                    <h1 className='text-start text-xl text-black'>Preparing...</h1>
                                </div>
                            )
                        } else {
                            const frames = clipFrames[clip.id] || [];

                            clipContent = (
                                <div className="h-full w-full flex items-center justify-center rounded overflow-hidden bg-gray-200">
                                    {frames.length > 0 ? (
                                        <div className="flex w-full h-full">
                                            {frames.map((frame, i) => (
                                                <img
                                                    key={i}
                                                    src={frame}
                                                    alt={`frame-${i}`}
                                                    className="h-full w-full object-cover rounded-md border border-blue-700"
                                                    style={{ width: `${pixelsPerSecond * 1}px` }}
                                                />
                                            ))}

                                        </div>
                                    ) : (
                                        <>
                                            <div className="w-6 h-6 rounded-full flex items-center justify-center bg-gray-500">
                                                <FaPlay className="w-3 h-3 text-white" />
                                            </div>
                                            <div className="w-6 h-6 rounded-full flex items-center justify-center ml-1 bg-gray-500">
                                                <Play className="w-2 h-2 text-white" />
                                            </div>
                                        </>
                                    )}
                                </div>
                            );
                        }

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
                            <div className="h-full rounded overflow-hidden" style={{ backgroundColor: '#dee1e3' }}>
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
                            onMouseDown={(e) => onClipMouseDown(e, clip.id)}
                        >
                            {clipContent}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Track;