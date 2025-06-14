import {  Undo2, Redo2, Upload } from 'lucide-react';
import { useState } from 'react';
import logo from '../assets/logo.jpg'; 

const Header = () => {
    const [projectName, setProjectName] = useState('New Project');
    return (
        <div className="flex items-center font-dmsans justify-between px-8 py-2 bg-[#f1f3f4] flex-shrink-0 shadow-sm">
            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-5">
                    <div className="w-10 h-10 flex items-center justify-center">
                        <img src={logo} alt="" className='rounded-full' />
                    </div>
                    <input
                        type="text"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        className="w-32 px-3 py-1 sm:px-4 sm:py-1.5 bg-white/80 backdrop-blur-sm rounded-lg text-center text-slate-700 font-medium shadow-sm focus:outline-none text-sm sm:text-sm"
                        placeholder="Project Name"
                    />
                </div>
            </div>

            <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                    <button className="p-2 hover:bg-gray-100 rounded-md transition-colors">
                        <Undo2 className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-md transition-colors">
                        <Redo2 className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors ">
                    <Upload className="w-4 h-4" />
                    <span className='text-sm font-semibold'>Export</span>
                </button>
            </div>
        </div>
    );
};

export default Header;