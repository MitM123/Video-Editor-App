import {
    Search,
    X
} from 'lucide-react';
import Audio from './RendarPenelComponents/Audio';
import Elements from './RendarPenelComponents/Elements';
import Filter from './RendarPenelComponents/Filter';
import Images from './RendarPenelComponents/Images';
import Shapes from './RendarPenelComponents/Shapes';
import Stickers from './RendarPenelComponents/Stickers';
import Text from './RendarPenelComponents/Text';
import Uploads from './RendarPenelComponents/Uploads';
import Videos from './RendarPenelComponents/Videos';

const SideBarPanel = ({ activeItem, isOpen, onClose }: { activeItem: string; isOpen: boolean; onClose: () => void }) => {
    if (!isOpen) return null;

    const renderPanelContent = () => {
        switch (activeItem) {
            case 'elements':
                return (
                    <Elements />
                );

            case 'uploads':
                return (
                    <Uploads />
                );

            case 'videos':
                return (
                    <Videos />
                );

            case 'filters':
                return (
                    <Filter />
                );

            case 'audio':
                return (
                    <Audio />
                );

            case 'images':
                return (
                    <Images />
                );

            case 'text':
                return (
                    <Text />
                );

            case 'shapes':
                return (
                    <Shapes />
                );

            case 'stickers':
                return (
                    <Stickers />
                );

            default:
                return null;
        }
    };

    return (
        <div className="w-80 h-full bg-white font-monasans border-r border-gray-200 overflow-y-auto">
            <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">{activeItem.charAt(0).toUpperCase() + activeItem.slice(1)}</h2>
                    <div className="flex items-center gap-2">
                        <button onClick={onClose} className='cursor-pointer'>
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>
                </div>

                <div className="mb-4">
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-lg text-sm"
                        />
                    </div>
                </div>
                {renderPanelContent()}
            </div>
        </div>
    );
};

export default SideBarPanel;