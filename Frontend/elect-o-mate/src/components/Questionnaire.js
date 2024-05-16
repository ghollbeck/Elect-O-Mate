import React, { useState } from 'react';
import QuestionCard from './QuestionCard';

const Questionnaire = ({ questions }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);

  const handleAnswer = (answer) => {
    setAnswers([...answers, { question: questions[currentQuestionIndex], answer }]);
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  return (
    <div className="flex-grow bg-red m-20 h-auto py-20 flex items-center justify-center">
      <div className="absolute py-20 top-0 left-0 w-full bg-gradient-to-r from-green-900 to-blue-900 transform skew-y-3" style={{ height: '110%' }} />
      <div className="container mx-auto px-4 relative z-10 w-1/2">
        {currentQuestionIndex < questions.length ? (
          <QuestionCard
            question={questions[currentQuestionIndex]}
            onAnswer={handleAnswer}
          />
        ) : (
          <div className="text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Thank you for completing the questionnaire!</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default Questionnaire;
