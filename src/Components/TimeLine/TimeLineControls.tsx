import { Plus, Minus, SquareSplitHorizontal, Trash } from 'lucide-react';
import { FaPlay } from "react-icons/fa6";
import { BsFillPauseFill } from "react-icons/bs";
import { useEffect, useRef } from 'react';

interface TimelineControlsProps {
    isPlaying: boolean;
    currentTime: number;
    totalDuration: number;
    timelineScale: number;
    onPlayPause: () => void;
    onZoomIn: () => void;
    onZoomOut: () => void;
    onPlaybackSpeedChange: (speed: number) => void;
}

const TimelineControls = ({ isPlaying, currentTime, totalDuration, onPlayPause, onZoomIn, onZoomOut, onPlaybackSpeedChange }: TimelineControlsProps) => {
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space' &&
                document.activeElement?.tagName !== 'INPUT' &&
                document.activeElement?.tagName !== 'TEXTAREA') {
                e.preventDefault();
                onPlayPause();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onPlayPause]);

    const handleClick = () => {
        onPlayPause();
        buttonRef.current?.focus();
    };

    const formatTime = (totalSeconds: number): string => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = Math.floor(totalSeconds % 60);

        return [
            hours.toString().padStart(2, '0'),
            minutes.toString().padStart(2, '0'),
            seconds.toString().padStart(2, '0')
        ].join(':');
    };

    return (
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
                    {`${formatTime(currentTime)} / ${formatTime(totalDuration)}`}
                </span>
                <button
                    ref={buttonRef}
                    onClick={handleClick}
                    className="flex items-center cursor-pointer justify-center w-9 h-9 bg-white border rounded-full hover:bg-gray-50 transition-colors border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    aria-label={isPlaying ? "Pause" : "Play"}
                >
                    {isPlaying ? (
                        <BsFillPauseFill className="w-6 h-6 text-gray-700" />
                    ) : (
                        <FaPlay className="w-4 h-4 text-gray-700 ml-0.5" />
                    )}
                </button>
            </div>

            <div className="flex items-center space-x-3">
                <span className="text-xs font-semibold text-gray-500">Timeline Scale</span>
                <button onClick={onZoomOut} className="w-6 h-6 flex items-center justify-center border rounded hover:bg-gray-50" style={{ borderColor: '#dee1e3' }}>
                    <Minus className="w-3 h-3 text-gray-600" />
                </button>
                <button onClick={onZoomIn} className="w-6 h-6 flex items-center justify-center border rounded hover:bg-gray-50" style={{ borderColor: '#dee1e3' }}>
                    <Plus className="w-3 h-3 text-gray-600" />
                </button>

                <select
                    onChange={(e) => onPlaybackSpeedChange(parseFloat(e.target.value))}
                    className="text-xs border rounded px-2 py-1 focus:outline-none"
                    defaultValue="1"
                >
                    <option value="0.5">0.5x</option>
                    <option value="0.75">0.75x</option>
                    <option value="1">1x</option>
                    <option value="1.25">1.25x</option>
                    <option value="1.5">1.5x</option>
                    <option value="2">2x</option>
                </select>
            </div>
        </div>
    );
};

export default TimelineControls;
