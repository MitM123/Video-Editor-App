import { Upload } from "lucide-react"

const Uploads = () => {
    return (
        <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
            <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="text-sm font-medium mb-1">No uploads yet</p>
            <p className="text-xs text-gray-400">Upload your files to get started</p>
        </div>
    )
}

export default Uploads
