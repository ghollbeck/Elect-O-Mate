// src/App.js
import React, { useRef } from 'react';
import './index.css';
import Footer from './components/Footer';
import Chat from './components/Chat';
import Top from './components/Top';
import OpenSource from './components/OpenSource'
import Spline from './components/Spline'

function App() {
  const targetRef = useRef(null);

  const handleButtonClick = () => {
    targetRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col relative overflow-hidden">
      <div className="absolute top-[-700px] right-[-400px] w-[1600px] h-[1600px] bg-gradient-to-r from-orange-200 via-white to-white  rounded-full z-0"></div>


      <div className="flex flex-col items-center pt-20 pb-10 w-full  z-10">
        <div className='w-1/2 z-10 pt-25'>
          <Top onButtonClick={handleButtonClick} />
        </div>
        <div className='w-30px h-30px'>
        <Spline />
        </div>
      </div>

      <div className='bg-black flex justify-center z-10'>
        <div className='w-1/2'>
          <OpenSource />
        </div>
      </div>

      <div ref={targetRef} className="flex justify-center bg-gradient-to-r from-blue-50 to-blue-100">
        <div className='w-1/2 my-10 py-20'>
          <header className="text-black m-10 text-center">
            <h1 className="text-6xl font-extrabold">Elect-O-Mate</h1>
          </header>
          <Chat />
        </div>
      </div>

      <div className="w-full">
        <Footer />
      </div>

    </div>
  );
}

export default App;
