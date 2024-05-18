import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import TextInputCard from './TextInputCard';
import axios from 'axios';

const QuestionCard = ({ length, index, question, answer, onAnswer }) => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([]);

  const handleSendMessage = async (text) => {
    // Add user's message to chat
    setMessages((prevMessages) => [...prevMessages, { text, isUser: true }]);

    try {
      // Perform API request
      const response = await axios.post(
        'https://backend.bruol.me/openai/invoke',
        { input: text }
      );

      // Add API response to chat
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: response.data.output, isUser: false },
      ]);
    } catch (error) {
      // Add error message to chat
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: 'An error occurred. Please try again.',
          isUser: false,
          isError: true,
        },
      ]);
    }
  };

  // If question is empty, render an empty card
  if (!question || !question.text) {
    return (
      <div className='flex flex-col h-60 md:h-80 w-[300px] md:w-[800px] items-center justify-center p-6 bg-transparent text-white  flex-shrink-0'></div>
    );
  }

  return (
    <div
      className='flex flex-col h-60 md:h-80 w-[270px] md:w-[800px] p-1 text-white rounded-lg shadow-md bg-white'
      style={{ backgroundImage: 'radial-gradient(circle, #474747, #030303)' }}
    >
      <div className='flex items-start h-auto pt-2 pl-2 flex-shrink-0'>
        <h2 className='text-xs md:text-xl font-semibold break-words'>
          {index}/{length - 2} {question.title}
        </h2>
      </div>

      <div className='flex-grow flex items-center justify-center'>
        <h2 className='text-sm md:text-lg font-semibold text-center overflow-hidden w-full break-words leading-tight p-2 md:p-5'>
          {question.text}
        </h2>
      </div>

      <div className='flex justify-center items-end flex-shrink-0 pb-2 md:pb-5'>
        <div className='flex space-x-1 md:space-x-4'>
          <button
            className={`border w-full h-8 md:h-10 ${
              answer === 1
                ? 'text-black bg-blue-100'
                : 'hover:bg-blue-100 hover:text-black'
            } font-bold py-1 md:py-2 px-4 rounded`}
            onClick={() => onAnswer(1)}
          >
            {t('agree_button')}
          </button>
          <button
            className={`border w-full h-8 md:h-10 ${
              answer === 0
                ? 'bg-blue-100 text-black'
                : 'hover:bg-blue-100 hover:text-black'
            } font-bold py-1 md:py-2 px-4 rounded`}
            onClick={() => onAnswer(0)}
          >
            {t('neutral_button')}
          </button>
          <button
            className={`border w-full h-8 md:h-10 ${
              answer === -1
                ? 'bg-blue-100 text-black'
                : 'hover:bg-blue-100 hover:text-black'
            } font-bold py-1 md:py-2 px-4 rounded`}
            onClick={() => onAnswer(-1)}
          >
            {t('disagree_button')}
          </button>
        </div>
      </div>

      <div className='flex flex-col justify-end text-gray-400 hover:text-gray-200 w-full flex-shrink-0'>
        <TextInputCard onSendMessage={handleSendMessage} isSending={false} />
      </div>
    </div>
  );
};

export default QuestionCard;
