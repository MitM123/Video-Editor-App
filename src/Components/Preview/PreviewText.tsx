import { useDispatch, useSelector } from 'react-redux';
import { Rnd } from 'react-rnd';
import type { RootState } from '../../Slices/store';
import {
    updateTextContent,
    updateTextPosition,
    setEditing,
    deleteText
} from '../../Slices/Text/Text.slice';

const PreviewText = () => {
    const dispatch = useDispatch();
    const texts = useSelector((state: RootState) => state.text.texts);

    const handleDoubleClick = (id: string) => {
        dispatch(setEditing({ id, isEditing: true }));
    };

    const handleBlur = (id: string, content: string) => {
        dispatch(updateTextContent({ id, content }));
        dispatch(setEditing({ id, isEditing: false }));
    };

    const handleDelete = (id: string) => {
        dispatch(deleteText(id));
    };

    return (
        <>
            {texts.map((text) => (
                <Rnd
                    key={text.id}
                    position={{ x: text.position.x, y: text.position.y }}
                    onDragStop={(e, d) => {
                        dispatch(updateTextPosition({
                            id: text.id,
                            position: { x: d.x, y: d.y }
                        }));
                    }}
                    style={{
                        zIndex: 10,
                        fontSize: `${text.style.fontSize}px`,
                        color: text.style.color,
                        fontWeight: text.style.fontWeight,
                        cursor: 'move'
                    }}
                >
                    <div className="group relative p-2 bg-white bg-opacity-80 rounded">
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
                            />
                        ) : (
                            <div onDoubleClick={() => handleDoubleClick(text.id)}>
                                {text.content}
                            </div>
                        )}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(text.id);
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 text-xs pointer-events-auto"
                        >
                            ×
                        </button>
                    </div>
                </Rnd>
            ))}
        </>
    );
};

export default PreviewText;