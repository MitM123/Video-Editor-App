import { useState } from 'react';
import {
    Layers3,
    Upload,
    Play,
    Music2,
    Image,
    Type,
    SmilePlus,
    SquaresExclude
} from 'lucide-react';
import SideBarPanel from './SideBarPenel';
import { AnimatePresence, motion } from 'framer-motion';

const SideBar = () => {
    const [activeItem, setActiveItem] = useState('elements');

    const sidebarItems = [
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
            icon: SquaresExclude,
            label: 'Shapes'
        },
        {
            id: 'stickers',
            icon: SmilePlus,
            label: 'Stickers'
        }
    ];

    const handleItemClick = (itemId: string) => {
        if (activeItem === itemId && isPanelOpen) {
            setIsPanelOpen(false);
        } else {
            setActiveItem(itemId);
            setIsPanelOpen(true);
        }
    };
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const panelVariants: any = {
        open: {
            opacity: 1,
            width: "auto",
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 30
            }
        },
        closed: {
            opacity: 0,
            width: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 30
            }
        }
    };

    return (
        <>
            <div className="w-20 pb-16 flex flex-col font-dmsans bg-tertiary overflow-y-auto border-r border-gray-200">
                {sidebarItems.map(({ id, icon: Icon, label }) => (
                    <button
                        key={id}
                        onClick={() => handleItemClick(id)}
                        className={`flex flex-col items-center py-3 px-1 mx-2 my-1 rounded-lg transition duration-200
                        ${activeItem === id ? 'bg-white text-gray-800 font-semibold shadow-sm' : 'text-gray-600 hover:bg-white hover:bg-opacity-50'}`}
                    >
                        <Icon className="w-[18px] h-[18px] mb-1.5" strokeWidth={2} />
                        <span className="text-xs font-medium text-center leading-tight whitespace-pre-line">
                            {label}
                        </span>
                    </button>
                ))}
            </div>

            <AnimatePresence>
                {isPanelOpen && (
                    <motion.div
                        className=" overflow-hidden"
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={panelVariants}
                    >
                        <div className="h-full min-w-[320px]">
                            <SideBarPanel
                                activeItem={activeItem}
                                isOpen={isPanelOpen}
                                onClose={() => setIsPanelOpen(false)}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>

    );
};

export default SideBar;