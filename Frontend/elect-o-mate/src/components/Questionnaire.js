import React, { useState, useEffect, useRef, useCallback } from 'react';
import QuestionCard from './QuestionCard';
import questionsData from '../data/questions.json';
import { throttle } from 'lodash';
import { useTranslation } from 'react-i18next';

const Questionnaire = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(1);
  const [answers, setAnswers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const containerRef = useRef(null);
  const isButtonScroll = useRef(false);  // Track button clicks

  useEffect(() => {
    setQuestions(questionsData);
  }, []);

  useEffect(throttle(() => {
    if (containerRef.current && containerRef.current.firstChild) {
      const cardWidth = 600;
      const scrollPosition = cardWidth * currentQuestionIndex - (containerRef.current.offsetWidth / 2 - cardWidth / 2);
      containerRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
  }, [currentQuestionIndex]), 1000);

  const handleAnswer = (answer) => {
    setAnswers([...answers, { question: questions[currentQuestionIndex], answer }]);
    scrollToIndex(Math.min(currentQuestionIndex + 1, questions.length - 1));
  };
  
  
  const scrollToIndex = throttle((index) => {
    if (containerRef.current && containerRef.current.firstChild) {
      console.log("in if " + index)
      isButtonScroll.current = true;  // Indicate button click
      const cardWidth = containerRef.current.firstChild.offsetWidth;
      let scrollPosition;
  
      scrollPosition = cardWidth * index - (containerRef.current.offsetWidth / 2 - cardWidth / 2);
  
      containerRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
      setCurrentQuestionIndex(index);
    }
    console.log("out if " + index)
  }, 1000);

  
  
  const handleLeft = throttle(() => {
    scrollToIndex(Math.max(currentQuestionIndex - 1, 1)); // Skip the first card
  }, 1000);
  
  const handleRight = throttle(() => {
    scrollToIndex(Math.min(currentQuestionIndex + 1, questions.length - 2)); // Skip the last card
  }, 1000);
  

  useEffect(() => {
    const handleScroll = throttle(() => {
      if (isButtonScroll.current) {
        isButtonScroll.current = false;  // Reset button scroll flag
        return;
      }
      if (containerRef.current) {
        const container = containerRef.current;
        const containerCenter = container.offsetWidth / 2;
        const cards = Array.from(container.children);
        let closestIndex = 0;
        let closestDistance = Infinity;

        cards.forEach((card, index) => {
          const cardCenter = card.offsetLeft + card.offsetWidth / 2;
          const distance = Math.abs(cardCenter - container.scrollLeft - containerCenter);
          if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
          }
        });

        setCurrentQuestionIndex(closestIndex);
      }
    }, 1000);

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [questions]);

  const scrollBarHideStyle = {
    scrollbarWidth: 'none', // Firefox
    msOverflowStyle: 'none', // IE and Edge
  };
  const { t } = useTranslation();

  return (
    <div className="flex-grow bg-red my-20 h-auto py-20 flex items-center justify-center relative w-full">
      <div className="absolute top-0 left-0 w-full bg-gradient-to-r from-slate-950 to-purple-950 transform skew-y-3" style={{ height: '110%' }} />
      
      <div className="relative w-full overflow-x-hidden">
        <div className="absolute left-0 top-0 h-full w-40 bg-gradient-to-r from-slate-950 to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 h-full w-40 bg-gradient-to-l from-purple-950 to-transparent z-20 pointer-events-none" />

        {currentQuestionIndex !== 1 && (
          <button z
            onClick={handleLeft} 
            className="absolute left-20 top-1/2 transform -translate-y-1/2 bg-white text-black p-6 rounded-full z-30">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"></path>
              </svg>
          </button>
        )}

        {currentQuestionIndex < questions.length - 2 && (
          <button 
            onClick={handleRight} 
            className="absolute right-20 top-1/2 transform -translate-y-1/2 bg-white text-black p-6 rounded-full z-30">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"></path>
          </svg>
          </button>
        )}


        <div ref={containerRef} className="w-full px-0 py-20 flex space-x overflow-x-scroll relative snap-x snap-mandatory"
             style={{ ...scrollBarHideStyle, WebkitOverflowScrolling: 'touch' }}>
          {questions.map((question, index) => (
            <div key={index} className={`shrink-0 transition-opacity duration-800 snap-center ${index === currentQuestionIndex ? 'transform scale-125 opacity-100' : 'transform scale-100 opacity-50'}`}>
              <QuestionCard
              question={{ ...question, text: t(question.text) }} // Translating the text property
         
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
