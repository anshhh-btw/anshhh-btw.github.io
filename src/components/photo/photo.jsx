import { useState } from 'react';
import './photo.css';

import { motion } from 'framer-motion';

const imageModules = import.meta.glob('../../assets/myPhotos/*.{jpg,png,jpeg,svg,webp}', { eager: true });
const photos = Object.values(imageModules).map(mod => mod.default);

function PhotoFrame() {
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    return <div id='div1PhotoFrame' onClick={() => {
        setCurrentPhotoIndex(currentPhotoIndex === photos.length - 1 ? 0 : currentPhotoIndex + 1)

    }}>
        <motion.img src={photos[currentPhotoIndex]} alt="Slideshow frame content" />
    </div>
}

export default PhotoFrame;