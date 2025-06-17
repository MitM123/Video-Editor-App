import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import { addShape } from '../../../Slices/Shapes/Shape.slice';

const Shapes = () => {
  const dispatch = useDispatch();

  const shapeData = [
    { type: 'blob', color: '#DF99F7', name: 'Blob' },
    { type: 'wave', color: '#8B5CF6', name: 'Wave' },
    { type: 'corner', color: '#6366F1', name: 'Corner' },
    { type: 'swirl', color: '#EC4899', name: 'Swirl' }
  ];

  const handleAddShape = (type: 'blob' | 'wave' | 'corner' | 'swirl', color: string) => {
    dispatch(addShape({
      id: uuidv4(),
      type,
      position: { x: 100, y: 100 },
      size: { width: 150, height: 150 },
      color,
      zIndex: 1
    }));
  };

  const shapeComponents = {
    blob: (
      <svg width="80" height="80" viewBox="0 0 200 200" fill="none">
        <path d="M127.14 200C99.9942 200 99.9943 167.423 72.8487 167.423C41.6048 167.423 0 158.386 0 127.133C0 99.9885 32.5678 99.9885 32.5678 72.8445C32.5678 41.6139 41.6048 0 72.8602 0C100.006 0 100.006 32.5774 127.151 32.5774C158.384 32.5774 200 41.6139 200 72.8675C200 100.012 167.421 100.012 167.421 127.156C167.409 158.444 158.384 200 127.14 200Z" fill="currentColor" />
      </svg>
    ),
    wave: (
      <svg width="80" height="80" viewBox="0 0 200 200" fill="none">
        <path fillRule="evenodd" clipRule="evenodd" d="M99.9759 100C44.7585 99.987 -2.80187e-06 55.2204 -7.62939e-06 1.74846e-05L200 0C200 55.2204 155.242 99.987 100.024 100C155.242 100.013 200 144.78 200 200H1.11288e-06C1.11288e-06 144.78 44.7585 100.013 99.9759 100Z" fill="currentColor" />
      </svg>
    ),
    corner: (
      <svg width="80" height="80" viewBox="0 0 200 200" fill="none">
        <path d="M99.9937 200V184.439C49.0583 184.439 0 150.932 0 100H15.5495C15.5495 49.0678 49.0583 0 99.9937 0V15.5612C150.929 15.5612 200 49.0678 200 100H184.451C184.451 150.932 150.929 200 99.9937 200Z" fill="currentColor" />
      </svg>
    ),
    swirl: (
      <svg width="80" height="80" viewBox="0 0 200 200" fill="none">
        <path fillRule="evenodd" clipRule="evenodd" d="M29.2893 29.2893C19.2658 39.3128 15.6458 53.315 18.4294 66.2123C7.34132 73.3638 0 85.8246 0 100C-1.74156e-06 114.175 7.34132 126.636 18.4294 133.788C15.6458 146.685 19.2658 160.687 29.2893 170.711C39.3129 180.734 53.315 184.354 66.2123 181.571C73.3639 192.659 85.8246 200 100 200C114.175 200 126.636 192.659 133.788 181.571C146.685 184.354 160.687 180.734 170.711 170.711C180.734 160.687 184.354 146.685 181.571 133.788C192.659 126.636 200 114.175 200 100C200 85.8246 192.659 73.3638 181.571 66.2123C184.354 53.315 180.734 39.3129 170.711 29.2893C160.687 19.2658 146.685 15.6458 133.788 18.4294C126.636 7.34133 114.175 0 100 0C85.8246 0 73.3638 7.34131 66.2123 18.4293C53.315 15.6458 39.3129 19.2658 29.2893 29.2893Z" fill="currentColor" />
      </svg>
    )
  };

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {shapeData.map((shape) => (
        <motion.div
          key={shape.type}
          className="p-4 bg-gray-100 rounded-xl border border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200"
          whileTap={{ scale: 0.95 }}
          onClick={() => handleAddShape(shape.type as any, shape.color)}
        >
          <div className="w-20 h-20" style={{ color: shape.color }}>
            {shapeComponents[shape.type as keyof typeof shapeComponents]}
          </div>
          <span className="mt-2 text-sm font-medium text-gray-700">{shape.name}</span>
        </motion.div>
      ))}
    </div>
  );
};

export default Shapes;