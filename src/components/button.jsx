import './button.css'

function MyButton({ type, text, onClickAction }) {
    return (
        <div className={type}>
            <div className='buttonBefore'></div>
            <button onClick={onClickAction}>{text}</button>
            <div className='buttonAfter'></div>
        </div>)
}

export default MyButton