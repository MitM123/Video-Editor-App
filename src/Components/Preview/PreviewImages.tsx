import { useDispatch, useSelector } from 'react-redux';
import { Rnd } from 'react-rnd';
import type { RootState } from '../../Slices/store';
import {
  deleteImage,
  updateImagePosition,
  updateImageSize,
  bringImageToFront
} from '../../Slices/Image/Image.slice';

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

  const handleDeleteImage = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    dispatch(deleteImage(id));
  };

  const handleDragStop = (d: any, id: number) => {
    dispatch(updateImagePosition({ id, position: { x: d.x, y: d.y } }));
    dispatch(bringImageToFront(id));
  };

  const handleResizeStop = (
    ref: any,
    position: any,
    id: number
  ) => {
    dispatch(updateImageSize({
      id,
      size: {
        width: ref.offsetWidth,
        height: ref.offsetHeight
      }
    }));
    dispatch(updateImagePosition({ id, position }));
    dispatch(bringImageToFront(id));
  };

  if (uploadedImages.length === 0) return null;

  return (
    <div className="absolute inset-0">
      {uploadedImages.map((image) => (
        <Rnd
          key={`image-${image.id}`}
          size={{ width: image.size.width, height: image.size.height }}
          position={{ x: image.position.x, y: image.position.y }}
          onDragStop={(d) => handleDragStop(d, image.id)}
          onResizeStop={(ref, position) =>
            handleResizeStop(ref, position, image.id)
          }
          style={{
            zIndex: image.zIndex,
            filter: getMediaStyle(image)
          }}
          bounds="parent"
          lockAspectRatio={true}
          resizeHandleClasses={{
            bottomRight: 'resize-handle'
          }}
        >
          <div className="relative w-full h-full group">
            <img
              src={image.url}
              alt={image.name}
              className="w-full h-full object-contain"
            />
            <button
              onClick={(e) => handleDeleteImage(e, image.id)}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
            >
              ×
            </button>
          </div>
        </Rnd>
      ))}
    </div>
  );
};

export default PreviewImages;