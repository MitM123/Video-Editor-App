import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import type { RootState } from '../../Slices/store';
import { deleteSticker } from '../../Slices/Stickers/Stickers.slice';

const PreviewStickers = () => {
  const dispatch = useDispatch();
  const stickers = useSelector((state: RootState) => state.sticker.stickers);

  const handleDeleteSticker = (id: string) => {
    dispatch(deleteSticker(id));
  };

  if (stickers.length === 0) return null;

  return (
    <div className="absolute w-full h-full pointer-events-none">
      {stickers.map((sticker: any) => (
        <motion.div
          key={`sticker-${sticker.id}`}
          className="absolute cursor-move pointer-events-auto"
          style={{
            left: `${sticker.position.x}px`,
            top: `${sticker.position.y}px`,
            fontSize: `${sticker.size}px`,
            zIndex: 20
          }}
          drag
          dragConstraints={{ left: 0, right: window.innerWidth, top: 0, bottom: window.innerHeight }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="relative group">
            <div>{sticker.emoji}</div>
            <button
              onClick={() => handleDeleteSticker(sticker.id)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 text-xs pointer-events-auto"
            >
              ×
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default PreviewStickers;