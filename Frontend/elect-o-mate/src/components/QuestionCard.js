import React from 'react';

const QuestionCard = ({ question, onAnswer }) => {
  return (
    <div className="flex-col h-80 w-[600px] items-center justify-center p-6 bg-gray-800 text-white rounded-lg shadow-md inline-flex flex-shrink-0">
      <h2 className="text-lg font-semibold mb-4 text-center overflow-hidden w-5/6 break-words">
        {question.text}
      </h2>
      <div className="flex space-x-4">
        <button
          className="bg-green-500 w-40 h-10 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => onAnswer('agree')}
        >
          agree
        </button>
        <button
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => onAnswer('neutral')}
        >
          neutral
        </button>
        <button
          className="bg-red-500 w-40 h-10 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => onAnswer('disagree')}
        >
          disagree
        </button>
      </div>
      <button
        className="mt-4 text-gray-400 hover:text-gray-200"
        onClick={() => onAnswer('skip')}
      >
        skip
      </button>
    </div>
  );
};

export default QuestionCard;
