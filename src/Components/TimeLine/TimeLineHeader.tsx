import React from 'react';

interface TimelineHeaderProps {
  totalDuration: number;
  pixelsPerSecond: number;
}

const TimelineHeader: React.FC<TimelineHeaderProps> = ({ totalDuration, pixelsPerSecond }) => {
  const timeMarkers = [];
  for (let i = 0; i <= totalDuration; i += 4) {
    timeMarkers.push(i);
  }

  return (
    <div className="relative bg-white border-b border-gray-200 h-8 overflow-x-auto">
      <div className="relative h-full" style={{ width: `${totalDuration * pixelsPerSecond}px` }}>
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
  );
};

export default TimelineHeader;