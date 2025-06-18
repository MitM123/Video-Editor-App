import React, { useState, useRef } from 'react';
import { Upload, Download, Play, Settings, X } from 'lucide-react';

// FFmpeg Web Assembly interface
declare global {
  interface Window {
    FFmpeg: any;
  }
}

interface Position {
  x: number;
  y: number;
}

const VideoOverlayApp: React.FC = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [position, setPosition] = useState<Position>({ x: 10, y: 10 });
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<string>('');
  const [outputVideoUrl, setOutputVideoUrl] = useState<string>('');
  const [ffmpeg, setFFmpeg] = useState<any>(null);
  
  const videoInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Initialize FFmpeg
  const initFFmpeg = async () => {
    if (ffmpeg) return ffmpeg;
    
    try {
      const { FFmpeg } = await import('@ffmpeg/ffmpeg');
      const { fetchFile } = await import('@ffmpeg/util');
      
      const ffmpegInstance = new FFmpeg();
      
      ffmpegInstance.on('log', ({ message }: { message: string }) => {
        setProgress(message);
      });
      
      await ffmpegInstance.load();
      setFFmpeg(ffmpegInstance);
      return ffmpegInstance;
    } catch (error) {
      console.error('Failed to load FFmpeg:', error);
      setProgress('Failed to initialize FFmpeg. Please refresh and try again.');
      return null;
    }
  };

  // Handle file uploads
  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setVideoUrl(URL.createObjectURL(file));
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  // Process video with image overlay
  const processVideo = async () => {
    if (!videoFile || !imageFile) {
      alert('Please upload both video and image files');
      return;
    }

    setIsProcessing(true);
    setProgress('Initializing FFmpeg...');

    try {
      const ffmpegInstance = await initFFmpeg();
      if (!ffmpegInstance) {
        throw new Error('Failed to initialize FFmpeg');
      }

      setProgress('Reading input files...');
      
      // Convert files to Uint8Array
      const videoData = new Uint8Array(await videoFile.arrayBuffer());
      const imageData = new Uint8Array(await imageFile.arrayBuffer());

      // Write files to FFmpeg filesystem
      await ffmpegInstance.writeFile('input.mp4', videoData);
      await ffmpegInstance.writeFile('overlay.png', imageData);

      setProgress('Processing video with overlay...');

      // Execute FFmpeg command
      await ffmpegInstance.exec([
        '-i', 'input.mp4',
        '-i', 'overlay.png',
        '-filter_complex', `[1:v]format=rgba[over];[0:v][over]overlay=${position.x}:${position.y}:format=auto`,
        '-c:v', 'libx264',
        '-preset', 'fast',
        '-crf', '23',
        '-c:a', 'copy',
        '-movflags', '+faststart',
        '-f', 'mp4',
        'output.mp4'
      ]);

      setProgress('Reading output file...');
      
      // Read the processed video
      const outputData = await ffmpegInstance.readFile('output.mp4');
      
      // Create blob URL for download
      const blob = new Blob([outputData], { type: 'video/mp4' });
      const url = URL.createObjectURL(blob);
      setOutputVideoUrl(url);

      setProgress('Video processing completed successfully!');

      // Cleanup FFmpeg files
      await ffmpegInstance.deleteFile('input.mp4');
      await ffmpegInstance.deleteFile('overlay.png');
      await ffmpegInstance.deleteFile('output.mp4');

    } catch (error) {
      console.error('Processing failed:', error);
      setProgress(`Error: ${error}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Download processed video
  const downloadVideo = () => {
    if (!outputVideoUrl) return;
    
    const link = document.createElement('a');
    link.href = outputVideoUrl;
    link.download = 'video_with_overlay.mp4';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Reset all states
  const resetAll = () => {
    setVideoFile(null);
    setImageFile(null);
    setVideoUrl('');
    setImageUrl('');
    setOutputVideoUrl('');
    setProgress('');
    setPosition({ x: 10, y: 10 });
    if (videoInputRef.current) videoInputRef.current.value = '';
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-blue-800 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-pink-500 to-orange-500 p-8 text-white text-center">
            <h1 className="text-4xl font-bold mb-2">Video Overlay Studio</h1>
            <p className="text-lg opacity-90">Add image overlays to your videos with FFmpeg</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Upload Files</h2>
              
              {/* Video Upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-blue-500 transition-colors">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  ref={videoInputRef}
                  className="hidden"
                  id="video-upload"
                />
                <label
                  htmlFor="video-upload"
                  className="flex flex-col items-center cursor-pointer"
                >
                  <Upload className="w-12 h-12 text-blue-500 mb-2" />
                  <span className="text-lg font-medium text-gray-700">
                    {videoFile ? videoFile.name : 'Upload Video'}
                  </span>
                  <span className="text-sm text-gray-500 mt-1">MP4, MOV, AVI supported</span>
                </label>
              </div>

              {/* Image Upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-green-500 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  ref={imageInputRef}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center cursor-pointer"
                >
                  <Upload className="w-12 h-12 text-green-500 mb-2" />
                  <span className="text-lg font-medium text-gray-700">
                    {imageFile ? imageFile.name : 'Upload Image'}
                  </span>
                  <span className="text-sm text-gray-500 mt-1">PNG, JPG, SVG supported</span>
                </label>
              </div>

              {/* Position Controls */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Overlay Position
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">X Position</label>
                    <input
                      type="number"
                      value={position.x}
                      onChange={(e) => setPosition(prev => ({ ...prev, x: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Y Position</label>
                    <input
                      type="number"
                      value={position.y}
                      onChange={(e) => setPosition(prev => ({ ...prev, y: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                    />
                  </div>
                </div>
                
                {/* Quick Position Buttons */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quick Positions</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setPosition({ x: 10, y: 10 })}
                      className="px-3 py-2 text-xs bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      Top Left
                    </button>
                    <button
                      onClick={() => setPosition({ x: 0, y: 10 })}
                      className="px-3 py-2 text-xs bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      Top Center
                    </button>
                    <button
                      onClick={() => setPosition({ x: 0, y: 0 })}
                      className="px-3 py-2 text-xs bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      Center
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Preview</h2>
              
              {/* Video Preview */}
              {videoUrl && (
                <div className="bg-black rounded-xl overflow-hidden">
                  <video
                    src={videoUrl}
                    controls
                    className="w-full h-auto"
                    style={{ maxHeight: '300px' }}
                  />
                </div>
              )}

              {/* Image Preview */}
              {imageUrl && (
                <div className="bg-gray-100 rounded-xl p-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Overlay Image:</p>
                  <img
                    src={imageUrl}
                    alt="Overlay"
                    className="max-w-full h-auto rounded-lg"
                    style={{ maxHeight: '150px' }}
                  />
                </div>
              )}

              {/* Progress */}
              {(isProcessing || progress) && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-center">
                    {isProcessing && (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-3"></div>
                    )}
                    <span className="text-blue-800 text-sm">{progress}</span>
                  </div>
                </div>
              )}

              {/* Output Video */}
              {outputVideoUrl && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <p className="text-green-800 font-medium mb-3">✅ Video processed successfully!</p>
                  <video
                    src={outputVideoUrl}
                    controls
                    className="w-full h-auto rounded-lg mb-3"
                    style={{ maxHeight: '200px' }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={processVideo}
              disabled={!videoFile || !imageFile || isProcessing}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Play className="w-5 h-5 mr-2" />
              {isProcessing ? 'Processing...' : 'Process Video'}
            </button>

            {outputVideoUrl && (
              <button
                onClick={downloadVideo}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl font-medium hover:from-green-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Download className="w-5 h-5 mr-2" />
                Download Video
              </button>
            )}

            <button
              onClick={resetAll}
              className="flex items-center px-6 py-3 bg-gray-600 text-white rounded-xl font-medium hover:bg-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <X className="w-5 h-5 mr-2" />
              Reset All
            </button>
          </div>

          {/* Instructions */}
          <div className="mt-8 p-6 bg-gray-50 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">How to use:</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Upload your video file (MP4, MOV, AVI)</li>
              <li>Upload your image file (PNG, JPG, SVG) for overlay</li>
              <li>Set the position where you want the image to appear</li>
              <li>Click "Process Video" to add the overlay</li>
              <li>Download your processed video</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoOverlayApp;