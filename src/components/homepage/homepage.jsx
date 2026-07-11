import './homepage.css';

import { AnimatePresence, motion } from "framer-motion";

import MyLink from '../links';
import MyButton from '../button';
import TicTacToe from '../../projects/ticTacToe/ticTacToe';
import Conways from '../../projects/conways/conways'
import Fourier from '../../projects/fourier/fourier'
import ChromaReducer from '../../projects/chromaReducer/chromaReducer';
import { useEffect, useRef, useState } from 'react';

const imageModules = import.meta.glob('../../assets/myPhotos/*.{jpg,png,jpeg,svg,webp}', { eager: true });
const photos = Object.values(imageModules).map(mod => mod.default);
import mazeVisual from '../../assets/videos/maze.mp4';
import { Link, useNavigate } from 'react-router-dom';
import ReflexPong from '../../projects/reflexpong/reflexpong';
import Numberdle from '../../projects/numberdle/numberdle';
import Nim from '../../projects/nim/nim';
import PerspectiveProjection from '../../projects/perspectiveProjection/perspectiveProjection';

const simulLab = [
    ["UNBEATABLE TIC TAC TOE", "An optimized adversarial project that merges a raw Minimax decision tree with hardcoded strategic heuristics. This dual-layer architecture guarantees an unbeatable, zero-loss performance while keeping processing overhead at absolute zero.", <TicTacToe></TicTacToe>, "Behind the grid, the engine continuously evaluates all active board patterns, instantly identifying optimal paths to attack or defend. By calculating future game states and executing hardcoded tactical protocols, the system can flawlessly trap the opponent or execute escape sequences to neutralize any threat."],
    ["CONWAY'S GAME OF LIFE", "A zero-player cellular automaton simulating biological population dynamics on a infinite two-dimensional grid. Regulated by a precise deterministic rule matrix, the system visualizes the emergence of complex life cycles, stable structures, and chaotic patterns from simple initial configurations.", <Conways></Conways>, "Behind the grid, the engine executes a continuous game loop that evaluates every cell in parallel. By analyzing the states of each cell's eight immediate neighbors, the system updates the entire matrix simultaneously according to Conway's classic laws of survival, birth, and death.What makes this simulation fascinating is its computational unpredictability: the system is non-invertible, meaning you cannot calculate the exact state of the 'n'th generation without computing every single preceding iteration. The interactive interface allows you to pause the loop, manually toggle individual pixel nodes, and engineer your own custom biological configurations and self-replicating species."],
    ["FOURIER ORBITAL SYNTHESIZER", "A geometric signal processing sandbox utilizing discrete Fourier analysis. The simulation deconstructs arbitrary two-dimensional vector paths and coordinate inputs into a finite series of rotating epicycles. By calculating precise orbital frequencies, amplitudes, and phase differentials, the engine synthesizes complex waveform harmonics and traces continuous paths in real-time.", <Fourier></Fourier>, "Behind the canvas, it's pure math. Signal Analysis and Fourier Transform"],
    ["REFLEX PONG", "An optimized, high-velocity 1v1 arcade deck designed to test human reflex limits against a zero-latency computer processing unit. The player interface controls a tactical barrier along the lower grid vector while the AI automation module maintains a mathematical lock on the payload's trajectory along the upper baseline.", <ReflexPong></ReflexPong>, "Behind the canvas, the program is doing just one thing, keeping track of the ball's x-coordinate and matching the computer's slab's x-coordinate with it every millisecond. This tiny synchronization makes it undefeatable for any speed of the ball."],
    ["NUMBERDLE", "Numberdle is a fast-paced, addictive number-guessing game inspired by the Wordle concept. Instead of hunting for words, your mission is to crack a randomly generated secret number. With adjustable difficulty settings, it’s the ultimate test for your logic and deduction skills!", <Numberdle></Numberdle>, "Similar to Wordle, Numberdle is a game where a random 'MAX NUMBER LENGTH' digit number is generated, then you have to guess the number by entering your guesses in return of information depicted by colors, grey - the digit is not in the original number, orange - the digit is in the original number but not at the correct place and green - the digit is in the original number and at the correct place. What makes it interesting is that unlike Wordle, where words had meaning, so it was easier to guess, Numberdle has numbers, totally random, with repeating digits, making it a lot more challenging."],
    ["CHROMATIC REDUCER", "An interactive digital image processing tool designed to analyze complex graphic data arrays and compress their visual profiles down to their most fundamental color frequencies. By extracting and clustering the raw RGB data coordinates of an uploaded image, the engine strips out thousands of transitional color variants and replaces them with a hyper-optimized, high-contrast palette of the most dominant tones.", <ChromaReducer></ChromaReducer>, "The reason why images look realistic is because of the varity of colors modern day cameras have achieved to capture, but when we shrink this capability down to the most occuring colors in the image and replacing it with the ones which are slightly different from it (controlled by MAX DEL), we control the varity of colors, giving the image a whole new essence. Behind the canvas, the program plots out the most occuring colors with their frequencies, then loops through every pixel to find its closest neigbour (based on MAX DEL) from the most occuring color down to least occuring one. Using caching technnique, the whole image is scanned in milliseconds to achieve lag-free experience."],
    ["NIM", "In this Misère Nim variant, two players alternate removing 1 to 3 matches from a single pile of 15, with the critical rule that the player forced to take the last remaining match loses. The opponent is an AI trained via Reinforcement Learning against itself for over 100,000 iterations.", <Nim></Nim>, "Behind the scenes, the program checks for the current state of matches, looks up in the Q-Table for the state, checks the values for each move and picks the one with the maximum value. The Q-Table is made by training the AI against itself for 100,000 iterations to maximize win via Reinforcement Learning."],
    ["PERSPECTIVE PROJECTION", "A lightweight, front-end 3D graphics engine built entirely from scratch in React without relying on external web game engines (like Three.js or Unity). This project demonstrates the fundamental mathematics behind modern computer graphics, converting a collection of 3D coordinates into a dynamic, interactive 2D perspective view on an HTML5 Canvas.", <PerspectiveProjection></PerspectiveProjection>, "Behind the canvas, the rendering engine functions as a structured data pipeline that processes geometric transformations in a strict chronological sequence. Every time the application's state parameters change, the user's raw 3D vertices are mapped to localized space, subjected to sequential Euler angle rotation computations, and restored back to global world space. From there, perspective division automatically scales the horizontal and vertical vectors according to their relative depth values, preparing them for final translation onto the 2-dimensional viewport pixel grid."]
]

const applicableColors = ["#FFFF00", "#00FFFF", "#FF00FF", "#FFB300", "#FF5500", "#CCA300", "#00FF66", "#00E5FF", "#A3FF00"]

function randint(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function choice(array) {
    return array[randint(0, array.length)];
}

function Homepage() {
    const sandCanvasRef = useRef(null);
    const sandDataRef = useRef({});
    const photoSlideshowIntervalRef = useRef(null);

    const isDrawingRef = useRef(false);
    const currentDrawingColorRef = useRef('#FF00FF');

    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

    const navigate = useNavigate()

    useEffect(() => {
        const canvas = sandCanvasRef.current;
        if (!canvas) return;

        const canvasWidth = Math.floor(canvas.offsetWidth);
        const canvasHeight = Math.floor(canvas.offsetHeight);
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        const totalPixels = canvasWidth * canvasHeight;
        const bgColor = "#0A0A0A";

        let particlesData = sandDataRef.current;

        function spawnSand(color, quantity) {
            let attempts = 0;
            let spawned = 0;
            const maxSpawnIndex = totalPixels;

            while (spawned < quantity && attempts < quantity * 3) {
                let targetIndex = randint(0, maxSpawnIndex);
                if (particlesData[targetIndex] === undefined) {
                    particlesData[targetIndex] = color;
                    spawned++;
                }
                attempts++;
            }
        }

        const ctx = canvas.getContext('2d');
        let animationFrameId;

        function renderCanvas() {
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);

            const imgData = ctx.createImageData(canvasWidth, canvasHeight);

            for (let i = 0; i < imgData.data.length; i += 4) {
                imgData.data[i] = 10;
                imgData.data[i + 1] = 10;
                imgData.data[i + 2] = 10;
                imgData.data[i + 3] = 255;
            }

            particlesData = sandDataRef.current;

            for (const indexStr in particlesData) {
                const index = parseInt(indexStr);
                const color = particlesData[index];
                const dataOffset = index * 4;

                if (color) {
                    const r = parseInt(color.slice(1, 3), 16);
                    const g = parseInt(color.slice(3, 5), 16);
                    const b = parseInt(color.slice(5, 7), 16);

                    imgData.data[dataOffset] = r;
                    imgData.data[dataOffset + 1] = g;
                    imgData.data[dataOffset + 2] = b;
                }
            }

            ctx.putImageData(imgData, 0, 0);

            gravity();
            animationFrameId = requestAnimationFrame(renderCanvas);
        }

        function gravity() {
            const activeIndices = Object.keys(particlesData).map(Number).sort((a, b) => b - a);
            const nextParticlesData = {};

            for (let i = 0; i < activeIndices.length; i++) {
                const currentIndex = activeIndices[i];
                const color = particlesData[currentIndex];

                const coordX = currentIndex % canvasWidth;
                const coordY = Math.floor(currentIndex / canvasWidth);

                if (coordY >= canvasHeight - 1) {
                    nextParticlesData[currentIndex] = color;
                    continue;
                }

                const directDown = currentIndex + canvasWidth;
                const downLeft = directDown - 1;
                const downRight = directDown + 1;

                if (particlesData[directDown] === undefined && nextParticlesData[directDown] === undefined) {
                    nextParticlesData[directDown] = color;
                }
                else {
                    const dynamicPaths = [];
                    if (coordX > 0 && particlesData[downLeft] === undefined && nextParticlesData[downLeft] === undefined) {
                        dynamicPaths.push(downLeft);
                    }
                    if (coordX < canvasWidth - 1 && particlesData[downRight] === undefined && nextParticlesData[downRight] === undefined) {
                        dynamicPaths.push(downRight);
                    }

                    if (dynamicPaths.length > 0) {
                        nextParticlesData[choice(dynamicPaths)] = color;
                    } else {
                        nextParticlesData[currentIndex] = color;
                    }
                }
            }

            particlesData = nextParticlesData;
            sandDataRef.current = nextParticlesData;
        }

        spawnSand('#FF00FF', 2000);
        spawnSand('#00FFFF', 2000);
        spawnSand('#FFFF00', 2000);

        renderCanvas();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    const addSandAtEventLocation = (e) => {
        const canvas = sandCanvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();

        const isTouch = e.touches && e.touches.length > 0;
        const clientX = isTouch ? e.touches[0].clientX : e.clientX;
        const clientY = isTouch ? e.touches[0].clientY : e.clientY;

        const relativeX = clientX - rect.left;
        const relativeY = clientY - rect.top;

        const mouseX = Math.floor((relativeX / rect.width) * canvas.width);
        const mouseY = Math.floor((relativeY / rect.height) * canvas.height);

        const radius = 1;
        for (let dy = -radius; dy <= radius; dy++) {
            for (let dx = -radius; dx <= radius; dx++) {
                const targetX = mouseX + dx;
                const targetY = mouseY + dy;

                if (targetX >= 0 && targetX < canvas.width && targetY >= 0 && targetY < canvas.height) {
                    const index = targetY * canvas.width + targetX;
                    sandDataRef.current[index] = currentDrawingColorRef.current;
                }
            }
        }
    };

    const handleStart = (e) => {
        isDrawingRef.current = true;
        currentDrawingColorRef.current = choice(applicableColors);
        addSandAtEventLocation(e);
    };

    const handleMove = (e) => {
        if (!isDrawingRef.current) return;

        if (e.cancelable) {
            e.preventDefault();
        }

        addSandAtEventLocation(e);
    };

    const handleEnd = () => {
        isDrawingRef.current = false;
    };

    const handleMouseDown = (e) => {
        isDrawingRef.current = true;

        currentDrawingColorRef.current = choice(applicableColors);

        addSandAtMouse(e);
    };

    const handleMouseMove = (e) => {
        if (!isDrawingRef.current) return;
        addSandAtMouse(e);
    };

    const handleMouseUpOrLeave = () => {
        isDrawingRef.current = false;
    };

    return (
        <main>
            <div id="topLineDiv">
                <div id="topLineTags">
                    <p style={{ color: 'var(--neonAmber)' }}>// ASPIRING ENGINEER</p>
                    <p style={{ color: 'var(--matrixGreen)' }}>// AUTOMATING LIFESTYLE</p>
                </div>
                <motion.div id="topLine" initial={{ flex: 0 }} animate={{ flex: 1 }} transition={{ duration: 0.5, ease: 'easeOut', type: 'spring' }}></motion.div>
            </div>

            <div id='div1'>
                <motion.div id='div1Left' initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5, ease: 'easeOut' }}>
                    <div id='div1LeftTop'>
                        <h1>BUILDING SYNERACTIVE SYSTEMS.</h1>
                        <p>Creative engineer bridging the gap between hardware architecture and full-stack software. Merging custom Python backends, reactive interfaces, and microcontroller intelligence into premium, fully customizable projects designed to elevate lifestyle efficiency.</p>
                    </div>
                    <div id='div1LeftBottom'>
                        <MyButton type='type1' text="CONNECT" onClickAction={() => { navigate('/contact') }}></MyButton>
                    </div>
                </motion.div>
                <motion.div id='div1Right' initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5, ease: 'easeOut' }}>
                    <div id='div1PhotoFrame' onClick={() => {
                        setCurrentPhotoIndex(currentPhotoIndex === photos.length - 1 ? 0 : currentPhotoIndex + 1)

                    }}>
                        <motion.img src={photos[currentPhotoIndex]} alt="Slideshow frame content" />
                    </div>
                </motion.div>
            </div>

            <motion.div id='div2' initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, ease: 'easeOut' }}>
                <canvas
                    ref={sandCanvasRef}
                    onMouseDown={handleStart}
                    onMouseMove={handleMove}
                    onMouseUp={handleEnd}
                    onMouseLeave={handleEnd}
                    onTouchStart={handleStart}
                    onTouchMove={handleMove}
                    onTouchEnd={handleEnd}
                    style={{ cursor: 'crosshair', touchAction: 'none' }}
                ></canvas>
            </motion.div>
            <motion.div id='div3' initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}>
                <div id='div3Head'>
                    <p><span>T</span>HE <span>S</span>IMULATION <span>L</span>AB</p>
                </div>
                <div id='div3List'>
                    {simulLab.map((item, index) => <div className='card' key={index}>
                        <div>{item[2]}</div>
                        <div>
                            <div>
                                <div className='cardHead'>0b{index.toString(2)} {item[0]}</div>
                                <div className='cardDesc'>{item[1]}</div>
                            </div>
                            <div className='cardBTS'>{item[3]}</div>
                        </div>
                    </div>)}
                </div>
            </motion.div>

            <motion.div id='div4' initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}>
                <div id='div4Head'>
                    <p><span>I</span>NDEPENDENT <span>P</span>ROJECTS</p>
                </div>
                <div id='div4List'>
                    <div className='div4Card'>
                        <div className='div4CardContent'>
                            <div>
                                <div className='div4CardHead'><span>00</span> MAZE</div>
                                <div className='div4CardDesc'>An interactive web application built to explore the mathematics of maze generation and pathfinding algorithms. The platform allows users to visualize generation and solving processes step-by-step, play through the generated puzzles natively, and share playable maze designs via URLs.</div>
                                <div className='div4CardTechs'>
                                    <div className='div4CardTag'>React</div>
                                    <div className='div4CardTag'>HTML5 Canvas</div>
                                    <div className='div4CardTag'>Procedural Generation</div>
                                </div>
                            </div>
                            <div>
                                <div className='div4CardLinks'>
                                    <a href={'https://anshhh-btw.github.io/maze/'}> // VISIT SITE</a>
                                </div>
                                <div className='div4CardLinks'>
                                    <Link to={'https://github.com/anshhh-btw/maze'}> // VISIT REPO</Link>
                                </div>
                            </div>
                        </div>
                        <div className='div4CardVisual'>
                            <video src={mazeVisual} autoPlay loop muted playsInline>
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    </div>

                    <div className='div4Card' style={{ alignSelf: 'flex-start' }}>
                        <div className='div4CardContent'>
                            <div>
                                <div className='div4CardHead'><span>//</span> MAKING MORE</div>
                                <div className='div4CardDesc'>Working constantly to explore new ideas and understand them with crystal clarity by building them.</div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </main>
    );
}

export default Homepage;