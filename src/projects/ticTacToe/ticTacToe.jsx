import { useRef, useState, useEffect } from 'react'
import './ticTacToe.css'
import { motion, AnimatePresence } from 'framer-motion';
import { symbol } from 'framer-motion/client';

function randint(min, max) {
    return Math.floor(Math.random() * (max - min) + min)
}

function choiceIndex(array) {
    return randint(0, array.length);
}

function choice(array) {
    return array[choiceIndex(array)];
}

function TicTacToe() {
    const [boardArray, setBoardArray] = useState(['', '', '', '', '', '', '', '', '']);
    const [realTimeBoardArray, setRealTimeBoardArray] = useState(['', '', '', '', '', '', '', '', '']);
    const [currentSymbol, setCurrentSymbol] = useState('X');
    const [result, setResult] = useState('')
    const [showResultScreen, setShowResultScreen] = useState(false);

    const [playerSymbol, setPlayerSymbol] = useState(() => randint(0, 2) === 1 ? 'O' : 'X');
    const [botSymbol, setBotSymbol] = useState(() => playerSymbol === 'X' ? 'O' : 'X');
    const [playing, setPlaying] = useState(true);
    const [moveHistory, setMoveHistory] = useState([]);

    const cell0Ref = useRef(null);
    const cell1Ref = useRef(null);
    const cell2Ref = useRef(null);
    const cell3Ref = useRef(null);
    const cell4Ref = useRef(null);
    const cell5Ref = useRef(null);
    const cell6Ref = useRef(null);
    const cell7Ref = useRef(null);
    const cell8Ref = useRef(null);
    const cellRefs = [cell0Ref, cell1Ref, cell2Ref, cell3Ref, cell4Ref, cell5Ref, cell6Ref, cell7Ref, cell8Ref]

    useEffect(() => {
        setBotSymbol(playerSymbol === 'X' ? 'O' : 'X');
    }, [playerSymbol]);

    useEffect(() => {
        if (playing && currentSymbol === botSymbol) {
            const botTimer = setTimeout(() => {
                botMove();
            }, 500);
            return () => clearTimeout(botTimer);
        }
    }, [currentSymbol, playing, botSymbol]);

    let patterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ]

    function matchStatus(currentBoard) {
        for (let patternNum in patterns) {
            let pattern = patterns[patternNum]
            let patternVal = pattern.map(x => currentBoard[x]);
            if (patternVal.filter(x => x === playerSymbol).length === 3) {
                return [playerSymbol, parseInt(patternNum)];
            } else if (patternVal.filter(x => x === botSymbol).length === 3) {
                return [botSymbol, parseInt(patternNum)];
            }
        }
        if (currentBoard.filter(x => x === '').length === 0) {
            return [true];
        }
        return [false];
    }

    function botMove() {
        let targetIndex;
        function attackOrDefend() {
            let attackable = []
            let defendable = []
            for (let i in patterns) {
                let pattern = patterns[i];
                let patternVal = pattern.map(x => realTimeBoardArray[x]);
                if (patternVal.filter(x => x === playerSymbol).length === 2 && patternVal.filter(x => x === '').length === 1) {
                    defendable.push(pattern.filter(x => realTimeBoardArray[x] === '')[0])
                }
                if (patternVal.filter(x => x === botSymbol).length === 2 && patternVal.filter(x => x === '').length === 1) {
                    attackable.push(pattern.filter(x => realTimeBoardArray[x] === '')[0])
                }
            }
            if (attackable.length !== 0) {
                return attackable[choiceIndex(attackable)];
            } else if (defendable.length !== 0) {
                return defendable[choiceIndex(defendable)]
            } else {
                return null
            }
        }

        function oppositeCorner(corner) {
            switch (corner) {
                case 0:
                    return 8;
                case 2:
                    return 6;
                case 6:
                    return 2;
                case 8:
                    return 0;
            }
        }

        function adjacentCorners(corner) {
            let corners = []
            switch (corner) {
                case 0:
                    if (realTimeBoardArray[2] === '' && realTimeBoardArray[1] === '') {
                        corners.push(2)
                    }
                    if (realTimeBoardArray[6] === '' && realTimeBoardArray[3] === '') {
                        corners.push(6)
                    }
                    break;
                case 2:
                    if (realTimeBoardArray[0] === '' && realTimeBoardArray[1] === '') {
                        corners.push(0)
                    }
                    if (realTimeBoardArray[8] === '' && realTimeBoardArray[5] === '') {
                        corners.push(8)
                    }
                    break;
                case 6:
                    if (realTimeBoardArray[0] === '' && realTimeBoardArray[3] === '') {
                        corners.push(0)
                    }
                    if (realTimeBoardArray[8] === '' && realTimeBoardArray[7] === '') {
                        corners.push(8)
                    }
                    break;
                case 8:
                    if (realTimeBoardArray[2] === '' && realTimeBoardArray[5] === '') {
                        corners.push(2)
                    }
                    if (realTimeBoardArray[6] === '' && realTimeBoardArray[7] === '') {
                        corners.push(6)
                    }
                    break;
            }
            return corners;
        }

        targetIndex = attackOrDefend()
        if (targetIndex === null) {
            if ('X' === botSymbol) {
                if (moveHistory.length === 0) {
                    targetIndex = choice([0, 2, 6, 8])
                } else if (moveHistory.length === 2) {
                    if (moveHistory[1][0] === 4) {
                        targetIndex = oppositeCorner(moveHistory[0][0])
                    } else {
                        targetIndex = choice(adjacentCorners(moveHistory[0][0]))
                    }
                } else if (moveHistory.length === 4) {
                    if ([1, 3, 5, 7].indexOf(moveHistory[3][0]) > -1) {
                        targetIndex = 4;
                    } else {
                        targetIndex = choice([0, 2, 6, 8].filter(x => boardArray[x] === ''));
                    }
                }
            } else {
                if (moveHistory.length === 1) {
                    if (moveHistory[0][0] === 4) {
                        targetIndex = choice([0, 2, 6, 8])
                    } else {
                        targetIndex = 4;
                    }
                } else if (moveHistory.length === 3) {
                    if ([0, 2, 6, 8].indexOf(moveHistory[0][0]) > -1) {
                        if (moveHistory[2][0] === oppositeCorner(moveHistory[0][0])) {
                            targetIndex = choice([1, 3, 5, 7])
                        }
                    }
                }
            }
        }
        if (targetIndex === null) {
            targetIndex = [0, 1, 2, 3, 4, 5, 6, 7, 8].filter(x => boardArray[x] === '')[choiceIndex([0, 1, 2, 3, 4, 5, 6, 7, 8].filter(x => boardArray[x] === ''))]
        }
        move(targetIndex)
    }

    function move(index) {
        if (!boardArray[index] && playing) {
            const nextSymbol = currentSymbol === 'X' ? 'O' : 'X';
            setMoveHistory(prev => [...prev, [index, currentSymbol]]);

            const updatedBoard = boardArray.map((x, i) => i === index ? currentSymbol : x);
            setBoardArray(updatedBoard);
            setRealTimeBoardArray(updatedBoard);
            setCurrentSymbol(nextSymbol);

            let matchStatusVal = matchStatus(updatedBoard);
            if (matchStatusVal[0]) {
                setPlaying(false);
                declareResult(matchStatusVal);
            }
        }
    }

    function declareResult(matchStatusVal) {
        if (matchStatusVal[0] === true) {
            setResult('DRAW')
        } else {
            let className;
            setResult(`${matchStatusVal[0]} WON!`)
            if (matchStatusVal[1] === 6) {
                className = 'cross3'
            } else if (matchStatusVal[1] === 7) {
                className = 'cross4'
            } else if ([0, 1, 2].indexOf(matchStatusVal[1]) > -1) {
                className = 'cross1'
            } else if ([3, 4, 5].indexOf(matchStatusVal[1]) > -1) {
                className = 'cross2'
            }
            for (let i of patterns[matchStatusVal[1]]) {
                if (cellRefs[i].current) {
                    cellRefs[i].current.className += ` ${className}`;
                }
            }
        }

        setTimeout(() => {
            setShowResultScreen(true);
        }, 2000)
    }

    return (
        <div id="ticTacToeVisual">
            <div id="board">
                <AnimatePresence mode="wait">
                    {!showResultScreen ? (
                        <motion.div
                            key="game-board"
                            id='boardCell'
                            exit={{ opacity: 0 }}
                            style={{ display: 'grid' }}
                        >
                            <div className='cell' ref={cell0Ref} onClick={() => { move(0); }}>{boardArray[0]}</div>
                            <div className='cell' ref={cell1Ref} onClick={() => { move(1); }} style={{ border: '1px dashed var(--safetyOrange)', borderTop: 'none', borderBottom: 'none' }}>{boardArray[1]}</div>
                            <div className='cell' ref={cell2Ref} onClick={() => { move(2); }}>{boardArray[2]}</div>
                            <div className='cell' ref={cell3Ref} onClick={() => { move(3); }} style={{ border: '1px dashed var(--safetyOrange)', borderLeft: 'none', borderRight: 'none' }}>{boardArray[3]}</div>
                            <div className='cell' ref={cell4Ref} onClick={() => { move(4); }} style={{ border: '1px dashed var(--safetyOrange)' }}>{boardArray[4]}</div>
                            <div className='cell' ref={cell5Ref} onClick={() => { move(5); }} style={{ border: '1px dashed var(--safetyOrange)', borderLeft: 'none', borderRight: 'none' }}>{boardArray[5]}</div>
                            <div className='cell' ref={cell6Ref} onClick={() => { move(6); }}>{boardArray[6]}</div>
                            <div className='cell' ref={cell7Ref} onClick={() => { move(7); }} style={{ border: '1px dashed var(--safetyOrange)', borderTop: 'none', borderBottom: 'none' }}>{boardArray[7]}</div>
                            <div className='cell' ref={cell8Ref} onClick={() => { move(8); }}>{boardArray[8]}</div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="result-screen"
                            id='boardRes'
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{ display: 'flex' }}
                        >
                            <motion.div
                                initial={{ width: 0, opacity: 0 }}
                                animate={{ width: 'auto', opacity: 1 }}
                                transition={{ duration: 0.3, ease: 'easeOut' }}
                                style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
                            >
                                RESULT: <span>{result}</span>
                            </motion.div>

                            <motion.button
                                initial={{ width: 0, opacity: 0 }}
                                animate={{ width: 'auto', opacity: 1 }}
                                transition={{ duration: 0.3, ease: 'easeOut', delay: 0.2 }}
                                style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
                                onClick={() => {
                                    setBoardArray(['', '', '', '', '', '', '', '', '']);
                                    setRealTimeBoardArray(['', '', '', '', '', '', '', '', '']);
                                    setResult("");
                                    setMoveHistory([]);
                                    setShowResultScreen(false);

                                    const nextPlayerSymbol = randint(0, 2) === 1 ? 'O' : 'X';
                                    setPlayerSymbol(nextPlayerSymbol);

                                    setCurrentSymbol("X");
                                    setPlaying(true);

                                    for (let cellRef of cellRefs) {
                                        if (cellRef.current) cellRef.current.className = "cell";
                                    }
                                }}
                            >
                                PLAY AGAIN
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div id="stats">
                <div>You (<span>{playerSymbol}</span>)</div>
                <div>Bot (<span>{botSymbol}</span>)</div>
            </div>
        </div>
    );
}

export default TicTacToe;