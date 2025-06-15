interface ExportQualityModalProps {
    selectedQuality: '720p' | '1080p';
    onQualitySelect: (quality: '720p' | '1080p') => void;
    onClose: () => void;
}

const ExportQualityModal = ({ selectedQuality, onQualitySelect, onClose }: ExportQualityModalProps) => {
    return (
        <div className="fixed inset-0 font-monasans bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-xl">
                <h3 className="text-xl font-semibold mb-5 text-center">Select Export Quality</h3>
                <div className="space-y-4 mb-6">
                    <button
                        onClick={() => onQualitySelect('720p')}
                        className="w-full p-4 border-2 border-gray-200 rounded-xl flex justify-between items-center hover:border-blue-500 hover:bg-blue-50 transition-all"
                    >
                        <div className="text-left">
                            <p className="font-medium">720p HD</p>
                            <p className="text-gray-500 text-sm">1280×720 • Medium Quality</p>
                        </div>
                        <div className="w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center">
                            {selectedQuality === '720p' && (
                                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                            )}
                        </div>
                    </button>

                    <button
                        onClick={() => onQualitySelect('1080p')}
                        className="w-full p-4 border-2 border-gray-200 rounded-xl flex justify-between items-center hover:border-blue-500 hover:bg-blue-50 transition-all"
                    >
                        <div className="text-left">
                            <p className="font-medium">1080p Full HD</p>
                            <p className="text-gray-500 text-sm">1920×1080 • High Quality</p>
                        </div>
                        <div className="w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center">
                            {selectedQuality === '1080p' && (
                                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                            )}
                        </div>
                    </button>
                </div>

                <div className="flex justify-between">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-500 hover:text-gray-700 font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onQualitySelect(selectedQuality)}
                        className="px-6 py-2 bg-blue-500 hover:bg-blue-600 cursor-pointer text-white rounded-lg font-medium"
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExportQualityModal;