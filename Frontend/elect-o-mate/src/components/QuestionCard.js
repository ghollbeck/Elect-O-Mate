import React from 'react';

const QuestionCard = ({ question, onAnswer }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-800 text-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">{question.text}</h2>
      <div className="flex space-x-4">
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => onAnswer('agree')}
        >
          stimme zu
        </button>
        <button
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => onAnswer('neutral')}
        >
          neutral
        </button>
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => onAnswer('disagree')}
        >
          stimme nicht zu
        </button>
      </div>
      <button
        className="mt-4 text-gray-400 hover:text-gray-200"
        onClick={() => onAnswer('skip')}
      >
        These überspringen
      </button>
    </div>
  );
};

export default QuestionCard;
