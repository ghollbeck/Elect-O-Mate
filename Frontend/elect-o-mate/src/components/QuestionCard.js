import React from 'react';
import { useTranslation } from 'react-i18next';


const QuestionCard = ({ question, onAnswer }) => {
  const { t } = useTranslation();

  // If question is empty, render an empty card
  if (!question || !question.text) {
    return (
      <div className="flex-col h-80 w-[600px] items-center justify-center p-6 bg-transparent text-white rounded-lg shadow-md inline-flex flex-shrink-0">
      </div>
    );
  }

  return (
    <div className="flex-col h-80 w-[600px] items-center justify-center p-6 bg-gray-700 text-white rounded-lg shadow-md inline-flex flex-shrink-0">
      <h2 className="text-lg font-semibold mb-4 text-center overflow-hidden w-5/6 break-words">
        {question.text}
      </h2>
      <div className="flex space-x-4">
        <button
          className="bg-green-500 w-40 h-10 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => onAnswer('agree')}
        >
          {t('agree_button')}
        </button>
        <button
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => onAnswer('neutral')}
        >
          {t('neutral_button')}
        </button>
        <button
          className="bg-red-500 w-40 h-10 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => onAnswer('disagree')}
        >
          {t('disagree_button')}
        </button>
      </div>
      <button
        className="mt-4 text-gray-400 hover:text-gray-200"
        onClick={() => onAnswer('skip')}
      >
        {t('skip_button')}
      </button>
    </div>
  );
};

export default QuestionCard;
