
const Images = () => {
    return (
        <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                <div key={i} className="aspect-square bg-gradient-to-br from-green-200 to-blue-200 rounded-lg cursor-pointer hover:scale-105 transition-transform">
                </div>
            ))}
        </div>
    )
}

export default Images
