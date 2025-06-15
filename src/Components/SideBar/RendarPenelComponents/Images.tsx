import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { addImage } from '../../../Slices/Image/Image.slice';
import second from '../../../assets/2.jpg';
import third from '../../../assets/3.jpg';
import fourth from '../../../assets/4.jpg';
import fifth from '../../../assets/5.jpg';
import sixth from '../../../assets/6.jpg';
import seventh from '../../../assets/7.jpg';
import eighth from '../../../assets/8.jpg';

const Images = () => {
    const dispatch = useDispatch();

    const imageData = [
        { id: 1, bg: "bg-gradient-to-br from-blue-400 to-purple-600", image: third, name: "Image 1" },
        { id: 2, bg: "bg-gradient-to-br from-gray-300 to-gray-500", image: fourth, name: "Image 2" },
        { id: 4, bg: "bg-gradient-to-br from-blue-300 to-blue-500", image: second, name: "Image 3" },
        { id: 5, bg: "bg-gradient-to-br from-gray-400 to-gray-600", image: seventh, name: "Image 4" },
        { id: 6, bg: "bg-gradient-to-br from-yellow-300 to-red-400", image: eighth, name: "Image 5" },
        { id: 7, bg: "bg-gradient-to-br from-green-400 to-green-600", image: sixth, name: "Image 6" },
        { id: 8, bg: "bg-gradient-to-br from-orange-300 to-orange-500", image: fifth, name: "Image 7" },
    ];

    const handleImageClick = (image: typeof imageData[0]) => {
        dispatch(addImage({
            id: image.id,
            url: image.image,
            name: image.name,
            position: { x: 0, y: 0 }
        }));
    };

    return (
        <div className="w-full mx-auto">
            <div className="grid grid-cols-2 grid-rows-3 gap-3 overscroll-y-auto">
                {imageData.map((image) => (
                    <motion.div
                        key={image.id}
                        className={`${image.bg} col-span-1 row-span-1 rounded-lg cursor-pointer hover:scale-105 transition-transform duration-200 shadow-sm hover:shadow-md relative`}
                        onClick={() => handleImageClick(image)}
                        whileHover={{ scale: 1.05 }}
                    >
                        <div className="w-full h-full flex items-center justify-center text-white font-semibold opacity-70">
                            <img
                                src={image.image}
                                alt={`Image ${image.id}`}
                                className="w-full h-full object-cover rounded-lg"
                            />
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Images;