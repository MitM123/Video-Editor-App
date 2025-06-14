import { useState } from 'react';
import {
    LayoutTemplate,
    Layers3,
    Upload,
    Play,
    Music2,
    Image,
    Type,
    Pentagon,
    Sticker
} from 'lucide-react';

const SideBar = () => {
    const [activeItem, setActiveItem] = useState('templates');

    const sidebarItems = [
        {
            id: 'templates',
            icon: LayoutTemplate,
            label: 'Example\nTemplates'
        },
        {
            id: 'elements',
            icon: Layers3,
            label: 'Elements'
        },
        {
            id: 'uploads',
            icon: Upload,
            label: 'Uploads'
        },
        {
            id: 'videos',
            icon: Play,
            label: 'Videos'
        },
        {
            id: 'audio',
            icon: Music2,
            label: 'Audio'
        },
        {
            id: 'images',
            icon: Image,
            label: 'Images'
        },
        {
            id: 'text',
            icon: Type,
            label: 'Text'
        },
        {
            id: 'shapes',
            icon: Pentagon,
            label: 'Shapes'
        },
        {
            id: 'stickers',
            icon: Sticker,
            label: 'Stickers'
        }
    ];

    const handleItemClick = (itemId: string) => {
        setActiveItem(itemId);
    };

    return (
        <div className="w-20 flex flex-col bg-tertiary py-2 overflow-y-auto h-full">
            {sidebarItems.map(({ id, icon: Icon, label }) => (
                <button
                    key={id}
                    onClick={() => handleItemClick(id)}
                    className={`flex flex-col items-center py-4 px-2 mx-2 my-1 rounded-lg transition duration-200
        ${activeItem === id
                            ? 'bg-white text-gray-800 shadow-sm'
                            : 'text-gray-600 hover:bg-white hover:bg-opacity-50'
                        }`}
                >
                    <Icon className="w-5 h-5 mb-1.5" />
                    <span className="text-xs font-medium text-center leading-tight whitespace-pre-line">
                        {label}
                    </span>
                </button>
            ))}
        </div>


    );
};

export default SideBar;