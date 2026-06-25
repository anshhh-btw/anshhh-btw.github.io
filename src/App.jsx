import './root.css'

import Navbar from "./components/navbar/navbar";
import Homepage from './components/homepage/homepage';
import Footer from './components/footer/footer';
import About from './components/about/about'
import Contact from './components/contact/contact'
import { Route, Routes } from 'react-router-dom';

function App() {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path='/' element={<Homepage />} />
                <Route path='/about' element={<About />} />
                <Route path='/contact' element={<Contact />} />
            </Routes>
            <Footer />
        </>
    )
}

export default App;