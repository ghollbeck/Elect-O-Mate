import React from 'react';

const Top = ({ onButtonClick }) => {
  return (
    <header className="text-black px-20 py-20 text-center">
      <h1 className="text-7xl font-extrabold">Wahl-O-Smart</h1>
      <p className="mt-4 pb-10">
        This tool offers you <span className="font-bold">additional information</span>. Additionally, you can have a chat with an expert <span className="font-bold">AI ChatBot</span> or just <span className="font-bold">voice call</span> with the database & web.
      </p>
      <button 
      className="m-8 px-9 py-5 bg-gradient-to-r from-green-500  to-blue-500 text-white rounded-full font-semibold transition duration-300 ease-in-out transform hover:bg-gradient-to-r hover:from-pink-500 hover:to-indigo-500 hover:scale-110 text-xl"
        onClick={onButtonClick}
      >
        Start now
      </button>
    </header>
  );
};

export default Top;
