import React, { useState, useEffect, useRef } from 'react';
import QuestionCard from './QuestionCard';
import questionsData from '../data/questions.json';
import { throttle } from 'lodash';
import { useTranslation } from 'react-i18next';
import EUstars from '../pictures/EUstars.png';

const Questionnaire = ({
  handleSendMessage,
  isSending,
  setIsSending,
  scrollToChat,
  scrollToQuestionnaire,
  questionnaireAnswers,
  scrollToResult,
  country,
  party,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(1);
  const [questions, setQuestions] = useState([]);
  const [partyanswers, setPartyAnswers] = useState([]);
  const containerRef = useRef(null);
  const isButtonScroll = useRef(false); // Track button clicks
  const [answers, setAnswers] = useState(
    Array(questionsData.length).fill({
      answer: null,
      wheight: false,
    })
  );

  useEffect(() => {
    setQuestions(questionsData);
  }, []);

  useEffect(() => {
    scrollToIndex(1); // Scroll to index 1 when component mounts
  }, []); // Empty dependency array means it only runs once, on mount

  useEffect(
    throttle(() => {
      if (containerRef.current && containerRef.current.firstChild) {
        const cardWidth = containerRef.current.firstChild.offsetWidth; // This is the cardwidth PLUS Marging/Padding
        const scrollPosition =
          cardWidth * currentQuestionIndex -
          (containerRef.current.offsetWidth / 2 - cardWidth / 2);
        containerRef.current.scrollTo({
          left: scrollPosition,
          behavior: 'smooth',
        });
      }
    }, [currentQuestionIndex]),
    200
  );

  const abortControllerRef = useRef(null);

  const constructJSON = (answers) => {
    const formattedAnswers = answers.map((message) => ({
      users_answer: message.answer === null ? 0 : message.answer,
      Wheights: message.wheight ? 'true' : 'false',
      Skipped: message.answer === null ? 'true' : 'false',
    }));

    return {
      country, // Include the country value as a key-value pair
      data: formattedAnswers, // Add the formatted answer objects as an array
    };
  };

  const submit = async () => {
    console.log('SUBMIT');
    abortControllerRef.current = new AbortController();

    const jsonData = constructJSON(answers);
    console.warn({ jsonData });

    try {
      const response = await fetch(
        // process.env.REACT_APP_BACKEND_URL + '/evaluate',
        'http://10.5.189.107:8000/evaluate',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ jsonData }),
          signal: abortControllerRef.current.signal,
        }
      );

      const data = await response.json();
      console.log(data);
      questionnaireAnswers(data.result, abortControllerRef.current); // Pass the fetched data to questionnaireAnswers function
      setPartyAnswers(data.party_answers);
      console.warn(data.party_answers);
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Fetch aborted');
      } else {
        console.error('Error fetching data:', error);
      }
    }
    // setPartyAnswers();
    scrollToChat();
  };

  const scrollToIndex = throttle((index) => {
    if (containerRef.current && containerRef.current.firstChild) {
      isButtonScroll.current = true; // Indicate button click
      const cardWidth = containerRef.current.firstChild.offsetWidth;
      let scrollPosition;

      scrollPosition =
        cardWidth * index -
        (containerRef.current.offsetWidth / 2 - cardWidth / 2);

      containerRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth',
      });

      setCurrentQuestionIndex(index);
    }
  }, 200);

  const handleWheight = (wheight) => {
    setAnswers((prevAnswers) => {
      const updatedAnswers = [...prevAnswers];
      updatedAnswers[currentQuestionIndex] = {
        answer: updatedAnswers[currentQuestionIndex].answer,
        wheight: wheight,
      }; // first card with content has index 1
      return updatedAnswers;
    });

    scrollToQuestionnaire();
  };
  const handleAnswer = (answer) => {
    setAnswers((prevAnswers) => {
      const updatedAnswers = [...prevAnswers];
      updatedAnswers[currentQuestionIndex] = {
        answer: answer,
        wheight: updatedAnswers[currentQuestionIndex].wheight,
      }; // first card with content has index 1
      return updatedAnswers;
    });

    scrollToIndex(Math.min(currentQuestionIndex + 1, questions.length - 1));
    scrollToQuestionnaire();
  };

  const handleLeft = throttle(() => {
    scrollToIndex(Math.max(currentQuestionIndex - 1, 1)); // Skip the first card
    scrollToQuestionnaire();
  }, 200);

  const handleRight = throttle(() => {
    scrollToIndex(Math.min(currentQuestionIndex + 1, questions.length - 2)); // Skip the last card
    scrollToQuestionnaire();
  }, 200);

  useEffect(() => {
    const handleScroll = throttle(() => {
      if (isButtonScroll.current) {
        isButtonScroll.current = false; // Reset button scroll flag
        return;
      }
      if (containerRef.current) {
        const container = containerRef.current;
        const containerCenter = container.offsetWidth / 2;
        const cards = Array.from(container.children);
        let closestIndex = 1;
        let closestDistance = Infinity;

        cards.forEach((card, index) => {
          const cardCenter = card.offsetLeft + card.offsetWidth / 2;
          const distance = Math.abs(
            cardCenter - container.scrollLeft - containerCenter
          );
          if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
          }
        });

        setCurrentQuestionIndex(closestIndex);
        if (closestIndex <= 1) {
          scrollToIndex(1);
        }
        if (closestIndex >= questions.length - 2) {
          scrollToIndex(questions.length - 2);
        }
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
    overflow: 'auto', // Enable scrolling
    msOverflowStyle: 'none', // IE and Edge
    scrollbarWidth: 'none', // Firefox
  };

  // Additional style for WebKit browsers
  const webkitScrollBarHideStyle = {
    '::WebkitScrollbar': {
      display: 'none', // Safari and Chrome
    },
  };

  const { t } = useTranslation();

  return (
    <div className=' flex-grow bg-red h-auto md:py-20 flex items-center justify-center relative w-full scroll-snap-x snap-mandatory py-6'>
      <div
        className='absolute top-0 left-0 w-full transform scale-125 skew-y-3'
        style={{
          height: '110%',
          backgroundImage: 'linear-gradient(to right, #3D6964, #FDFFFD)',
        }}
      />
      <div className='absolute top-0 left-0 w-full h-0 md:h-full z-3 scale-125 overflow-hidden'>
        <img
          src={EUstars}
          alt='Background Overlay'
          className='h-full w-auto object-fit'
        />
      </div>

      <div className='relative w-full overflow-x-hidden scroll-snap-x snap-mandatory'>
        {currentQuestionIndex > 1 && (
          <button
            z
            onClick={handleLeft}
            className='hidden lg:block absolute left-20 top-1/2 transform -translate-y-1/2 bg-white text-black p-6 rounded-full z-30'
          >
            <svg
              className='w-8 h-8'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='3'
                d='M15 19l-7-7 7-7'
              ></path>
            </svg>
          </button>
        )}

        {currentQuestionIndex < questions.length - 2 && (
          <button
            onClick={handleRight}
            className='hidden lg:block absolute right-20 top-1/2 transform -translate-y-1/2 bg-white text-black p-6 rounded-full z-30'
          >
            <svg
              className='w-8 h-8'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='3'
                d='M9 5l7 7-7 7'
              ></path>
            </svg>
          </button>
        )}

        <div
          ref={containerRef}
          className='w-full px-0 py-20 flex space-x overflow-x-auto height-100 relative snap-x snap-mandatory'
          style={{
            ...webkitScrollBarHideStyle,
            ...scrollBarHideStyle,
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {questions.map((question, index) => (
            <div
              key={index}
              className={`shrink-0 transition-opacity duration-800 snap-center relative ${
                index === currentQuestionIndex
                  ? 'transform scale-125 opacity-100 z-10 transition-transform duration-200'
                  : 'transform scale-100 opacity-100 z-0 transition-transform duration-200'
              }`}
            >
              <QuestionCard
                partyanswers={partyanswers}
                party={party}
                length={questions.length}
                index={index}
                question={{
                  ...question,
                  text: t(question.text),
                  title: t(question.title),
                  followup: t(question.followup),
                  fact: t(question.fact),
                }}
                wheighted={answers[index].wheight}
                answer={answers[index].answer}
                onAnswer={handleAnswer}
                handleWheight={handleWheight}
                handleSendMessage={handleSendMessage}
                setIsSending={setIsSending}
                isSending={isSending}
                scrollToChat={scrollToChat}
                scrollToQuestionnaire={scrollToQuestionnaire}
                pressable={index === currentQuestionIndex}
                submit={submit}
                scrolltoResult={scrollToResult}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;
