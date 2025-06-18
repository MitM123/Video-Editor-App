import { useDispatch, useSelector } from 'react-redux';
import { Rnd } from 'react-rnd';
import type { RootState } from '../../Slices/store';
import { updateTextContent, updateTextPosition, setEditing, deleteText } from '../../Slices/Text/Text.slice';
import { useEffect, useRef, useState } from 'react';

const PreviewText = () => {
    const dispatch = useDispatch();
    const texts = useSelector((state: RootState) => state.text.texts);
    const [activeTextId, setActiveTextId] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const textRefs = useRef<Record<string, HTMLDivElement | null>>({});

    const handleDoubleClick = (id: string) => {
        dispatch(setEditing({ id, isEditing: true }));
        setActiveTextId(id);
        setIsEditing(true);
    };

    const handleBlur = (id: string, content: string) => {
        dispatch(updateTextContent({ id, content }));
        dispatch(setEditing({ id, isEditing: false }));
        setActiveTextId(id);
        setIsEditing(false);
    };

    const handleClick = (id: string) => {
        if (!isEditing) {
            setActiveTextId(id);
        }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Backspace' && activeTextId && !isEditing) {
                dispatch(deleteText(activeTextId));
                setActiveTextId(null);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [activeTextId, dispatch, isEditing]);

    return (
        <>
            {texts.map((text) => (
                <Rnd
                    key={text.id}
                    position={{ x: text.position.x, y: text.position.y }}
                    onDragStop={(_, d) => {
                        dispatch(updateTextPosition({
                            id: text.id,
                            position: { x: d.x, y: d.y }
                        }));
                    }}
                    style={{
                        zIndex: text.id === activeTextId ? 20 : 10,
                        fontSize: `${text.style.fontSize}px`,
                        color: text.style.color,
                        fontWeight: text.style.fontWeight,
                        cursor: 'move',
                        outline: text.id === activeTextId ? '2px dashed #3b82f6' : 'none'
                    }}
                    onClick={() => handleClick(text.id)}
                >
                    <div
                        className="group relative p-2 bg-white bg-opacity-80 rounded"
                        ref={el => { textRefs.current[text.id] = el; return; }}
                    >
                        {text.isEditing ? (
                            <input
                                type="text"
                                defaultValue={text.content}
                                onBlur={(e) => handleBlur(text.id, e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleBlur(text.id, e.currentTarget.value);
                                    }
                                }}
                                autoFocus
                                className="w-full outline-none bg-transparent"
                                style={{
                                    fontSize: 'inherit',
                                    color: 'inherit',
                                    fontWeight: 'inherit'
                                }}
                                onMouseDown={(e) => e.stopPropagation()}
                            />
                        ) : (
                            <div
                                onDoubleClick={() => handleDoubleClick(text.id)}
                                style={{ minHeight: '1em' }}
                            >
                                {text.content || <span className="opacity-50">Double-click to edit</span>}
                            </div>
                        )}
                    </div>
                </Rnd>
            ))}
        </>
    );
};

export default PreviewText;