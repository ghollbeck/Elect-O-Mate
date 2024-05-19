import React from 'react';
import { useTranslation } from 'react-i18next';

const Top = ({ onButtonClick }) => {
  const { t } = useTranslation();
  return (
    <div className='md:mb-[100px]'>
      <header
        className='text-black  my-10 text-center'
        style={{ color: '#C5D5D3' }}
      >
        <h1 className='text-5xl md:text-8xl font-extrabold'>Elect-O-Mate</h1>
        <p className='mt-4'>{t('subheading')}</p>
        <button
          className='m-8 py-4 px-9 text-black rounded-full font-semibold bg-gradient-to-r from-[#3D6964] to-[#FDFFFD] transition duration-300 ease-in-out transform hover:scale-110 text-xl'
          onClick={onButtonClick}
        >
          {t('start_button')}
        </button>
      </header>
    </div>
  );
};

export default Top;
