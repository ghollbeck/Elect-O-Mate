import ReactCardFlip from 'react-card-flip';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdHelpOutline } from 'react-icons/md';
import { MdLoop } from 'react-icons/md';
import TextInput from './TextInput';

const QuestionCard = ({
  length,
  index,
  question,
  answer,
  onAnswer,
  isSending,
  handleSendMessage,
  scrollToChat,
  pressable,
}) => {
  const { t } = useTranslation();
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  // If question is empty, render an empty card
  if (!question || !question.text) {
    return (
      <div className='flex flex-col h-60 md:h-80 w-[270px] md:w-[800px] items-center justify-center p-6 bg-transparent text-white flex-shrink-0'></div>
    );
  }

  return (
    <ReactCardFlip isFlipped={isFlipped} flipDirection='horizontal'>
      {/* Front of the card */}
      <div className='flex flex-col h-[70dvh] md:h-80 w-[270px] md:w-[800px] p-1 text-white rounded-xl shadow-lg shadow-gray-900 bg-gray-700/80'>
        <div className='flex items-start h-auto pt-2 pl-2 flex-shrink-0'>
          <h2 className='text-xs md:text-xl font-thin break-words'>
            {index}/{length - 2} {question.title}
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
          </div>
        </div>

        <div className='flex flex-col justify-end text-gray-400 hover:text-gray-200 w-full flex-shrink-0 text-base'>
          <div className='block md:hidden'>
            <TextInput
              handleSendMessage={handleSendMessage}
              isSending={isSending}
              scrollToChat={scrollToChat}
              followup={t(question.followup_short)}
            />
          </div>
          <div className='hidden md:block'>
            <TextInput
              handleSendMessage={handleSendMessage}
              isSending={isSending}
              scrollToChat={scrollToChat}
              followup={t(question.followup)}
            />
          </div>
        </div>
      </div>

      {/* Back of the card */}
      <div className='flex flex-col h-[70dvh] md:h-80 w-[270px] md:w-[800px] p-1 text-white rounded-xl shadow-lg shadow-gray-900 bg-gray-700/80'>
        <div className='flex items-start h-auto pt-2 pl-2 flex-shrink-0'>
          <h2 className='text-xs md:text-xl font-thin break-words'>
            {index}/{length - 2} {t('answer_title')}
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
