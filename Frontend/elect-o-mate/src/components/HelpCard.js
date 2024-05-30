import ReactCardFlip from 'react-card-flip';
import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { MdHelpOutline, MdLoop } from 'react-icons/md';
import TextInput from './TextInput';

const QuestionCard = ({ length, index, question }) => {
  const { t } = useTranslation();
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div>
      <ReactCardFlip isFlipped={isFlipped} flipDirection='horizontal'>
        {/* Front of the card */}
        <div className='flex flex-col h-[70dvh] md:h-80 w-[75vw] lg:w-[800px] p-1 text-white rounded-3xl shadow-lg shadow-gray-900 bg-black mb-5'>
          <div className='flex items-start h-auto pt-2 pl-2 flex-shrink-0'>
            <h2 className='text-xs md:text-xl font-thin break-words'>
              {index}/{length - 3} {t(question.title)}
            </h2>
            <button onClick={handleFlip} className='ml-auto mr-2 text-xl'>
              <MdHelpOutline />
            </button>
          </div>
          <div className='flex flex-grow items-center justify-center text-sm md:text-lg font-semibold overflow-hidden break-words leading-tight p-2 text-center'>
            {t('how_it_works_front')}
          </div>
        </div>

        {/* Back of the card */}
        <div className='flex flex-col h-[70dvh] md:h-80 w-[75vw] lg:w-[800px] p-1 text-white rounded-3xl shadow-lg shadow-gray-900 bg-black mb-5'>
          <div className='flex items-start h-auto pt-2 pl-2 flex-shrink-0'>
            <h2 className='text-xs md:text-xl font-thin break-words'>
              {index}/{length - 3} {t(question.title)}
            </h2>
            <button
              onClick={handleFlip}
              className='ml-auto mr-2 text-xl font-thin'
            >
              <MdLoop />
            </button>
          </div>
          <div className='flex flex-grow items-center justify-center text-sm md:text-lg font-semibold overflow-hidden break-words leading-tight p-2 text-center'>
            {t('how_it_works_back')}
          </div>
        </div>
      </ReactCardFlip>
    </div>
  );
};

export default QuestionCard;
