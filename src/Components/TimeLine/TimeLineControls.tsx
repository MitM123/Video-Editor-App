import { Plus, Minus, SquareSplitHorizontal, Trash } from 'lucide-react';
import { FaPlay } from "react-icons/fa6";
import { BsFillPauseFill } from "react-icons/bs";

interface TimelineControlsProps {
    isPlaying: boolean;
    currentTime: number;
    totalDuration: number;
    timelineScale: number;
    onPlayPause: () => void;
    onZoomIn: () => void;
    onZoomOut: () => void;
}

const TimelineControls = ({
    isPlaying,
    currentTime,
    totalDuration,
    onPlayPause,
    onZoomIn,
    onZoomOut,
}: TimelineControlsProps) => {
    
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
                    onClick={onPlayPause}
                    className="flex items-center cursor-pointer justify-center w-9 h-9 bg-white border rounded-full hover:bg-gray-50 transition-colors border-gray-300"
                >
                    {isPlaying ? <BsFillPauseFill className="w-6 h-6 text-gray-700" /> : <FaPlay className="w-4 h-4 text-gray-700 ml-0.5" />}
                </button>
            </div>

            <div className="flex items-center space-x-3">
                <span className="text-xs font-semibold text-gray-500">Timeline Scale</span>
                <button
                    onClick={onZoomOut}
                    className="w-6 h-6 flex items-center justify-center border rounded hover:bg-gray-50"
                    style={{ borderColor: '#dee1e3' }}
                >
                    <Minus className="w-3 h-3 text-gray-600" />
                </button>
                <button
                    onClick={onZoomIn}
                    className="w-6 h-6 flex items-center justify-center border rounded hover:bg-gray-50"
                    style={{ borderColor: '#dee1e3' }}
                >
                    <Plus className="w-3 h-3 text-gray-600" />
                </button>
            </div>
        </div>
    );
};

export default TimelineControls;