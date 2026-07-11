import { useEffect, useRef, useState } from 'react';
import './perspectiveProjection.css';

function PerspectiveProjection() {
    const canvasRef = useRef(null);
    const [cubeCenter, setCubeCenter] = useState([0, 0, 300]);
    const [cubeRotation, setCubeRotation] = useState([0, 0, 0]);
    const [cubeSize, setCubeSize] = useState(50);
    const [focus, setFocus] = useState(200);
    const width = 300;
    const height = 300;

    useEffect(() => {
        drawCube(canvasRef.current.getContext("2d"));
    }, [cubeCenter, cubeSize, focus, cubeRotation]);

    function translateToOrigin(x, y, z) {
        return [x - cubeCenter[0], y - cubeCenter[1], z - cubeCenter[2]];
    }

    function rotateX(x, y, z, theta) {
        const rad = theta * Math.PI / 180
        return [x, y * Math.cos(rad) - z * Math.sin(rad), y * Math.sin(rad) + z * Math.cos(rad)];
    }
    function rotateY(x, y, z, theta) {
        const rad = theta * Math.PI / 180
        return [x * Math.cos(rad) + z * Math.sin(rad), y, -x * Math.sin(rad) + z * Math.cos(rad)];
    }
    function rotateZ(x, y, z, theta) {
        const rad = theta * Math.PI / 180
        return [x * Math.cos(rad) - y * Math.sin(rad), x * Math.sin(rad) + y * Math.cos(rad), z];
    }

    function translateToCubeCenter(x, y, z) {
        return [x + cubeCenter[0], y + cubeCenter[1], z + cubeCenter[2]];
    }

    function drawCube(ctx) {
        ctx.fillStyle = "#0A0A0A";
        ctx.fillRect(0, 0, width, height)
        const vertices = plotVertices(...cubeCenter, cubeSize);
        const projection = vertices.map(vertex => project(...translateToCubeCenter(...rotateY(...rotateX(...rotateZ(...translateToOrigin(...vertex),cubeRotation[2]),cubeRotation[0]),cubeRotation[1])), focus));
        edgeIndices.map(edge => drawLine(ctx, ...offset(...projection[edge[0]]), ...offset(...projection[edge[1]]), "#00FF66", 2));
    }

    function plotVertices(centerX, centerY, centerZ, size) {
        return ([
            [centerX - size / 2, centerY - size / 2, centerZ - size / 2],
            [centerX - size / 2, centerY + size / 2, centerZ - size / 2],
            [centerX + size / 2, centerY - size / 2, centerZ - size / 2],
            [centerX + size / 2, centerY + size / 2, centerZ - size / 2],
            [centerX - size / 2, centerY - size / 2, centerZ + size / 2],
            [centerX - size / 2, centerY + size / 2, centerZ + size / 2],
            [centerX + size / 2, centerY - size / 2, centerZ + size / 2],
            [centerX + size / 2, centerY + size / 2, centerZ + size / 2],
        ])
    }

    const edgeIndices = [[0, 1], [0, 2], [3, 1], [3, 2], [4, 5], [4, 6], [7, 5], [7, 6], [0, 4], [1, 5], [2, 6], [3, 7]];

    function offset(x, y) {
        return [x + width / 2, y + height / 2];
    }

    function project(x, y, z, f) {
        return [x * f / z, y * f / z];
    }

    function drawLine(ctx, x1, y1, x2, y2, fill, lineWidth) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = fill;
        ctx.lineWidth = lineWidth;
        ctx.stroke()
    }

    return (
        <div id='perspectiveProjectionVisual'>
            <div>
                <canvas width={width} height={height} ref={canvasRef}></canvas>
            </div>
            <div>
                <div>
                    <p>CUBE CENTER: ({cubeCenter[0]},{cubeCenter[1]},{cubeCenter[2]})</p>
                    <div id='centerControl'>
                        <input title="X" min={-width} max={width} value={cubeCenter[0]} type='range' onChange={(e) => {
                            setCubeCenter([parseInt(e.currentTarget.value), cubeCenter[1], cubeCenter[2]]);
                        }}></input>
                        <input title="Y" min={-height} max={height} value={cubeCenter[1]} type='range' onChange={(e) => {
                            setCubeCenter([cubeCenter[0], parseInt(e.currentTarget.value), cubeCenter[2]]);
                        }}></input>
                        <input title="Z" min={200} max={600} value={cubeCenter[2]} type='range' onChange={(e) => {
                            setCubeCenter([cubeCenter[0], cubeCenter[1], parseInt(e.currentTarget.value)]);
                        }}></input>
                    </div>
                </div>
                <div>
                    <div>
                        <p>SIZE: {cubeSize}</p>
                        <input title='Size' min={10} max={300} value={cubeSize} type='range' onChange={(e) => {
                            setCubeSize(parseInt(e.currentTarget.value))
                        }}></input>
                    </div>
                    <div>
                        <p>FOCUS: {focus}</p>
                        <input title='Focus' min={1} max={200} value={focus} type='range' onChange={(e) => {
                            setFocus(parseInt(e.currentTarget.value))
                        }}></input>
                    </div>
                </div>
                <div>
                    <p>ROTATION: ({cubeRotation[0]},{cubeRotation[1]},{cubeRotation[2]})</p>
                    <div id='centerControl'>
                        <input title="X" min={0} max={360} value={cubeRotation[0]} type='range' onChange={(e) => {
                            setCubeRotation([parseInt(e.currentTarget.value), cubeRotation[1], cubeRotation[2]]);
                        }}></input>
                        <input title="Y" min={0} max={360} value={cubeRotation[1]} type='range' onChange={(e) => {
                            setCubeRotation([cubeRotation[0], parseInt(e.currentTarget.value), cubeRotation[2]]);
                        }}></input>
                        <input title="Z" min={0} max={360} value={cubeRotation[2]} type='range' onChange={(e) => {
                            setCubeRotation([cubeRotation[0], cubeRotation[1], parseInt(e.currentTarget.value)]);
                        }}></input>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PerspectiveProjection;