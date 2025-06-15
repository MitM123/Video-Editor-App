import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { addText } from '../../../Slices/Text/Text.slice';
import { v4 as uuidv4 } from 'uuid';

const Text = () => {
    const dispatch = useDispatch();

    const handleAddText = (type: 'heading' | 'subheading' | 'body') => {
        const defaultStyles = {
            heading: {
                fontSize: 32,
                color: '#1f2937',
                fontWeight: 'bold'
            },
            subheading: {
                fontSize: 24,
                color: '#4b5563',
                fontWeight: 'normal'
            },
            body: {
                fontSize: 16,
                color: '#6b7280',
                fontWeight: 'normal'
            }
        };

        const newText = {
            id: uuidv4(),
            content: type === 'heading' ? 'Heading' :
                type === 'subheading' ? 'Subheading' : 'Body text',
            type,
            position: { x: 100, y: 100 },
            style: defaultStyles[type]
        };

        dispatch(addText(newText));
    };

    return (
        <div className="space-y-3">
            <motion.div
                className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAddText('heading')}
            >
                <h3 className="text-2xl font-bold text-gray-800">Add Heading</h3>
            </motion.div>
            <motion.div
                className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAddText('subheading')}
            >
                <p className="text-lg text-gray-600">Add Subheading</p>
            </motion.div>
            <motion.div
                className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAddText('body')}
            >
                <p className="text-base text-gray-500">Add body text</p>
            </motion.div>
        </div>
    );
};

export default Text;