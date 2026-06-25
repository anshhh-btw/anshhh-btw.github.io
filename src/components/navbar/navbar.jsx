import { Link } from 'react-router-dom';
import MyLink from '../links';
import './navbar.css';
import { motion } from 'framer-motion';

function Navbar() {
    return (
        <motion.nav initial={{ y: -1000 }} animate={{ y: 0 }} transition={{ duration: 0.5, ease: 'anticipiate' }}>
            <div id='navLeft'>
                <Link to="/">ANSH KUMAR SHAH</Link>
            </div>
            <div id='navMiddle'>
                <ul>
                    <li><MyLink brackets="[]" to="/about" bracketStyle={{ display: "inline-block", color: "var(--color6)" }} linkStyle={{ color: "var(--color6)", display: "inline-flex" }} linkText="ABOUT" ></MyLink></li>
                    <li><MyLink brackets="[]" to="/contact" bracketStyle={{ display: "inline-block", color: "var(--color6)" }} linkStyle={{ color: "var(--color6)", display: "inline-flex" }} linkText="CONTACT" ></MyLink></li>
                </ul>
            </div>
            <div id='navRight'>
                <motion.div
                    id='navBlink'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    style={{ background: 'rgb(0, 200, 0)' }}>
                </motion.div>
                <p>
                    <span>// CURRENTLY:</span> <span>EXPERIMENTING</span>
                </p>
            </div>
        </motion.nav>
    )
}

export default Navbar;