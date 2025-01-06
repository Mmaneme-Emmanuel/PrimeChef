import React, {useState} from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import Cart from './pages/Cart/Cart';
import PlaceOrder from './pages/PlaceOrder/PlaceOrder';
import Footer from './components/Footer/Footer'
import LoginPopup from "./components/LoginPopup/LoginPopup";



const App = () => {

  const [showLogin, setShowLogin] = useState(false)
  return (
    <>
    {showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : <></>}
      <div className="app">
        <Navbar setShowLogin={setShowLogin}/>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/Cart" element={<Cart />} />

          <Route path='/Order' element={<PlaceOrder/>} />
        </Routes>
      </div>
      <div>
    
      <ToastContainer
        position="top-right" // Position of the toast
        autoClose={3000}     // Auto close after 3 seconds
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"        // Can also use "dark"
      />
    </div>
      <Footer />
    </>
  );
};

export default App;