import React from 'react'

const Shapes = () => {
    return (
        <div className="grid grid-cols-4 gap-3">
            <div className="aspect-square bg-blue-500 rounded-lg cursor-pointer hover:scale-105 transition-transform"></div>
            <div className="aspect-square bg-red-500 rounded-full cursor-pointer hover:scale-105 transition-transform"></div>
            <div className="aspect-square bg-green-500 cursor-pointer hover:scale-105 transition-transform transform rotate-45"></div>
            <div className="aspect-square bg-yellow-500 cursor-pointer hover:scale-105 transition-transform" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div>
            <div className="aspect-square bg-purple-500 rounded-lg cursor-pointer hover:scale-105 transition-transform"></div>
            <div className="aspect-square bg-pink-500 rounded-full cursor-pointer hover:scale-105 transition-transform"></div>
        </div>
    )
}

export default Shapes
