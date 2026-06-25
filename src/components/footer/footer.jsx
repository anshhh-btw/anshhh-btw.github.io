import { motion } from 'framer-motion';
import MyLink from '../links';
import './footer.css'

function Footer() {
    return <footer>
        <div>
            <p>LET'S BUILD SOMETHING <span>REAL</span></p>
            <p>Currently exploring electronics and unheard complex topics</p>
        </div>
        <div>
            <p>// ENDPOINTS</p>
            <ul>
                <li><MyLink brackets="[]" to="https://github.com/anshhh-btw" bracketStyle={{ display: "inline-block", color: "var(--color6)" }} linkStyle={{ color: "var(--color6)", display: "inline-flex" }} linkText="GITHUB" ></MyLink></li>
            </ul>
        </div>
        <div>
            <p>// COMMUNICATIONS</p>
            <ul>
                <li><MyLink brackets="[]" to="https://www.instagram.com/anshhh.btw/" bracketStyle={{ display: "inline-block", color: "var(--color6)" }} linkStyle={{ color: "var(--color6)", display: "inline-flex" }} linkText="INSTAGRAM" ></MyLink></li>
                <li><MyLink brackets="[]" to="mailto:anshkumarshah0405@gmail.com" bracketStyle={{ display: "inline-block", color: "var(--color6)" }} linkStyle={{ color: "var(--color6)", display: "inline-flex" }} linkText="G-MAIL" ></MyLink></li>
            </ul>
        </div>
    </footer>
}

export default Footer;