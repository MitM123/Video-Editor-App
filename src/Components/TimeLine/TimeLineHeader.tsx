interface TimelineHeaderProps {
  totalDuration: number;
  pixelsPerSecond: number;
  currentTime: number;
}

const TimelineHeader = ({ totalDuration, pixelsPerSecond, currentTime }: TimelineHeaderProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const paddedSecs = secs < 10 ? `0${secs}` : secs;
    return `${mins}:${paddedSecs}`;
  };

  const timeMarkers = [];
  for (let i = 0; i <= totalDuration; i += 4) {
    timeMarkers.push(i);
  }

  return (
    <div className="relative bg-white border-b border-gray-200 h-8 overflow-x-auto z-40">
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-blue-500 z-50 pointer-events-none"
        style={{ left: `${currentTime * pixelsPerSecond}px` }}
      >
        <div className="absolute -top-1 -left-1 w-2 h-2 bg-blue-500 rounded-full"></div>
      </div>

      <div className="relative h-full" style={{ width: `${totalDuration * pixelsPerSecond}px` }}>
        {timeMarkers.map((time) => (
          <div
            key={time}
            className="absolute top-0 flex flex-col items-start z-10"
            style={{ left: `${time * pixelsPerSecond}px` }}
          >
            <span className="text-xs text-gray-500 ml-1 mt-1">{formatTime(time)}</span>
            <div className="w-px h-2 bg-gray-300 ml-2"></div>
          </div>
        ))}
        {Array.from({ length: totalDuration }, (_, i) => i + 1).map((time) => (
          <div
            key={`minor-${time}`}
            className="absolute top-6 z-10"
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