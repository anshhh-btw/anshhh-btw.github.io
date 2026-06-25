import './contact.css';

import MyLink from '../links';
import { easeOut, motion } from 'framer-motion';

function Contact() {
    document.title = "Ansh | Contact"


    return <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3, ease: easeOut }} id='contact'>
        <div>// COMM_CHANNELS</div>
        <div>
            <ul>
                <li><MyLink brackets="[]" to="https://github.com/anshhh-btw" bracketStyle={{ display: "inline-block", color: "var(--color6)" }} linkStyle={{ color: "var(--color6)", display: "inline-flex" }} linkText="GITHUB" ></MyLink></li>
                <li><MyLink brackets="[]" to="https://www.instagram.com/anshhh.btw/" bracketStyle={{ display: "inline-block", color: "var(--color6)" }} linkStyle={{ color: "var(--color6)", display: "inline-flex" }} linkText="INSTAGRAM" ></MyLink></li>
                <li><MyLink brackets="[]" to="mailto:anshkumarshah0405@gmail.com" bracketStyle={{ display: "inline-block", color: "var(--color6)" }} linkStyle={{ color: "var(--color6)", display: "inline-flex" }} linkText="G-MAIL" ></MyLink></li>
            </ul>
        </div>
    </motion.div>
};

export default Contact;