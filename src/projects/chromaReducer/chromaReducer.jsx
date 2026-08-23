import { useEffect, useRef, useState } from 'react';
import './chromaReducer.css';
import defaultImage from './gengarwp.png'

function ChromaReducer() {
    const [currentActivity, setCurrentActivity] = useState(1);
    const [imagePreview, setImagePreview] = useState(defaultImage);
    const canvasRef = useRef(null);
    const [maxDel, setMaxDel] = useState(32)

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();

            reader.onloadend = () => {
                setImagePreview(reader.result);
            };

            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        if (imagePreview && imagePreview.startsWith('blob:')) {
            URL.revokeObjectURL(imagePreview);
        }
        setImagePreview(null);
        setCurrentActivity(0);
    };


    const editImage = () => {
        setCurrentActivity(1)
    }

    useEffect(() => {
        if (!imagePreview || currentActivity !== 1) return;

        const img = new Image();
        img.src = imagePreview;
        img.onload = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');

            let aspectRatio = img.width / img.height;
            let width = 300;
            let height = 300;
            if (aspectRatio < 1) {
                width = aspectRatio * height;
            } else {
                height = width / aspectRatio;
            }

            width = Math.round(width);
            height = Math.round(height);

            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);

            const imageData = ctx.getImageData(0, 0, width, height);
            const PIXELS = imageData.data;
            const len = PIXELS.length;

            const occ = new Map();
            for (let i = 0; i < len; i += 4) {
                const key = (PIXELS[i] << 24) | (PIXELS[i + 1] << 16) | (PIXELS[i + 2] << 8) | PIXELS[i + 3];
                occ.set(key, (occ.get(key) || 0) + 1);
            }

            const sortedPalette = Array.from(occ.entries())
                .sort((a, b) => b[1] - a[1])
                .map(([key]) => [
                    (key >> 24) & 0xFF,
                    (key >> 16) & 0xFF,
                    (key >> 8) & 0xFF,
                    key & 0xFF
                ]);

            const newPixels = new Uint8ClampedArray(len);
            const cache = new Map();
            const paletteLen = sortedPalette.length;
            const delta = Number(maxDel);

            for (let i = 0; i < len; i += 4) {
                const r = PIXELS[i];
                const g = PIXELS[i + 1];
                const b = PIXELS[i + 2];
                const a = PIXELS[i + 3];

                const key = (r << 24) | (g << 16) | (b << 8) | a;

                if (cache.has(key)) {
                    const match = cache.get(key);
                    newPixels[i] = match[0];
                    newPixels[i + 1] = match[1];
                    newPixels[i + 2] = match[2];
                    newPixels[i + 3] = match[3];
                    continue;
                }

                let matchedColor = sortedPalette[0];
                for (let j = 0; j < paletteLen; j++) {
                    const pal = sortedPalette[j];
                    if (Math.abs(r - pal[0]) <= delta &&
                        Math.abs(g - pal[1]) <= delta &&
                        Math.abs(b - pal[2]) <= delta &&
                        Math.abs(a - pal[3]) <= delta) {
                        matchedColor = pal;
                        break;
                    }
                }

                cache.set(key, matchedColor);
                newPixels[i] = matchedColor[0];
                newPixels[i + 1] = matchedColor[1];
                newPixels[i + 2] = matchedColor[2];
                newPixels[i + 3] = matchedColor[3];
            }

            const newImageData = new ImageData(newPixels, width, height);
            ctx.putImageData(newImageData, 0, 0);
        };
    }, [currentActivity, maxDel, imagePreview]);

    return (
        <div id='chromaReducerVisual'>
            {currentActivity ?
                <div id='finalImage'>
                    <canvas ref={canvasRef}></canvas>
                    <div>
                        <input type='range' max={255} min={0} defaultValue={32} onChange={(e) => {
                            setMaxDel(e.currentTarget.value)
                        }}></input>
                        <div>MAX DEL: {maxDel}</div>
                    </div>
                    <div>
                        <button id='resetButton' onClick={() => {
                            setImagePreview(null);
                            setCurrentActivity(0)
                        }}>RESET</button>
                    </div>
                </div> :
                <div id='uploadImage'>
                    {imagePreview ? (
                        <div id="previewContainer">
                            <img
                                src={imagePreview}
                                alt="Uploaded preview"
                                style={{ maxWidth: '100%', maxHeight: '400px', display: 'block' }}
                            />
                            <div>
                                <button onClick={handleRemoveImage} id="removeBtn">
                                    Change
                                </button>
                                <button onClick={editImage} id='editBtn'>
                                    Continue
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <label id='fileUploadLabel' htmlFor='fileUpload'>Choose a File</label>
                            <input
                                type='file'
                                id='fileUpload'
                                name='fileUpload'
                                accept='image/*'
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                            />
                        </>
                    )}
                </div>}
        </div>
    );
}

export default ChromaReducer;