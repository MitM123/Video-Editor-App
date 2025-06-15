import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import type { RootState } from '../../Slices/store';
import { deleteText, updateTextContent, updateTextPosition } from '../../Slices/Text/Text.slice';

const PreviewText = () => {
    const dispatch = useDispatch();
    const texts = useSelector((state: RootState) => state.text.texts);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const handleTextClick = (id: string, content: string) => {
        setEditingId(id);
        setEditContent(content);
    };

    const handleBlur = (id: string) => {
        if (editContent.trim()) {
            dispatch(updateTextContent({ id, content: editContent }));
        }
        setEditingId(null);
    };

    const handleDragEnd = (id: string, info: any) => {
        dispatch(updateTextPosition({
            id,
            position: {
                x: info.point.x,
                y: info.point.y
            }
        }));
    };

    const handleDelete = (id: string) => {
        dispatch(deleteText(id));
    };

    useEffect(() => {
        if (editingId && inputRef.current) {
            inputRef.current.focus();
        }
    }, [editingId]);

    if (texts.length === 0) return null;

    return (
        <div className="absolute w-full h-full font-monasans pointer-events-none">
            {texts.map((text: any) => (
                <motion.div
                    key={`text-${text.id}`}
                    className="absolute cursor-move pointer-events-auto"
                    style={{
                        left: `${text.position.x}px`,
                        top: `${text.position.y}px`,
                        zIndex: 30,
                        fontSize: `${text.style.fontSize}px`,
                        color: text.style.color,
                        fontWeight: text.style.fontWeight,
                        padding: '8px',
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        borderRadius: '4px'
                    }}
                    drag
                    dragConstraints={{ left: 0, right: window.innerWidth, top: 0, bottom: window.innerHeight }}
                    onDragEnd={(_, info) => handleDragEnd(text.id, info)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <div className="relative group">
                        {editingId === text.id ? (
                            <input
                                ref={inputRef}
                                type="text"
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                onBlur={() => handleBlur(text.id)}
                                onKeyDown={(e) => e.key === 'Enter' && handleBlur(text.id)}
                                className="bg-transparent border-b border-gray-300 outline-none"
                                style={{
                                    fontSize: 'inherit',
                                    color: 'inherit',
                                    fontWeight: 'inherit'
                                }}
                            />
                        ) : (
                            <div onClick={() => handleTextClick(text.id, text.content)}>
                                {text.content}
                            </div>
                        )}
                        <button
                            onClick={() => handleDelete(text.id)}
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

export default PreviewText;