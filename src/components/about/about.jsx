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
                    <p>I am an Electrical Engineering student building a foundation across circuits, power systems, and signal theory. My approach centers on understanding the core principles that drive electrical systems — from basic circuit analysis to how power and signals behave in the real world. I focus on strengthening fundamentals while exploring where my interests take me next.</p>
                </motion.div>
                <motion.div initial={{ x: -100, opacity: 0 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.8, ease: easeOut, delay: 0.3 }}>
                    <p>// SYSTEM PARAMETERS</p>
                    <ul>
                        <li>ORIGIN: INDIA</li>
                        <li>STATUS: STUDENT</li>
                        <li>FIELD: ELECTRICAL ENGINEERING</li>
                        <li>INSTITUTION: IIEST</li>
                    </ul>
                </motion.div>
            </div>
            <div id='aboutMiddle'>
                <PhotoFrame></PhotoFrame>
                <motion.div initial={{ y: 100, opacity: 0 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.8, ease: easeOut, delay: 0.3 }} id='aboutBottom'>
                    Understanding through learning. I believe the clearest path to mastering electrical engineering is to build a strong foundation first. Every course and concept is a step toward turning fundamental theory into practical understanding.<span>|</span>
                </motion.div>
            </div>
            <div id='aboutRight'>
                <motion.div initial={{ x: 100, opacity: 0 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.8, ease: easeOut }}>
                    <p>// SYSTEM SPECS</p>
                    <ul>
                        <li>LANGUAGES SUPPORTED: C, PYTHON, JAVASCRIPT, HTML & CSS (LMAO)</li>
                        <li>INTERFACES & ECOSYSTEMS: REACT.JS</li>
                        <li>TOOLS: MATLAB, AUTOCAD</li>
                    </ul>
                </motion.div>
                <motion.div initial={{ x: 100, opacity: 0 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.8, ease: easeOut, delay: 0.3 }}>
                    <p>// FUTURE DIRECTIVES</p>
                    <ul>
                        <li>Strengthening core concepts in circuits and systems</li>
                        <li>Exploring different specializations within EE</li>
                        <li>Building small projects to apply theory in practice</li>
                    </ul>
                </motion.div>
            </div>
        </div>
    </div>
};

export default About;