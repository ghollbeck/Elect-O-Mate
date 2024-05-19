import React, { useRef, useState, useEffect } from 'react';
import chatbot from './../pictures/Bot.png'; // Import this icon to @mui
import { useTranslation } from 'react-i18next';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

const ChatWindow = ({ messages, scrollToQuestionnaire }) => {
  const { t } = useTranslation();
  const chatWindowRef = useRef(null);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  const convertTextToLinks = (text) => {
    const urlRegex =
      /(\b(?:https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi;
    return text.split(urlRegex).map((part, index) => {
      if (urlRegex.test(part)) {
        return (
          <a
            key={index}
            href={part}
            target='_blank'
            rel='noopener noreferrer'
            className='text-blue-500 hover:underline'
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  return (
    <div
      className='relative flex flex-col overflow-y-auto border-none shadow-xl border-gray-300 bg-white h-[600px] md:h-[700px]'
      style={{
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'thin',
        borderRadius: '10px',
      }}
      ref={chatWindowRef}
    >
      <div className='p-4 flex-grow overflow-y-auto'>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-2 ${message.isUser ? 'text-right' : 'text-left'}`}
          >
            {message.isUser ? (
              <div className='flex flex-col items-end'>
                <p className='font-bold text-gray-700'>{t('chat_YOU')}</p>
                <p
                  className='text-gray-600 p-2 rounded-md text-left'
                  style={{ wordBreak: 'break-word', background: '#A1BBB8' }}
                >
                  {message.text}
                </p>
              </div>
            ) : (
              <div className='flex flex-col items-start'>
                <p
                  className={`font-bold ${
                    message.isError ? 'text-red-700' : 'text-blue-700'
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
                <p
                  className='text-gray-600 p-2 rounded-md text-left break-words'
                  style={{ background: '#A1BBB8' }}
                >
                  {convertTextToLinks(message.text)}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
      <button
        className='absolute py-5 px-5 text-black rounded-full font-thin transition duration-300 ease-in-out transform hover:scale-110 text-xl right-5 bottom-5 z-10 bg-black bg-opacity-20 backdrop-blur-lg'
        onClick={scrollToQuestionnaire}
      >
        <ArrowUpwardIcon />
      </button>
    </div>
  );
};

export default ChatWindow;
