import { useSelector } from 'react-redux';
import type { RootState } from '../Slices/store';


const Preview = () => {
  const uploadedVideos = useSelector((state: RootState) => state.video.uploadedVideos);

  return (
    <div className="flex flex-col  items-center justify-cente font-monasans font-semibold p-4">
      {uploadedVideos.length === 0 ? (
        <p className="text-gray-600 text-lg">No videos uploaded yet.</p>
      ) : (
        uploadedVideos.map((video, index) => (
          <div key={index} className="mb-6">
            <video
              width="240"
              height="60"
              controls
              className="rounded-lg shadow-lg"
            >
              <source src={video.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            {/* <p className="text-center mt-2 text-gray-800 font-medium">{video.name}</p> */}
          </div>
        ))
      )}
    </div>
  );
};

export default Preview;
