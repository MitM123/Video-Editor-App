import { Undo2, Redo2, Upload } from 'lucide-react';
import logo from '../../assets/logo.jpg';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../Slices/store';
import { ActionCreators } from 'redux-undo';

interface HeaderControlsProps {
    projectName: string;
    onProjectNameChange: (name: string) => void;
    onExportClick: () => void;
}

const HeaderControls = ({ projectName, onProjectNameChange, onExportClick }: HeaderControlsProps) => {
    const dispatch = useDispatch();
    const { past, future } = useSelector((state: RootState) => state.shapes);
    return (
        <div className="flex items-center font-dmsans justify-between px-8 py-2 bg-[#f1f3f4] flex-shrink-0 shadow-sm">
            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-5">
                    <div className="w-10 h-10 flex items-center justify-center">
                        <img src={logo} alt="Logo" className='rounded-full w-full h-full object-cover' />
                    </div>
                    <input
                        type="text"
                        value={projectName}
                        onChange={(e) => onProjectNameChange(e.target.value)}
                        className="w-32 px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-lg text-center text-slate-700 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
                        placeholder="Project Name"
                    />
                </div>
            </div>

            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-white/80 rounded-lg px-2 py-1 shadow-sm">
                    <button
                        className="p-1.5 cursor-pointer hover:bg-gray-100 rounded-md transition-colors"
                        title="Undo"
                        onClick={() => dispatch(ActionCreators.undo())}
                        disabled={!past.length}
                    >
                        <Undo2 className="w-5 h-5 text-gray-600" />
                    </button>
                    <button
                        className="p-1.5 cursor-pointer hover:bg-gray-100 rounded-md transition-colors"
                        title="Redo"
                        onClick={() => dispatch(ActionCreators.redo())}
                        disabled={!future.length}
                    >
                        <Redo2 className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                <button
                    onClick={onExportClick}
                    className="flex items-center space-x-2 cursor-pointer px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-md transition-all shadow-md hover:shadow-lg"
                >
                    <Upload className="w-4 h-4" />
                    <span className='text-sm font-semibold'>Export</span>
                </button>
            </div>
        </div>
    );
};

export default HeaderControls;