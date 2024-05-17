import React from 'react';
import { useTranslation } from 'react-i18next';

const Top = ({ onButtonClick }) => {
  const { t } = useTranslation();
  return (
    <header className="text-black pt-40 m-10 text-center">
      <h1 className="text-8xl font-extrabold">Elect-O-Mate</h1>
      <p className="mt-4">
      {t('subheading')}
      </p>
      <button 
      className="m-8 py-4 px-9 bg-gradient-to-r from-green-500  to-blue-500 text-white rounded-full font-semibold transition duration-300 ease-in-out transform hover:bg-gradient-to-r hover:from-pink-500 hover:to-indigo-500 hover:scale-110 text-xl"
        onClick={onButtonClick}
      >
        {t('start_button')}
      </button>
    </header>
  );
};

export default Top;
