import PhotoFrame from '../photo/photo';
import './about.css';

import { easeOut, motion, scale } from 'framer-motion';

function About() {
    document.title = "Ansh | About";

    return <div id='about'>
        <div>// SYSTEM MANIFEST</div>
        <div>
            <div id='aboutLeft'>
                <motion.div initial={{ x: -100, opacity: 0 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.8, ease: easeOut }}>
                    <p>// CORE OBJECTIVES</p>
                    <p>I am a creative engineer specializing in the intersection of hardware architecture and full-stack software. My development approach centers on building clean, fully integrated systems that connect custom backends with tactile environments. I focus on creating performance-driven projects that solve concrete efficiency challenges.</p>
                </motion.div>
                <motion.div initial={{ x: -100, opacity: 0 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.8, ease: easeOut, delay: 0.3 }}>
                    <p>// SYSTEM PARAMETERS</p>
                    <ul>
                        <li>ORIGIN: INDIA</li>
                        <li>STATUS: STUDENT</li>
                        <li>FIELD: --------</li>
                    </ul>
                </motion.div>
            </div>
            <div id='aboutMiddle'>
                <PhotoFrame></PhotoFrame>
                <motion.div initial={{ y: 100, opacity: 0 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.8, ease: easeOut, delay: 0.3 }} id='aboutBottom'>
                    Understanding through creation. I believe the clearest path to mastering complex logic is to build it. Every project is an act of engineering a fundamental concept into a functional, visual reality.<span>|</span>
                </motion.div>
            </div>
            <div id='aboutRight'>
                <motion.div initial={{ x: 100, opacity: 0 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.8, ease: easeOut }}>
                    <p>// SYSTEM SPECS</p>
                    <ul>
                        <li>LANGUAGES SUPPORTED: PYTHON, JAVASCRIPT, HTML & CSS (LMAO)</li>
                        <li>INTERFACES & ECOSYSTEMS: REACT.JS</li>
                        <li>HARDWARE INVENTORY: ESP32</li>
                    </ul>
                </motion.div>
                <motion.div initial={{ x: 100, opacity: 0 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.8, ease: easeOut, delay: 0.3 }}>
                    <p>// FUTURE DIRECTIVES</p>
                    <ul>
                        <li>Researching custom PCB design frameworks</li>
                        <li>Exploring more cellular automation theories</li>
                        <li>Simulating physics vectors and fluid dynamics on HTML5 Canvas</li>
                    </ul>
                </motion.div>
            </div>
        </div>
    </div>
};

export default About;