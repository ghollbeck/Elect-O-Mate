import React, { useRef, useEffect } from 'react';
import chatbot from './../pictures/Bot.png'; // Import this icon to @mui
import { useTranslation } from 'react-i18next';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import FormatMessages from './FormatMessages';

const ChatWindow = ({ messages, scrollToQuestionnaire }) => {
  const { t } = useTranslation();
  const chatContentRef = useRef(null);

  useEffect(() => {
    if (chatContentRef.current) {
      chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      className='relative flex flex-col overflow-y-auto border-none shadow-xl  bg-gradient-to-r from-violet-200 to-pink-200 h-[80dvh]  text-black font-light rounded-3xl'
      style={{
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'thin',
      }}
    >
      <div className='p-4 flex-grow overflow-y-auto' ref={chatContentRef}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-2 ${message.isUser ? 'text-right' : 'text-left'}`}
          >
            {message.isUser ? (
              <div className='flex flex-col items-end'>
                <p className='font-semibold text-black'>{t('chat_YOU')}</p>
                <p className='p-2 rounded-md text-left bg-white break-words max-w-full mb-5'>
                  <FormatMessages text={message.text} />
                </p>
              </div>
            ) : (
              <div className='flex flex-col items-start'>
                <p
                  className={`font-semibold ${
                    message.isError ? 'text-red-700' : 'text-black'
                  }`}
                >
                  <span className='inline-block align-middle rounded-full overflow-hidden m-2'>
                    <img
                      src={chatbot}
                      alt='Bot Profile'
                      style={{ height: '1.9em', width: '1.9em' }}
                    />
                  </span>
                  {message.isError ? 'Error' : 'Elect-O-Mate'}
                </p>
                <p className='p-2 rounded-md text-left break-words bg-white bg-opacity-50 max-w-full mb-5 font-light'>
                  <FormatMessages text={message.text} />
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
      <button
        className='absolute px-2 py-1 text-white rounded-full font-thin transition duration-300 ease-in-out transform hover:scale-110 text-xl right-1 bottom-11  bg-black bg-opacity-20 backdrop-blur-lg z-30'
        onClick={scrollToQuestionnaire}
      >
        <ArrowUpwardIcon />
      </button>
    </div>
  );
};

export default ChatWindow;
