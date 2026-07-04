import { useState, useEffect, useRef } from 'react';
import './reflexpong.css';

function ReflexPong() {
    const canvasRef = useRef(null);
    const [currentResult, setCurrentResult] = useState("SURVIVING");
    const [gameActive, setGameActive] = useState(true);

    const gameState = useRef({
        ball: { x: 125, y: 125, dx: 3, dy: -3, size: 6, speedMultiplier: 1.05 },
        player: { x: 105, y: 244, width: 40, height: 6, speed: 15 }, ai: { x: 105, y: 0, width: 40, height: 6 },
        keys: { left: false, right: false }
    });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const updateGame = () => {
            if (!gameActive) return;

            const state = gameState.current;
            const { ball, player, ai, keys } = state;

            if (keys.left && player.x > 0) {
                player.x -= player.speed;
            }
            if (keys.right && player.x + player.width < canvas.width) {
                player.x += player.speed;
            }

            ai.x = ball.x - ai.width / 2;

            if (ai.x < 0) ai.x = 0;
            if (ai.x + ai.width > canvas.width) ai.x = canvas.width - ai.width;

            ball.x += ball.dx;
            ball.y += ball.dy;

            if (ball.x - ball.size <= 0 || ball.x + ball.size >= canvas.width) {
                ball.dx = -ball.dx;
            }

            if (ball.y - ball.size <= ai.y + ai.height &&
                ball.x >= ai.x && ball.x <= ai.x + ai.width && ball.dy < 0) {
                ball.dy = -ball.dy;
                ball.dx *= ball.speedMultiplier;
                ball.dy *= ball.speedMultiplier;
            }

            if (ball.y + ball.size >= player.y &&
                ball.x >= player.x && ball.x <= player.x + player.width && ball.dy > 0) {
                ball.dy = -ball.dy;
                ball.dx *= ball.speedMultiplier;
                ball.dy *= ball.speedMultiplier;
            }

            if (ball.y - ball.size > canvas.height) {
                setGameActive(false);
                setCurrentResult("YOU LOST");
                return;
            }

            ctx.fillStyle = "#0A0A0A";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.strokeStyle = "rgba(255, 85, 0, 0.05)";
            ctx.lineWidth = 1;
            for (let i = 0; i < canvas.width; i += 25) {
                ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
            }

            ctx.fillStyle = "#FF5500";
            ctx.fillRect(player.x, player.y, player.width, player.height);

            ctx.fillStyle = "#FF3300";
            ctx.fillRect(ai.x, ai.y, ai.width, ai.height);

            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(ball.x - ball.size / 2, ball.y - ball.size / 2, ball.size, ball.size);

            animationFrameId = requestAnimationFrame(updateGame);
        };

        const handleKeyDown = (e) => {
            if (["ArrowLeft", "a", "ArrowRight", "d"].includes(e.key)) {
                e.preventDefault();
            }

            if (e.key === "ArrowLeft" || e.key === "a") gameState.current.keys.left = true;
            if (e.key === "ArrowRight" || e.key === "d") gameState.current.keys.right = true;
        };

        const handleKeyUp = (e) => {
            if (["ArrowLeft", "a", "ArrowRight", "d"].includes(e.key)) {
                e.preventDefault();
            }

            if (e.key === "ArrowLeft" || e.key === "a") gameState.current.keys.left = false;
            if (e.key === "ArrowRight" || e.key === "d") gameState.current.keys.right = false;
        };
        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        animationFrameId = requestAnimationFrame(updateGame);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, [gameActive]);

    const handleControlPress = (direction, isPressed) => {
        gameState.current.keys[direction] = isPressed;
    };

    const resetGame = () => {
        gameState.current.ball = { x: 125, y: 125, dx: 3, dy: -3, size: 6, speedMultiplier: 1.03 };
        gameState.current.player.x = 105;
        setCurrentResult("SURVIVING");
        setGameActive(true);
    };

    return (
        <div className='reflexPong'>
            {gameActive ? (
                <div id='gameDiv'>
                    <div>
                        <canvas ref={canvasRef} style={{ backgroundColor: "#0A0A0A" }} width={250} height={250}></canvas>
                    </div>
                    <div className="control-buttons">
                        <div
                            onMouseDown={() => handleControlPress('left', true)}
                            onMouseUp={() => handleControlPress('left', false)}
                            onTouchStart={() => handleControlPress('left', true)}
                            onTouchEnd={() => handleControlPress('left', false)}
                            className="btn-ctrl"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FF5500">
                                <path d="M400-240 160-480l240-240 56 58-142 142h486v80H314l142 142-56 58Z" />
                            </svg>
                        </div>
                        <div
                            onMouseDown={() => handleControlPress('right', true)}
                            onMouseUp={() => handleControlPress('right', false)}
                            onTouchStart={() => handleControlPress('right', true)}
                            onTouchEnd={() => handleControlPress('right', false)}
                            className="btn-ctrl"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FF5500">
                                <path d="m560-240-56-58 142-142H160v-80h486L504-662l56-58 240 240-240 240Z" />
                            </svg>
                        </div>
                    </div>
                </div>
            ) : (
                <div id='resultDiv' className="game-over-panel">
                    <div className="status-readout">
                        RESULT: <span className="fail-text">{currentResult}</span>
                    </div>
                    <button onClick={resetGame} className="play-again-btn">
                        [PLAY AGAIN]
                    </button>
                </div>
            )}
        </div>
    );
}

export default ReflexPong;