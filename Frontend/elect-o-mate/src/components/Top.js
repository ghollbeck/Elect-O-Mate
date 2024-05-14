import React from 'react';

const Top = ({ onButtonClick }) => {
  return (
    <header className="text-black p-20 text-center">
      <h1 className="text-7xl font-extrabold">Wahl-O-Smart</h1>
      <p className="text-xl mt-2">for the upcoming EU Elections.</p>
      <p className="mt-4">
        This tool offers you <span className="font-bold">additional information</span>. Additionally, you can have a chat with an expert <span className="font-bold">AI ChatBot</span> or just <span className="font-bold">voice call</span> with the database & web.
      </p>
      <button 
        className="mt-8 px-6 py-3 bg-white text-black rounded-full font-semibold hover:bg-blue-100 transition duration-300 ease-in-out"
        onClick={onButtonClick}
      >
        Start now
      </button>
    </header>
  );
};

export default Top;
