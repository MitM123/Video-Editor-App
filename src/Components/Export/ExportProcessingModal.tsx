import { Upload } from 'lucide-react';

interface ExportProcessingModalProps {
    selectedQuality: '720p' | '1080p';
}

const ExportProcessingModal = ({ selectedQuality }: ExportProcessingModalProps) => {
    return (
        <div className="fixed inset-0 font-monasans bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="text-center text-white p-8 max-w-md">
                <div className="relative inline-block mb-6">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-400 mx-auto"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Upload className="w-6 h-6 text-blue-400 animate-pulse" />
                    </div>
                </div>
                <h3 className="text-2xl font-medium mb-2">Processing {selectedQuality} Video</h3>
                <p className="text-gray-300 mb-6">Applying effects and optimizing quality...</p>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div className="bg-blue-500 h-2.5 rounded-full animate-pulse w-3/4"></div>
                </div>
            </div>
        </div>
    );
};

export default ExportProcessingModal;