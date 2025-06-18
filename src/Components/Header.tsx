import { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../Slices/store';
import HeaderControls from './Export/HeaderControls';
import { toast } from 'sonner';

const Header = () => {
    const [projectName, setProjectName] = useState('New Project');
    const uploadedVideos = useSelector((state: RootState) => state.video.uploadedVideos);
    const splitPoints = useSelector((state: RootState) => state.video.splitPoints);

    const handleExportClick = () => {
        if (uploadedVideos.length === 0) {
            toast.error('Please upload a video first.');
            return;
        }
    };

    return (
        <>
            <HeaderControls
                projectName={projectName}
                onProjectNameChange={setProjectName}
                onExportClick={handleExportClick}
                splitPoints={splitPoints}
            />
        </>
    );
};

export default Header;