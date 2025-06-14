import { Music2 } from 'lucide-react'

const Audio = () => {
    return (
        <div className="space-y-2">
            {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-900 rounded-lg p-3 flex items-center gap-3 cursor-pointer hover:bg-gray-800 transition-colors">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <Music2 className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                        <p className="text-white text-sm font-medium">Audio Track {i}</p>
                        <p className="text-gray-400 text-xs">0:30</p>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Audio
