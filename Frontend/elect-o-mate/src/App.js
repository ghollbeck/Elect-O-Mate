// src/App.js
import React, { useRef } from 'react';
import './index.css';
import Footer from './components/Footer';
import Chat from './components/Chat';
import Top from './components/Top';
import OpenSource from './components/OpenSource'

function App() {
  const targetRef = useRef(null);

  const handleButtonClick = () => {
    targetRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col relative">


    <div className="flex justify-center w-full  bg-gradient-to-r from-orange-50 via-orange-100 to-orange-300">
      <div className='w-1/2'>
        <Top onButtonClick={handleButtonClick} />
      </div>
    </div>

    <div>
      <OpenSource />
    </div>

    <div ref={targetRef} className="flex-grow-0 py-4">
      <Chat />
    </div>



    <div className="mt-auto w-full bg-gradient-to-r from-orange-50 via-orange-100 to-orange-300">
      <Footer />
    </div>

    </div>
  );
}

export default App;
