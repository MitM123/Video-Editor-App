import { Play } from "lucide-react"

const Videos = () => {
    return (
        <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="aspect-square bg-gradient-to-br from-blue-200 to-purple-200 rounded-lg flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
                    <Play className="w-6 h-6 text-white" />
                </div>
            ))}
        </div>
    )
}

export default Videos
