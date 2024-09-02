import React from 'react';
import { useTranslation } from 'react-i18next';
import TextInput from './TextInput';

const Top = ({
  onButtonClick,
  handleSendMessage,
  isSending,
  scrollToChat,
  setIsSending,
}) => {
  const { t } = useTranslation();
  return (
    <div className='my-10 p-5'>
      <header className='text-center  bg-gradient-to-r from-violet-100 to-pink-300 inline-block text-transparent bg-clip-text '>
        <h1 className='text-6xl md:text-8xl font-extrabold'>Elect-O-Mate</h1>
        {/* <p className='mt-4'>{t('subheading')}</p> */}
        <div className='w-full flex-col justify-center mt-4'>
          <div className='text-2xl md:text-4xl font-extrabold mt-20 mb-20'>
            {t('subheading')}
          </div>
          <div className='w-full  h-auto  rounded-xl text-white'>
            <TextInput
              handleSendMessage={handleSendMessage}
              isSending={isSending}
              scrollToChat={scrollToChat}
              setIsSending={setIsSending}
              question=''
            />
          </div>
          <div className='text-2xl md:text-3xl font-extrabold  mt-20 mb-10'>
            {t('start_now')}
          </div>
          <button
            className=' py-4 px-9 rounded-full font-semibold  transition duration-300 ease-in-out transform hover:scale-110 text-xl shadow-lg border text-pink-200'
            onClick={onButtonClick}
          >
            {t('start_button')}
          </button>
        </div>
        {/*         <button
          className='m-8 py-4 px-9 text-black rounded-full font-semibold transition duration-300 ease-in-out transform hover:scale-110 text-xl backdrop-filter backdrop-blur-lg bg-gray-600 bg-opacity-50'
          onClick={onButtonClick}
        >
          {t('start_button')}
        </button> */}
      </header>
    </div>
  );
};

export default Top;
