import { useState, useRef, useCallback } from 'react';
import { Upload, Play, Trash } from "lucide-react";

const VideoUploads = () => {
    const [uploadedVideos, setUploadedVideos] = useState<{ url: string, name: string }[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = useCallback((files: FileList | null) => {
        if (files && files.length > 0) {
            const newVideos = Array.from(files).map(file => ({
                url: URL.createObjectURL(file),
                name: file.name
            }));
            setUploadedVideos(prev => [...prev, ...newVideos]);
        }
    }, []);

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleUpload(e.target.files);
        e.target.value = ''; 
    };

    const handleRemove = (index: number) => {
        URL.revokeObjectURL(uploadedVideos[index].url);
        setUploadedVideos(prev => prev.filter((_, i) => i !== index));
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        handleUpload(e.dataTransfer.files);
    };

    return (
        <div className="space-y-4">
            {uploadedVideos.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {uploadedVideos.map((video, index) => (
                            <div key={index} className="relative group rounded-lg overflow-hidden border border-gray-200">
                                <div className="aspect-video bg-gray-100 relative">
                                    <video
                                        className="w-full h-full object-cover"
                                        disablePictureInPicture
                                        disableRemotePlayback
                                    >
                                        <source src={video.url} type="video/mp4" />
                                    </video>
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all">
                                        <Play className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </div>
                                <div className="p-2 bg-white">
                                    <p className="text-sm font-medium truncate">{video.name}</p>
                                    <button
                                        onClick={() => handleRemove(index)}
                                        className="absolute cursor-pointer top-2 right-2 "
                                    >
                                        <Trash className="w-4 h-4 text-white" strokeWidth={3} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={triggerFileInput}
                        className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors flex flex-col items-center justify-center gap-1"
                    >
                        <Upload className="w-5 h-5" />
                        <span className="text-sm">Click to upload or drag & drop files here</span>
                    </button>
                </>
            ) : (
                <div
                    onClick={triggerFileInput}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragging ? 'bg-blue-50 border-2 border-blue-300' : 'bg-gray-50 border-2 border-dashed border-gray-300'}`}
                >
                    <Upload className={`w-12 h-12 mx-auto mb-3 ${isDragging ? 'text-blue-400' : 'text-gray-400'}`} />
                    <p className={`text-sm font-medium mb-1 ${isDragging ? 'text-blue-500' : 'text-gray-500'}`}>
                        {isDragging ? 'Drop your videos here' : 'Click to upload'}
                    </p>
                    <p className={`text-xs ${isDragging ? 'text-blue-400' : 'text-gray-400'}`}>
                        or drag & drop files here
                    </p>
                </div>
            )}

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileInputChange}
                className="hidden"
                accept="video/*"
                multiple
            />
        </div>
    );
};

export default VideoUploads;