import ReactCardFlip from 'react-card-flip';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdHelpOutline, MdLoop } from 'react-icons/md';
import TextInput from './TextInput';

const QuestionCard = ({
  length,
  index,
  question,
  answer,
  wheighted,
  onAnswer,
  isSending,
  handleSendMessage,
  setIsSending,
  scrollToChat,
  pressable,
  submit,
  handleWheight,
}) => {
  const { t } = useTranslation();
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  // If question is empty, render an empty card
  if (!question || !question.text) {
    return (
      <div className='flex flex-col h-60 md:h-80 w-[75vw] lg:w-[800px] items-center justify-center bg-transparent text-white flex-shrink-0'></div>
    );
  }
  if (question.text === 'submitcard') {
    return (
      <div className='flex flex-col h-[70dvh] md:h-80 w-[75vw] lg:w-[800px] p-1 text-white rounded-xl shadow-lg shadow-gray-900 bg-gray-700/95 mb-5'>
        <div className='flex flex-col items-center justify-center h-full pt-2 pl-2 flex-shrink-0'>
          <h2 className='text-sm md:text-lg font-semibold text-center overflow-hidden w-full break-words leading-tight p-2 md:p-5'>
            {t('submit_text')}
          </h2>
          <button
            className={`border h-8 md:h-10 ${
              pressable ? 'hover:bg-blue-100 hover:text-black' : ''
            } font-bold py-1 md:py-2 px-4 rounded-xl`}
            onClick={() => (pressable ? submit() : null)}
          >
            {t('submit_button')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <ReactCardFlip isFlipped={isFlipped} flipDirection='horizontal'>
      {/* Front of the card */}
      <div className='flex flex-col h-[70dvh] md:h-80 w-[75vw] lg:w-[800px] p-1 text-white rounded-xl shadow-lg shadow-gray-900 bg-gray-700/95 mb-5'>
        <div className='flex items-start h-auto pt-2 pl-2 flex-shrink-0'>
          <h2 className='text-xs md:text-xl font-thin break-words'>
            {index}/{length - 3} {question.title}
          </h2>
          <button onClick={handleFlip} className='ml-auto mr-2 text-xl'>
            <MdHelpOutline />
          </button>
        </div>

        <div className='flex-grow flex items-center justify-center'>
          <h2 className='text-sm md:text-lg font-semibold text-center overflow-hidden w-full break-words leading-tight p-2 md:p-5'>
            {question.text}
          </h2>
        </div>

        <div className='flex justify-center items-end flex-shrink-0 pb-2 md:pb-8'>
          <div className='flex space-x-1 md:space-x-4'>
            <button
              className={`border w-full h-8 md:h-10 ${
                answer === 1
                  ? 'text-black bg-blue-100'
                  : pressable
                  ? 'hover:bg-blue-100 hover:text-black'
                  : ''
              } font-bold py-1 md:py-2 px-4 rounded-xl`}
              onClick={() => (pressable ? onAnswer(1) : null)}
            >
              {t('agree_button')}
            </button>
            <button
              className={`border w-full h-8 md:h-10 ${
                answer === 0
                  ? 'text-black bg-blue-100'
                  : pressable
                  ? 'hover:bg-blue-100 hover:text-black'
                  : ''
              } font-bold py-1 md:py-2 px-4 rounded-xl`}
              onClick={() => (pressable ? onAnswer(0) : null)}
            >
              {t('neutral_button')}
            </button>
            <button
              className={`border w-full h-8 md:h-10 ${
                answer === -1
                  ? 'text-black bg-blue-100'
                  : pressable
                  ? 'hover:bg-blue-100 hover:text-black'
                  : ''
              } font-bold py-1 md:py-2 px-4 rounded-xl`}
              onClick={() => (pressable ? onAnswer(-1) : null)}
            >
              {t('disagree_button')}
            </button>
            <button
              className={`border w-8 h-8 md:w-10 md:h-10 absolute left-0 bottom-14 ${
                wheighted
                  ? 'text-black bg-blue-100'
                  : pressable
                  ? 'hover:bg-blue-100 hover:text-black'
                  : ''
              } font-bold py-1 md:py-2 px-4 rounded-full flex items-center justify-center`}
              onClick={() => (pressable ? handleWheight(!wheighted) : null)}
            >
              x2
            </button>
          </div>
        </div>

        <div className='flex flex-col justify-end text-gray-400 hover:text-gray-200 w-full flex-shrink-0 text-base'>
          <div className='block md:hidden'>
            <TextInput
              handleSendMessage={handleSendMessage}
              setIsSending={setIsSending}
              isSending={isSending}
              scrollToChat={scrollToChat}
              followup={t(question.followup_short)}
              question={question.text}
            />
          </div>
          <div className='hidden md:block'>
            <TextInput
              handleSendMessage={handleSendMessage}
              setIsSending={setIsSending}
              isSending={isSending}
              scrollToChat={scrollToChat}
              followup={t(question.followup)}
              question={question.text}
            />
          </div>
        </div>
      </div>

      {/* Back of the card */}
      <div className='flex flex-col h-[70dvh] md:h-80 w-[75vw] lg:w-[800px] p-1 text-white rounded-xl shadow-lg shadow-gray-900 bg-gray-700'>
        <div className='flex items-start h-auto pt-2 pl-2 flex-shrink-0'>
          <h2 className='text-xs md:text-xl font-thin break-words'>
            {index}/{length - 3} {t('answer_title')}
          </h2>
          <button
            onClick={handleFlip}
            className='ml-auto mr-2 text-xl font-thin'
          >
            <MdLoop />
          </button>
        </div>

        <div className='flex-grow flex items-center justify-center'>
          <h2 className='text-sm md:text-lg font-semibold text-center overflow-hidden w-full break-words leading-tight p-2 md:p-5'>
            {t('question_card_back')}
          </h2>
        </div>
      </div>
    </ReactCardFlip>
  );
};

export default QuestionCard;
