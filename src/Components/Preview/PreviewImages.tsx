import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { imageRefs } from '../Preview';
import type { RootState } from '../../Slices/store';
import { deleteImage } from '../../Slices/Image/Image.slice';

const PreviewImages = () => {
  const dispatch = useDispatch();
  const uploadedImages = useSelector((state: RootState) => state.image.uploadedImages);

   const getMediaStyle = (media: any) => {
    const FILTER_STYLES: Record<string, string> = {
      none: 'none',
      grayscale: 'grayscale(100%)',
      sepia: 'sepia(100%)',
      blur: 'blur(5px)',
      brightness: 'brightness(1.5)',
      contrast: 'contrast(1.5)'
    };

    const EFFECT_STYLES: Record<string, string> = {
      none: 'none',
      vintage: 'sepia(70%) brightness(80%) contrast(120%)',
      cool: 'brightness(90%) contrast(110%) hue-rotate(180deg)',
      warm: 'brightness(110%) contrast(90%) hue-rotate(-20deg)',
      cinematic: 'contrast(130%) brightness(90%) saturate(110%)',
      bw: 'grayscale(100%) contrast(120%)'
    };

    const filterStyle = media.appliedFilter ? FILTER_STYLES[media.appliedFilter] || 'none' : 'none';
    const effectStyle = media.appliedEffect ? EFFECT_STYLES[media.appliedEffect] || 'none' : 'none';

    return filterStyle !== 'none' ? filterStyle : effectStyle;
  };

  const handleDeleteImage = (id: number) => {
    dispatch(deleteImage(id));
  };

  if (uploadedImages.length === 0) return null;

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {uploadedImages.map((image, index) => (
        <motion.div
          key={`image-${image.id}`}
          className="relative group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          whileHover={{ scale: 1.02 }}
        >
          <img
            ref={el => {
              if (imageRefs[index]) {
                imageRefs[index].current = el;
              }
            }}
            src={image.url}
            alt={image.name}
            className="w-full h-auto max-h-[300px] object-contain rounded-lg shadow-lg"
            style={{
              filter: getMediaStyle(image)
            }}
          />
          <button
            onClick={() => handleDeleteImage(image.id)}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
          >
            ×
          </button>
        </motion.div>
      ))}
    </div>
  );
};

export default PreviewImages;