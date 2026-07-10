import { useEffect, useState } from 'react';
import './nim.css';
import { motion } from 'framer-motion';

function choice(array) {
    return array[Math.floor(Math.random() * (array.length))]
}

var uTurn = choice([0, 1]);
var iTurn = uTurn === 0 ? 1 : 0;

function Nim() {
    const [currentActivity, setCurrentActivity] = useState(0);
    const [lastResult, setLastResult] = useState('NO MATCH PLAYED YET');
    const [matches, setMatches] = useState(15);
    const [turn, setTurn] = useState(0);
    const [matchState, setMatchState] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

    const QTable = {
        '1': [-9.999999999999993, 0, 0],
        '2': [9.999999999999993, -9.997572505549684, 0],
        '3': [-7.909856674167266, 9.999999999999993, -9.997815254994716],
        '4': [-7.206586381382759, -8.110754687085137, 9.999999999999993],
        '5': [-8.850657464688906, -8.259925305282877, -8.555214001055157],
        '6': [8.999999999999986, -6.77531473732386, -6.467683057804888],
        '7': [-3.4269115351095354, 8.999999999999986, -4.325419953563792],
        '8': [-2.6065634576166614, -4.1285369970881, 8.999999999999986],
        '9': [-5.973166918395791, -6.069368735703539, -4.114408023554575],
        '10': [8.09999999999998, -4.287581305334198, -5.235063168020861],
        '11': [-1.7546213761055793, 8.09999999999998, -5.605991306727784],
        '12': [-1.713724979763925, -2.1823439407414824, 8.09999999999998],
        '13': [-2.4009034520771797, -1.1522310527829231, -3.0165922517885004],
        '14': [7.289999999999974, -1.5475733456594079, -2.0865318651281624],
        '15': [-2.167895518513155, 7.289999999999978, 0.456487748772638]
    }

    function botMove() {
        setTimeout(() => {
            if (turn === iTurn) {
                let vals = QTable[matches]
                let maxVal = Math.max(...vals);
                let validMoves = [0, 1, 2].filter(v => v < matches & vals[v] === maxVal);
                pickMatches(choice(validMoves) + 1);
            }
        }, 500)
    }

    function pickMatches(num) {
        setMatchState(matchState.map((v, i) => i < matches - num ? 0 : 1))
        setMatches(matches - num);
        setTurn(turn === 0 ? 1 : 0);
        if (matches - num === 0) {
            setLastResult(`YOU ${turn === uTurn ? "LOST" : "WON"}`)
            setCurrentActivity(0);
            uTurn = choice([0, 1]);
            iTurn = uTurn === 0 ? 1 : 0;
            setMatches(15)
            setTurn(0)
            setMatchState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        }
    }

    useEffect(() => {
        if (turn === iTurn && currentActivity && matches > 0) {
            botMove();
        }
    }, [currentActivity, turn])

    return (
        <div id='nimVisual'>
            {
                currentActivity ?
                    <div id='nimGame'>
                        <div id='nimMatches'>
                            <motion.div className='match' animate={matchState[0] ? { opacity: 0 } : { opacity: 1 }} transition={{ duration: 0.2 }}></motion.div>
                            <motion.div className='match' animate={matchState[1] ? { opacity: 0 } : { opacity: 1 }} transition={{ duration: 0.2 }}></motion.div>
                            <motion.div className='match' animate={matchState[2] ? { opacity: 0 } : { opacity: 1 }} transition={{ duration: 0.2 }}></motion.div>
                            <motion.div className='match' animate={matchState[3] ? { opacity: 0 } : { opacity: 1 }} transition={{ duration: 0.2 }}></motion.div>
                            <motion.div className='match' animate={matchState[4] ? { opacity: 0 } : { opacity: 1 }} transition={{ duration: 0.2 }}></motion.div>
                            <motion.div className='match' animate={matchState[5] ? { opacity: 0 } : { opacity: 1 }} transition={{ duration: 0.2 }}></motion.div>
                            <motion.div className='match' animate={matchState[6] ? { opacity: 0 } : { opacity: 1 }} transition={{ duration: 0.2 }}></motion.div>
                            <motion.div className='match' animate={matchState[7] ? { opacity: 0 } : { opacity: 1 }} transition={{ duration: 0.2 }}></motion.div>
                            <motion.div className='match' animate={matchState[8] ? { opacity: 0 } : { opacity: 1 }} transition={{ duration: 0.2 }}></motion.div>
                            <motion.div className='match' animate={matchState[9] ? { opacity: 0 } : { opacity: 1 }} transition={{ duration: 0.2 }}></motion.div>
                            <motion.div className='match' animate={matchState[10] ? { opacity: 0 } : { opacity: 1 }} transition={{ duration: 0.2 }}></motion.div>
                            <motion.div className='match' animate={matchState[11] ? { opacity: 0 } : { opacity: 1 }} transition={{ duration: 0.2 }}></motion.div>
                            <motion.div className='match' animate={matchState[12] ? { opacity: 0 } : { opacity: 1 }} transition={{ duration: 0.2 }}></motion.div>
                            <motion.div className='match' animate={matchState[13] ? { opacity: 0 } : { opacity: 1 }} transition={{ duration: 0.2 }}></motion.div>
                            <motion.div className='match' animate={matchState[14] ? { opacity: 0 } : { opacity: 1 }} transition={{ duration: 0.2 }}></motion.div>
                        </div>
                        <div id='nimControls'>
                            <button disabled={matches < 1 || turn != uTurn} onClick={() => { pickMatches(1) }}>TAKE 1</button>
                            <button disabled={matches < 2 || turn != uTurn} onClick={() => { pickMatches(2) }}>TAKE 2</button>
                            <button disabled={matches < 3 || turn != uTurn} onClick={() => { pickMatches(3) }}>TAKE 3</button>
                        </div>
                    </div> :
                    <div id='nimPlay'>
                        <p>RESULT: {lastResult}</p>
                        <p>The last player picking the last match loses</p>
                        <button onClick={() => { setCurrentActivity(1) }}>PLAY {lastResult === "NO MATCH PLAYED YET" ? "" : "AGAIN"}</button>
                    </div>
            }
        </div>
    )
};

export default Nim;