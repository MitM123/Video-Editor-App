import { useDispatch, useSelector } from 'react-redux';
import { Rnd } from 'react-rnd';
import type { RootState } from '../../Slices/store';
import {
  deleteImage,
  updateImagePosition,
  updateImageSize,
  bringImageToFront
} from '../../Slices/Image/Image.slice';
import { useCallback, useEffect, useState } from 'react';

const PreviewImages = () => {
  const dispatch = useDispatch();
  const uploadedImages = useSelector((state: RootState) => state.image.uploadedImages);
  const [activeImageId, setActiveImageId] = useState<number | null>(null);

  const getMediaStyle = useCallback((media: any) => {
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
  }, []);

  const handleClick = useCallback((id: number) => {
    setActiveImageId(id);
    dispatch(bringImageToFront(id));
  }, [dispatch]);

  const handleDragStop = useCallback((e: any, d: { x: number; y: number }) => {
    const id = Number(e.target.closest('[data-image-id]')?.getAttribute('data-image-id'));
    if (id) {
      dispatch(updateImagePosition({ id, position: { x: d.x, y: d.y } }));
      dispatch(bringImageToFront(id));
      setActiveImageId(id);
    }
  }, [dispatch]);

  const handleResizeStop = useCallback((
    _e: MouseEvent | TouchEvent,
    _direction: string,
    ref: HTMLElement,
    _delta: { width: number; height: number },
    position: { x: number; y: number }
  ) => {
    const id = Number(ref.getAttribute('data-image-id'));
    if (id) {
      dispatch(updateImageSize({
        id,
        size: {
          width: ref.offsetWidth,
          height: ref.offsetHeight
        }
      }));
      dispatch(updateImagePosition({ id, position }));
      dispatch(bringImageToFront(id));
      setActiveImageId(id);
    }
  }, [dispatch]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Backspace' && activeImageId) {
        dispatch(deleteImage(activeImageId));
        setActiveImageId(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeImageId, dispatch]);

  if (uploadedImages.length === 0) return null;

  return (
    <div className="absolute inset-0">
      {uploadedImages.map((image) => (
        <Rnd
          key={`image-${image.id}`}
          size={{ width: image.size.width, height: image.size.height }}
          position={{ x: image.position.x, y: image.position.y }}
          onDragStop={handleDragStop}
          onResizeStop={handleResizeStop}
          onClick={() => handleClick(image.id)}
          style={{
            zIndex: image.zIndex,
            filter: getMediaStyle(image),
            cursor: 'move',
            outline: activeImageId === image.id ? '2px dashed #3b82f6' : 'none'
          }}
          bounds="parent"
          lockAspectRatio={true}
          resizeHandleClasses={{
            bottomRight: 'resize-handle'
          }}
          dragHandleClassName="draggable-area"
          data-image-id={image.id}
        >
          <div className="relative w-full h-full group draggable-area">
            <img
              src={image.url}
              alt={image.name}
              className="w-full h-full object-contain draggable-area"
              draggable="false"
            />
          </div>
        </Rnd>
      ))}
    </div>
  );
};

export default PreviewImages;