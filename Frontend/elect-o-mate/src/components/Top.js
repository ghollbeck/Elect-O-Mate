import React from 'react';
import { useTranslation } from 'react-i18next';

const Top = ({ onButtonClick }) => {
  const { t } = useTranslation();
  return (
    <div className='mb-[100px]'>
    <header className="text-black pt-40 m-10 text-center" style={{color:'#C5D5D3'}}>
      <h1 className="text-8xl font-extrabold">Elect-O-Mate</h1>
      <p className="mt-4">
      {t('subheading')}
      </p>
      <button 
      className="m-8 py-4 px-9 text-black rounded-full font-semibold transition duration-300 ease-in-out transform hover:bg-gradient-to-r hover:from-pink-500 hover:to-indigo-500 hover:scale-110 text-xl"
        onClick={onButtonClick}
        style={{backgroundImage: 'linear-gradient(to right, #3D6964, #FDFFFD)',}}
      >
        {t('start_button')}
      </button>
    </header>
    </div>
  );
};

export default Top;
