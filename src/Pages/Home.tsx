import { Play, Scissors, Sparkles, Type, ChevronRight, Video, Music } from 'lucide-react';
import { useNavigate } from 'react-router';

const Home = () => {

    const navigate = useNavigate();
    const features = [
        { icon: Scissors, title: "Smart Trimming", desc: "Precision cuts with AI assistance" },
        { icon: Sparkles, title: "Advanced Filters", desc: "Professional-grade effects" },
        { icon: Type, title: "Dynamic Text", desc: "Animated overlays & titles" },
        { icon: Music, title: "Audio Sync", desc: "Perfect background music" }
    ];

    return (
        <div className="min-h-screen  bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-monasans text-gray-900 overflow-hidden relative">
            <nav className='relative z-10 p-6 transition-all duration-1000'>
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                            <Video className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                            VideoForge
                        </span>
                    </div>
                    <div className="hidden md:flex items-center space-x-8">
                        <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-full font-medium hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl">
                            Start Editing
                        </button>
                    </div>
                </div>
            </nav>

            <section className="relative z-10 px-6 py-20">
                <div className="max-w-7xl mx-auto text-center">
                    <div className='transition-all duration-1500'>
                        <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
                            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Create
                            </span>
                            <br />
                            <span className="text-gray-800">Epic Videos</span>
                        </h1>
                        <p className="text-md md:text-lg text-gray-600 mb-8 max-w-3xl mx-auto font-semibold leading-relaxed">
                            Professional video editing in your browser. Trim, filter, animate, and produce stunning content without downloading software.
                        </p>
                    </div>

                    <div className='flex flex-col sm:flex-row justify-center items-center mb-16 transition-all duration-2000'>
                        <button onClick={() => navigate('/editor')} className="bg-gradient-to-r from-blue-600 cursor-pointer to-indigo-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2">
                            <Play className="w-5 h-5" />
                            <span>Start Creating</span>
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto transition-all duration-2500`}>
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className='p-6 rounded-2xl backdrop-blur-sm border transition-all transform hover:scale-105 
                                    hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 hover:border-blue-200 
                                    bg-white/60 border-gray-200  shadow-md hover:shadow-lg'>
                                <feature.icon className='w-8 h-8 mx-auto mb-3 hover:text-blue-600 text-gray-500' />
                                <h3 className="font-semibold mb-2 text-gray-800">{feature.title}</h3>
                                <p className="text-sm text-gray-600">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section >

        </div >
    );
};

export default Home;