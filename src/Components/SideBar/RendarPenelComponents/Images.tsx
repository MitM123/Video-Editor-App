import { image } from 'framer-motion/client';
import second from '../../../assets/2.jpg';
import third from '../../../assets/3.jpg';
import fourth from '../../../assets/4.jpg';
import fifth from '../../../assets/5.jpg';
import sixth from '../../../assets/6.jpg';
import seventh from '../../../assets/7.jpg';
import eighth from '../../../assets/8.jpg';


const Images = () => {
    const imageData = [
        {
            id: 1,
            bg: "bg-gradient-to-br from-blue-400 to-purple-600",
            image: third,
        },
        {
            id: 2,
            bg: "bg-gradient-to-br from-gray-300 to-gray-500",
            size: "col-span-1 row-span-1",
            image: fourth
        },
        {
            id: 4,
            bg: "bg-gradient-to-br from-blue-300 to-blue-500",
            size: "col-span-2 row-span-1",
            image: second
        },
        {
            id: 5,
            bg: "bg-gradient-to-br from-gray-400 to-gray-600",
             size: "col-span-2 row-span-1",
            image: seventh
        },
        {
            id: 6,
            bg: "bg-gradient-to-br from-yellow-300 to-red-400",
            size: "col-span-2 row-span-1",
            image: eighth
        },
        {
            id: 7,
            bg: "bg-gradient-to-br from-green-400 to-green-600",
            size: "col-span-1 row-span-1",
            image: sixth
        },
        {
            id: 8,
            bg: "bg-gradient-to-br from-orange-300 to-orange-500",
            size: "col-span-1 row-span-1",
            image: fifth
        },
    ];

    return (
        <div className="w-full mx-auto">
            <div className="grid grid-cols-2 grid-rows-3 gap-3 overscroll-y-auto">
                {imageData.map((image) => (
                    <div 
                        key={image.id}
                        className={`${image.bg} ${image.size} rounded-lg cursor-pointer hover:scale-105 transition-transform duration-200 shadow-sm hover:shadow-md`}
                    >
                        <div className="w-full h-full flex items-center justify-center text-white font-semibold opacity-70">
                            <img 
                                src={image.image} 
                                alt={`Image ${image.id}`} 
                                className="w-full h-full object-cover rounded-lg"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Images;