import React from 'react';
import { useTranslation } from 'react-i18next';

const QuestionCard = ({ length, index, question, answer, onAnswer }) => {
  const { t } = useTranslation();

  // If question is empty, render an empty card
  if (!question || !question.text) {
    return (
      <div className='flex-col h-80 w-[800px] items-center justify-center p-6 bg-transparent text-white inline-flex flex-shrink-0'></div>
    );
  }

  return (
    <div
      className='flex-col h-[300px] w-[800px] items-center justify-center p-6 text-white rounded-lg shadow-md inline-flex flex-shrink-0'
      style={{ backgroundImage: 'radial-gradient(circle, #474747, #030303)' }}
    >
      <h2 className='font-semibold absolute left-5 top-5 break-words'>
        {index}/{length - 2}
        {''} {question.title}
      </h2>

      <h2 className='text-lg font-semibold mb-4 text-center overflow-hidden w-5/6 break-words'>
        {question.text}
      </h2>
      <div className='flex space-x-4'>
        <button
          className={`border w-40 h-10 ${
            answer === 1
              ? 'text-black bg-blue-100'
              : 'hover:bg-blue-100 hover:text-black'
          } font-bold py-2 px-4 rounded`}
          onClick={() => onAnswer(1)}
        >
          {t('agree_button')}
        </button>
        <button
          className={`border w-40 h-10 ${
            answer === 0
              ? 'bg-blue-100 text-black'
              : 'hover:bg-blue-100 hover:text-black'
          }  font-bold py-2 px-4 rounded`}
          onClick={() => onAnswer(0)}
        >
          {t('neutral_button')}
        </button>
        <button
          className={`border w-40 h-10 ${
            answer === -1
              ? 'bg-blue-100 text-black'
              : 'hover:bg-blue-100 hover:text-black'
          }  font-bold py-2 px-4 rounded`}
          onClick={() => onAnswer(-1)}
        >
          {t('disagree_button')}
        </button>
      </div>
      <button
        className='mt-4 text-gray-400 hover:text-gray-200'
        onClick={() => onAnswer(-2)}
      >
        {t('skip_button')}
      </button>
    </div>
  );
};

export default QuestionCard;
