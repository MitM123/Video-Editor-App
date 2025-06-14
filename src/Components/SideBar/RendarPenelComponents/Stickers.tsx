
const Stickers = () => {
    return (
        <div className="grid grid-cols-4 gap-3">
            {['😀', '😍', '🎉', '⭐', '❤️', '👍', '🔥', '✨', '🎈', '🎊', '🌟', '💫'].map((emoji, i) => (
                <div key={i} className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-2xl cursor-pointer hover:scale-110 transition-transform hover:bg-gray-200">
                    {emoji}
                </div>
            ))}
        </div>
    )
}

export default Stickers
