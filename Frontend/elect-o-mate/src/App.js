// src/App.js
import React, { useRef } from 'react';
import './index.css';
import Footer from './components/Footer';
import Chat from './components/Chat';
import Top from './components/Top';
import OpenSource from './components/OpenSource'
import Spline from './components/Spline'
import Questions from './components/Questionnaire';

function App() {
  const targetRef = useRef(null);

  const handleButtonClick = () => {
    targetRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col relative overflow-hidden">
      <div className="absolute top-[-500px] right-[-500px] w-[1600px] h-[1600px] bg-gradient-to-r from-orange-200 to-orange-50  rounded-full z-0"/>


      <div className="flex flex-col items-center pt-20 pb-10 w-full  z-10">
        <div className='w-1/2 z-10 pt-25'>
          <Top onButtonClick={handleButtonClick} />
        </div>
        <div className='w-30px h-30px'>
        <Spline />
        </div>
      </div>

      <div className="relative mb-20 z-10">
        <Questions/>
      </div>


      <div ref={targetRef} className="flex justify-center h-screen">
        <div className='w-1/2 my-20'>
          <Chat />
        </div>
      </div>


      <div className="relative mt-10 mb-20">
        {/* if we want the black background back :)
        <div className="absolute top-0 left-0 w-full bg-[#010101] transform skew-y-3"  style={{ height: '110%' }}></div> */}
        <div className="absolute top-0 left-0 w-full bg-gradient-to-r from-green-900  to-blue-900 transform skew-y-3"  style={{ height: '110%' }}/>
          <div className="container mx-auto px-4 relative z-10 w-1/2">
            <OpenSource />
        </div>
      </div>

      <div className="mt-5 w-full bg-gradient-to-r from-orange-50 via-orange-100 to-orange-300">
        <Footer />
      </div>

    </div>
  );
}

export default App;
