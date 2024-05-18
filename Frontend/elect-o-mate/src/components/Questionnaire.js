import React, { useState, useEffect, useRef } from 'react';
import QuestionCard from './QuestionCard';
import questionsData from '../data/questions.json';
import { throttle } from 'lodash';
import { useTranslation } from 'react-i18next';

const Questionnaire = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(1);
  const [questions, setQuestions] = useState([]);
  const containerRef = useRef(null);
  const isButtonScroll = useRef(false);  // Track button clicks
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  useEffect(() => {
    setQuestions(questionsData);
  }, []);

  useEffect(throttle(() => {
    if (containerRef.current && containerRef.current.firstChild) {
      const cardWidth = containerRef.current.firstChild.offsetWidth; // This is the cardwidth PLUS Marging/Padding
      const scrollPosition = cardWidth * currentQuestionIndex - (containerRef.current.offsetWidth / 2 - cardWidth / 2);
      containerRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
  }, [currentQuestionIndex]), 200);

  const handleAnswer = (answer) => {
    setAnswers(prevAnswers => {
      const updatedAnswers = [...prevAnswers];
      updatedAnswers[currentQuestionIndex] = answer;
      return updatedAnswers;
  });
    scrollToIndex(Math.min(currentQuestionIndex + 1, questions.length - 1));
  };
  
  
  const scrollToIndex = throttle((index) => {
    if (containerRef.current && containerRef.current.firstChild) {
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
  }, 200);

  
  
  const handleLeft = throttle(() => {
    scrollToIndex(Math.max(currentQuestionIndex - 1, 1)); // Skip the first card
  }, 200);
  
  const handleRight = throttle(() => {
    scrollToIndex(Math.min(currentQuestionIndex + 1, questions.length - 2)); // Skip the last card
  }, 200);
  

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
  }, 200);  

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
      <div className="absolute top-0 left-0 w-full transform skew-y-3" style={{ height: '110%' , backgroundImage: 'linear-gradient(to right, #3D6964, #FDFFFD)',}} />
      
      <div className="relative w-full overflow-x-hidden ">
      <div className="absolute left-0 top-0 h-full z-20 w-60 pointer-events-none bg-gradient-to-r from-[#3D6964] to-[#00000000]" />
<div className="absolute right-0 top-0 h-full w-60 z-20 pointer-events-none bg-gradient-to-r from-[#00000000] via to-[#FDFDFDCF]"/>


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


<div ref={containerRef} className="w-full px-0 py-20 flex space-x overflow-x-auto height-100 relative snap-x snap-mandatory"
     style={{ ...scrollBarHideStyle, WebkitOverflowScrolling: 'touch' }}>
  {questions.map((question, index) => (
    <div key={index} className={`shrink-0 transition-opacity duration-800 snap-center relative ${index === currentQuestionIndex ? 'transform scale-125 opacity-100 z-10 transition-transform duration-200' : 'transform scale-100 opacity-100 z-0 transition-transform duration-200'}`}>
      <QuestionCard
        index={index}
        question={{ ...question, text: t(question.text) }} // Translating the text property
        answer={answers[index]}
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
