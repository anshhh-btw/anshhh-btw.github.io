import { useEffect, useRef, useState } from 'react';
import './numberdle.css';
import { motion } from 'framer-motion';

function randint(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function Numberdle() {
    const [gameActive, setGameActive] = useState(false);
    const gameSettings = useRef({ numberLength: 5 });
    const lastRef = useRef("");
    const [numberLength, setNumberLength] = useState(gameSettings.current.numberLength)
    const [listItems, setListItems] = useState([]);
    const number = useRef(randint(10 ** (gameSettings.current.numberLength - 1), 10 ** (gameSettings.current.numberLength) - 1))

    function isLetter(str) {
        return typeof str === 'string' && str.length === 1 && /^[A-Za-z]$/.test(str);
    }

    function checkLetter(letter, letterIndex) {
        let numString = String(number.current)
        if (isLetter(letter) || letter === "!") {
            return "greenSpan"
        } else if (letter === numString[letterIndex]) {
            return "greenSpan";
        } else if (numString.indexOf(letter) > -1) {
            return "orangeSpan";
        } else {
            return "graySpan"
        }
    }

    function checkCorrect() {
        return (Number(number.current) === Number(lastRef.current))
    }

    function runWin() {
        setListItems([...listItems, lastRef.current, "YOU DID IT!"]);
        setTimeout(() => {
            setGameActive(false);
        }, 2000)
    }

    return (
        <div id='numberdleVisual'>
            {
                gameActive ?
                    <div id='board'>
                        <div>
                            <ul>
                                {listItems.map((item, index) => <li className='listItem' key={index}>{item.split("").map((letter, letIndex) => <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.1, delay: letIndex / item.length }} className={checkLetter(letter, letIndex)} key={letIndex}>{letter}</motion.div>)}</li>)}
                            </ul>
                        </div>
                        <div>
                            <form onSubmit={(e) => { e.preventDefault(); setListItems([...listItems, e.currentTarget.guess.value]); lastRef.current = e.currentTarget.guess.value; e.currentTarget.guess.value = ""; if (checkCorrect()) { runWin() } }}>
                                <input name='guess' type="number" min={10 ** (gameSettings.current.numberLength - 1)} max={10 ** gameSettings.current.numberLength - 1} required />
                                <button type='submit'><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FF5500"><path d="M480-528 296-344l-56-56 240-240 240 240-56 56-184-184Z" /></svg></button>
                            </form>
                        </div>
                    </div> :
                    <div id='start'>
                        <div><p>MAX NUMBER LENGTH: {numberLength}</p><input type='range' min={1} max={10} onChange={(e) => { setNumberLength(e.currentTarget.value); gameSettings.current.numberLength = e.currentTarget.value }} defaultValue={gameSettings.current.numberLength}></input></div>
                        <div><button onClick={() => {
                            setGameActive(true);
                            number.current = randint(10 ** (gameSettings.current.numberLength - 1), 10 ** (gameSettings.current.numberLength) - 1)
                            setListItems([])
                        }}>PLAY</button></div>
                    </div>}
        </div>
    )
}

export default Numberdle;