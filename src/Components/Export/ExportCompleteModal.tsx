import { Download, Edit, RotateCcw } from 'lucide-react';

interface ExportCompleteModalProps {
    processedVideo: {
        url: string;
        name: string;
        size: string;
    };
    onDownload: () => void;
    onEditAgain: () => void;
    onNewExport: () => void;
}

const ExportCompleteModal = ({
    processedVideo,
    onDownload,
    onEditAgain,
    onNewExport
}: ExportCompleteModalProps) => {
    return (
        <div className="fixed inset-0 bg-black/80 font-monasans flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Download className="w-8 h-8 text-green-500" />
                    </div>
                    <h2 className="text-2xl font-semibold mb-1">Export Complete!</h2>
                    <p className="text-gray-500">{processedVideo.name}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl flex justify-between items-center mb-6 border border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="text-blue-500 font-medium">MP4</span>
                        </div>
                        <div>
                            <p className="font-medium">{processedVideo.size}</p>
                            <p className="text-gray-500 text-sm">High Quality</p>
                        </div>
                    </div>
                    <button
                        onClick={onNewExport}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"
                        title="Export again"
                    >
                        <RotateCcw className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-3">
                    <button
                        onClick={onDownload}
                        className="w-full py-3.5 cursor-pointer bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
                    >
                        <Download className="w-5 h-5" />
                        <span>Download Video</span>
                    </button>

                    <button
                        onClick={onEditAgain}
                        className="w-full py-3 cursor-pointer border-2 border-gray-200 hover:border-gray-300 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-gray-50 transition-all"
                    >
                        <Edit className="w-5 h-5" />
                        <span>Edit Again</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExportCompleteModal;