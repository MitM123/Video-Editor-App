
const Text = () => {
    return (
        <div className="space-y-3">
            <div className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <h3 className="text-2xl font-bold text-gray-800">Add Heading</h3>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <p className="text-lg text-gray-600">Add Subheading</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <p className="text-base text-gray-500">Add body text</p>
            </div>
        </div>
    )
}

export default Text
