import React, { useState, useEffect, useRef } from 'react';
import QuestionCard from './QuestionCard';
import questionsData from '../data/questions.json';

const Questionnaire = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    setQuestions(questionsData);
  }, []);

  useEffect(() => {
    if (containerRef.current && containerRef.current.firstChild) {
      const cardWidth = containerRef.current.firstChild.offsetWidth;
      const scrollPosition = cardWidth * currentQuestionIndex - (containerRef.current.offsetWidth / 2 - cardWidth / 2);
      containerRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
  }, [currentQuestionIndex, questions]);

  const handleAnswer = (answer) => {
    setAnswers([...answers, { question: questions[currentQuestionIndex], answer }]);
    setCurrentQuestionIndex(prevIndex => Math.min(prevIndex + 1, questions.length - 1));
  };

  const handleLeft = () => {
    setCurrentQuestionIndex(prevIndex => Math.max(prevIndex - 1, 0));
  };

  const handleRight = () => {
    setCurrentQuestionIndex(prevIndex => Math.min(prevIndex + 1, questions.length - 1));
  };

  const scrollBarHideStyle = {
    scrollbarWidth: 'none', // Firefox
    msOverflowStyle: 'none', // IE and Edge
  };

  return (
    <div className="flex-grow bg-red my-20 h-auto py-20 flex items-center justify-center relative w-full">
      <div className="absolute top-0 left-0 w-full bg-gradient-to-r from-green-400 to-blue-400 transform skew-y-3" style={{ height: '110%' }} />
      
      <div className="relative w-full overflow-x-hidden">
        <div className="absolute left-0 top-0 h-full w-40 bg-gradient-to-r from-green-400 to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 h-full w-40 bg-gradient-to-l from-blue-400 to-transparent z-20 pointer-events-none" />

        <button 
          onClick={handleLeft} 
          disabled={currentQuestionIndex === 0}
          className="absolute left-20 top-1/2 transform -translate-y-1/2 bg-white text-black p-6 rounded-full z-30">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"></path>
            </svg>
        </button>


        <button 
          onClick={handleRight} 
          disabled={currentQuestionIndex === questions.length - 1}
          className="absolute right-20 top-1/2 transform -translate-y-1/2 bg-white text-black p-6 rounded-full z-30">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>

        <div ref={containerRef} className="w-full px-4 py-20 flex space-x-4 overflow-x-scroll relative"
             style={{ ...scrollBarHideStyle, WebkitOverflowScrolling: 'touch', overflowX: 'scroll', display: 'flex' }}>
          {questions.map((question, index) => (
            <div key={index} className={`shrink-0 w-120 h-80 transition-opacity duration-800 ${index === currentQuestionIndex ? 'transform scale-110 opacity-100' : 'transform scale-100 opacity-50'}`}>
              <QuestionCard
                question={question}
                onAnswer={handleAnswer}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;
