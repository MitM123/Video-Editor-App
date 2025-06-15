import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { addSticker } from '../../../Slices/Stickers/Stickers.slice';
import { v4 as uuidv4 } from 'uuid';

const Stickers = () => {
  const dispatch = useDispatch();
  const emojis = ['😀', '😍', '🎉', '⭐', '❤️', '👍', '🔥', '✨', '🎈', '🎊', '🌟', '💫'];

  const handleStickerClick = (emoji: string) => {
    const newSticker = {
      id: uuidv4(),
      emoji,
      position: { x: 100, y: 100 }, 
      size: 40 
    };
    dispatch(addSticker(newSticker));
  };

  return (
    <div className="grid grid-cols-4 gap-3 p-3">
      {emojis.map((emoji, i) => (
        <motion.div
          key={i}
          className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-2xl cursor-pointer hover:bg-gray-200"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleStickerClick(emoji)}
        >
          {emoji}
        </motion.div>
      ))}
    </div>
  );
};

export default Stickers;