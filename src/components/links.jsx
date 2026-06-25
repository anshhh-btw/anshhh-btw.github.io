import { Link } from "react-router-dom";
import { motion, useAnimationControls } from "framer-motion";

const MotionLink = motion(Link);

function MyLink(props) {
    const controls = useAnimationControls();

    const bracketLeftVariants = {
        initial: { opacity: 0, x: -10 },
        hover: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } }
    };
    
    const bracketRightVariants = {
        initial: { opacity: 0, x: 10 },
        hover: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } }
    };

    const handleMouseEnter = () => {
        controls.start("hover");
    };

    const handleMouseLeave = () => {
        controls.start("initial");
    };

    const handleClick = (e) => {
        // Force both the parent and children to clear visually immediately
        controls.set("initial"); 

        if (props.onClick) props.onClick(e);
    };

    return (
        <MotionLink 
            to={props.to} 
            animate={controls}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
        >
            <motion.span 
                variants={bracketLeftVariants} 
                initial="initial"
                animate={controls} // <-- Explicitly link child tracking to manual controls
                style={props.bracketStyle}
            >
                {props.brackets[0]}
            </motion.span>
            
            <span style={props.linkStyle}>{props.linkText}</span>
            
            <motion.span 
                variants={bracketRightVariants} 
                initial="initial"
                animate={controls} // <-- Explicitly link child tracking to manual controls
                style={props.bracketStyle}
            >
                {props.brackets[1]}
            </motion.span>
        </MotionLink>
    );
}

export default MyLink;