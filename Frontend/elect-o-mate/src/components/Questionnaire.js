import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import QuestionCard from './QuestionCard';
import { throttle } from 'lodash';
import { useTranslation } from 'react-i18next';
import ProgressBar from './ProgressBar';
import Cookies from 'js-cookie';

const Questionnaire = ({
  key,
  handleSendMessage,
  isSending,
  setIsSending,
  scrollToChat,
  scrollToQuestionnaire,
  questionnaireAnswers,
  scrollToResult,
  country,
  party,
  init,
}) => {
  const { t, i18n } = useTranslation();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(1);
  const [questions, setQuestions] = useState([]);
  const [partyanswers, setPartyAnswers] = useState([]);
  const containerRef = useRef(null);
  const isButtonScroll = useRef(false);

  const [answers, setAnswers] = useState(
    Array(parseInt(t('0')) + 4).fill({
      answer: null,
      wheight: false,
    })
  );

  const clearCookies = () => {
    const allCookies = Cookies.get();
    for (const cookie in allCookies) {
      Cookies.remove(cookie);
    }
  };

  useEffect(() => {
    if (init) {
      // Assuming scrollToIndex is a function defined in your child component
      scrollToIndex(1);
    }
  }, [init]);

  useEffect(() => {
    const savedLanguage = Cookies.get('language');
    const currentLanguage = i18n.language.slice(0, 2).toUpperCase();
    if (savedLanguage && savedLanguage !== currentLanguage) {
      clearCookies();
    }
    Cookies.set('language', currentLanguage, {
      expires: 2 / 144,
    });
  }, [i18n.language]);

  const [questionCount, setQuestionCount] = useState(0);

  useEffect(() => {
    const savedAnswers = Cookies.get('questionnaireAnswers');
    if (savedAnswers) {
      const parsedAnswers = JSON.parse(savedAnswers);
      setAnswers(parsedAnswers);
      const nonNullAnswers = parsedAnswers.filter(
        (answer) => answer.answer !== null
      ).length;
      setQuestionCount(nonNullAnswers);
    }
    setQuestions(generateQuestionArray(parseInt(t('0'))));
  }, []);

  function generateQuestionArray(numQuestions) {
    let questionArray = [
      { title: '', text: '' },
      { title: 'how_it_works', text: 'help' },
    ];

    for (let i = 1; i <= numQuestions; i++) {
      let question = {
        title: 't' + i,
        text: 'q' + i,
        followup: 'f' + i,
        followup_short: 'followup',
        fact: 'fact' + i,
      };
      questionArray.push(question);
    }

    questionArray.push({ text: 'submitcard' });
    questionArray.push({ title: '', text: '' });

    return questionArray;
  }

  useEffect(() => {
    setQuestions(generateQuestionArray(parseInt(t('0'))));
  }, [t]);

  useEffect(
    throttle(() => {
      if (containerRef.current && containerRef.current.firstChild) {
        const cardWidth = containerRef.current.firstChild.offsetWidth; // This is the cardwidth PLUS Margin/Padding
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
      country,
      data: formattedAnswers,
    };
  };

  const submit = async () => {
    //console.log('SUBMIT');
    abortControllerRef.current = new AbortController();

    const jsonData = constructJSON(answers);
    // console.warn({ jsonData });

    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + '/evaluate',
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
      // console.log(data);
      questionnaireAnswers(data.result, abortControllerRef.current);
      setPartyAnswers(data.party_answers);
      //console.warn(data.party_answers);
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Fetch aborted');
      } else {
        console.error('Error fetching data:', error);
      }
    }
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
      };
      Cookies.set('questionnaireAnswers', JSON.stringify(updatedAnswers), {
        expires: 2 / 144,
      });

      return updatedAnswers;
    });

    scrollToQuestionnaire();
  };

  const handleAnswer = (answer) => {
    setAnswers((prevAnswers) => {
      const updatedAnswers = [...prevAnswers];
      const prevAnswer = updatedAnswers[currentQuestionIndex].answer;
      updatedAnswers[currentQuestionIndex] = {
        answer: answer,
        wheight: updatedAnswers[currentQuestionIndex].wheight,
      };

      if (prevAnswer === null && answer !== null) {
        setQuestionCount(() => questionCount + 1);
      }
      Cookies.set('questionnaireAnswers', JSON.stringify(updatedAnswers), {
        expires: 2 / 144,
      });

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
        isButtonScroll.current = false;
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
    overflow: 'auto',
    msOverflowStyle: 'none',
    scrollbarWidth: 'none',
  };

  const webkitScrollBarHideStyle = {
    '::WebkitScrollbar': {
      display: 'none',
    },
  };

  return (
    <div className='flex-grow bg-red h-auto md:py-20 flex items-center justify-center relative w-full scroll-snap-x snap-mandatory py-6'>
      <div
        className='absolute top-0 left-0 w-full transform scale-125 skew-y-3 bg-gradient-to-r from-violet-200 to-pink-200'
        style={{
          height: '110%',
        }}
      />

      <div className='overflow-y-hidden relative w-full overflow-x-hidden scroll-snap-x snap-mandatory'>
        {currentQuestionIndex > 1 && (
          <button
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
          className='w-full px-0 py-20 flex space-x overflow-x-auto relative snap-x snap-mandatory'
          style={{
            ...webkitScrollBarHideStyle,
            ...scrollBarHideStyle,
            WebkitOverflowScrolling: 'touch',
            height: 'auto',
          }}
        >
          {questions.map((question, index) => (
            <div
              key={index}
              className={`shrink-0 transition-opacity duration-800 snap-center relative ${
                index === currentQuestionIndex
                  ? 'transform scale-[1.2] lg:scale-125 opacity-95 z-10 transition-transform duration-200'
                  : 'transform scale-100 opacity-80 z-0 transition-transform duration-200'
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
        <div className='relative w-full px-10'>
          <ProgressBar current={questionCount} total={questions.length - 4} />
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;
