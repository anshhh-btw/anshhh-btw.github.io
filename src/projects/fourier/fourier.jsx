import { useRef, useEffect, useState } from 'react';
import './fourier.css';

function Fourier() {
    const fourierCanvasRef = useRef(null);
    const animationRef = useRef(null);

    const [rawPoints, setRawPoints] = useState([]);
    const [processedCircles, setProcessedCircles] = useState([]);

    const [status, setStatus] = useState('drawing');
    const [isDrawing, setIsDrawing] = useState(false);

    const [inputResolution, setInputResolution] = useState(1);
    const [harmonicLimit, setHarmonicLimit] = useState(1);
    const [deltaTime, setDeltaTime] = useState(1);

    const [isPlaying, setIsPlaying] = useState(false);
    const [timeIndex, setTimeIndex] = useState(0);
    const [drawnPathHistory, setDrawnPathHistory] = useState([]);

    useEffect(() => {
        const canvas = fourierCanvasRef.current;
        if (!canvas) return;

        canvas.width = 300;
        canvas.height = 300;

        const ctx = canvas.getContext('2d');
        ctx.strokeStyle = '#FF5500';
        ctx.lineWidth = 1;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
    }, []);

    useEffect(() => {
        if (status !== 'drawing') return;

        const canvas = fourierCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const getCoordinates = (e) => {
            const rect = canvas.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;

            return {
                x: Math.floor(clientX - rect.left),
                y: Math.floor(clientY - rect.top)
            };
        };

        const startDrawing = (e) => {
            if (e.touches) e.preventDefault();
            const { x, y } = getCoordinates(e);
            setIsDrawing(true);
            setRawPoints([{ x, y }]);

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.beginPath();
            ctx.moveTo(x, y);
        };

        const draw = (e) => {
            if (!isDrawing) return;
            if (e.touches) e.preventDefault();

            const { x, y } = getCoordinates(e);

            setRawPoints((prevPoints) => {
                const lastPoint = prevPoints[prevPoints.length - 1];
                if (!lastPoint || Math.hypot(x - lastPoint.x, y - lastPoint.y) > 4) {
                    ctx.lineTo(x, y);
                    ctx.stroke();
                    return [...prevPoints, { x, y }];
                }
                return prevPoints;
            });
        };

        const stopDrawing = () => {
            if (isDrawing) {
                setIsDrawing(false);
                ctx.closePath();
            }
        };

        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        window.addEventListener('mouseup', stopDrawing);

        canvas.addEventListener('touchstart', startDrawing, { passive: false });
        canvas.addEventListener('touchmove', draw, { passive: false });
        window.addEventListener('touchend', stopDrawing);

        return () => {
            canvas.removeEventListener('mousedown', startDrawing);
            canvas.removeEventListener('mousemove', draw);
            window.removeEventListener('mouseup', stopDrawing);

            canvas.removeEventListener('touchstart', startDrawing);
            canvas.removeEventListener('touchmove', draw);
            window.removeEventListener('touchend', stopDrawing);
        };
    }, [isDrawing, status]);

    const runDFT = (points) => {
        const N = points.length;
        let X = [];

        for (let k = 0; k < N; k++) {
            let re = 0;
            let im = 0;

            for (let n = 0; n < N; n++) {
                const phi = (2 * Math.PI * k * n) / N;
                re += points[n].x * Math.cos(phi) + points[n].y * Math.sin(phi);
                im += -points[n].x * Math.sin(phi) + points[n].y * Math.cos(phi);
            }

            re = re / N;
            im = im / N;

            X.push({
                freq: k,
                amp: Math.hypot(re, im),
                phase: Math.atan2(im, re)
            });
        }

        return X.sort((a, b) => b.amp - a.amp);
    };

    const handleDone = () => {
        if (rawPoints.length < 2) {
            console.log("Draw a definitive path first!");
            return;
        }

        const initialMaxHarmonics = Math.max(1, rawPoints.length);

        setHarmonicLimit(initialMaxHarmonics);
        setInputResolution(1);
        setDeltaTime(1);

        const circles = runDFT(rawPoints);
        setProcessedCircles(circles);

        setStatus('rendering');
        setIsPlaying(true);
        setTimeIndex(0);
        setDrawnPathHistory([]);
    };

    useEffect(() => {
        if (status !== 'rendering' || rawPoints.length === 0) return;

        const skippedPoints = [];
        for (let i = 0; i < rawPoints.length; i += inputResolution) {
            skippedPoints.push(rawPoints[i]);
        }

        if (skippedPoints.length === 0) skippedPoints.push(rawPoints[0]);

        const newCircles = runDFT(skippedPoints);
        setProcessedCircles(newCircles);

        if (harmonicLimit > skippedPoints.length) {
            setHarmonicLimit(skippedPoints.length);
        }

        setDrawnPathHistory([]);
        setTimeIndex(0);
    }, [inputResolution, status]);

    useEffect(() => {
        if (status !== 'rendering' || processedCircles.length === 0) return;

        const canvas = fourierCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const drawFrame = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            let x = 0;
            let y = 0;

            const totalCycles = Math.min(harmonicLimit, processedCircles.length);
            const currentAngleScalar = (2 * Math.PI * timeIndex) / Math.max(1, processedCircles.length);
            ctx.strokeStyle = 'rgba(255, 85, 0, 0.85)';
            ctx.lineWidth = 1;

            for (let i = 0; i < totalCycles; i++) {
                const circle = processedCircles[i];
                const prevX = x;
                const prevY = y;

                if (i === 0) {
                    x += circle.amp * Math.cos(circle.phase);
                    y += circle.amp * Math.sin(circle.phase);
                } else {
                    const currentPhase = circle.freq * currentAngleScalar + circle.phase;
                    x += circle.amp * Math.cos(currentPhase);
                    y += circle.amp * Math.sin(currentPhase);

                    ctx.beginPath();
                    ctx.arc(prevX, prevY, circle.amp, 0, 2 * Math.PI);
                    ctx.stroke();
                }
            }

            const updatedHistory = [...drawnPathHistory, { x, y }];
            if (updatedHistory.length > processedCircles.length * 2) updatedHistory.shift();
            setDrawnPathHistory(updatedHistory);

            if (updatedHistory.length > 1) {
                ctx.strokeStyle = '#00FF66';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(updatedHistory[0].x, updatedHistory[0].y);
                for (let i = 1; i < updatedHistory.length; i++) {
                    ctx.lineTo(updatedHistory[i].x, updatedHistory[i].y);
                }
                ctx.stroke();
            }

            if (isPlaying) {
                setTimeIndex((prevIndex) => (prevIndex + deltaTime));
            }
        };

        if (isPlaying) {
            animationRef.current = requestAnimationFrame(drawFrame);
        } else {
            drawFrame();
        }

        return () => cancelAnimationFrame(animationRef.current);
    }, [processedCircles, timeIndex, isPlaying, harmonicLimit, deltaTime, status, drawnPathHistory]);

    const handleReset = () => {
        cancelAnimationFrame(animationRef.current);
        const canvas = fourierCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setRawPoints([]);
        setProcessedCircles([]);
        setDrawnPathHistory([]);
        setTimeIndex(0);
        setStatus('drawing');
        setIsPlaying(false);
    };

    const stepNextFrame = () => {
        setIsPlaying(false);
        setTimeIndex((prev) => prev + deltaTime);
    };

    const maxResolutionValue = Math.max(1, Math.floor(rawPoints.length / 2));
    const maxHarmonicsValue = processedCircles.length || 1;

    return (
        <div id='fourierVisual'>
            <div id='fourierCanvas'>
                <canvas ref={fourierCanvasRef} />
            </div>

            <div id='controls'>
                {status === 'drawing' && (
                    <div className="controlGroup">
                        <button onClick={handleDone}>DONE</button>
                        <button onClick={handleReset}>RESET</button>
                    </div>
                )}

                {status === 'rendering' && (
                    <div className="controlGroup flexColumn" id='control2'>
                        <div className="sliderMetrics">
                            <label>
                                Res Skipping: {inputResolution}
                                <input
                                    type='range'
                                    min='1'
                                    max={maxResolutionValue}
                                    value={inputResolution}
                                    onChange={(e) => setInputResolution(parseInt(e.target.value))}
                                />
                            </label>

                            <label>
                                Harmonic Limit: {harmonicLimit}
                                <input
                                    type='range'
                                    min='1'
                                    max={maxHarmonicsValue}
                                    value={harmonicLimit}
                                    onChange={(e) => setHarmonicLimit(parseInt(e.target.value))}
                                />
                            </label>

                            <label>
                                Delta T Step: {deltaTime}
                                <input
                                    type='range'
                                    min='1'
                                    max='10'
                                    value={deltaTime}
                                    onChange={(e) => setDeltaTime(parseInt(e.target.value))}
                                />
                            </label>
                        </div>

                        <div className="playbackControls">
                            <button onClick={() => setIsPlaying(!isPlaying)}>
                                {isPlaying ? 'PAUSE' : 'PLAY'}
                            </button>
                            <button onClick={stepNextFrame} disabled={isPlaying}>
                                NEXT FRAME
                            </button>
                            <button onClick={handleReset}>CLEAR & NEW</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Fourier;