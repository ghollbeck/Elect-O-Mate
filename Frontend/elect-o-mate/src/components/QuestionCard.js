import ReactCardFlip from 'react-card-flip';
import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { MdLoop } from 'react-icons/md';
import TextInput from './TextInput';
import HelpCard from './HelpCard';
import InfoIcon from '@mui/icons-material/Info';

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
  party,
  partyanswers,
}) => {
  const { t } = useTranslation();
  const [isFlipped, setIsFlipped] = useState(false);
  const partyAnswer = partyanswers.find(
    (item) =>
      item['Party_Name'] === party && item['Question_Number'] === index - 1
  );
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };
  const abortControllerRef = useRef(null);

  const partyPosition = async (party, abortController) => {
    abortControllerRef.current = new AbortController();
    const text =
      t('party_position_request_1') +
      partyAnswer['Full_Party_Name'] +
      t('party_position_request_2') +
      (partyAnswer['Party_Answer'] === 1
        ? t('agree_button')
        : partyAnswer['Party_Answer'] === 0
        ? t('neutral_button')
        : t('disagree_button')) +
      t('party_position_request_3') +
      '\n\n' +
      question.text;
    handleSendMessage('', text, abortControllerRef.current);
    scrollToChat();
  };

  // If question is empty, render an empty card
  if (!question || !question.text) {
    return (
      <div className='flex flex-col h-60 md:h-80 w-[75vw] lg:w-[800px] items-center justify-center bg-transparent flex-shrink-0'></div>
    );
  }
  if (question.text === 'help') {
    return <HelpCard length={length - 1} index={0} question={question} />;
  }
  if (question.text === 'submitcard') {
    return (
      <div className='flex flex-col h-[70dvh] md:h-80 w-[75vw] lg:w-[800px] p-1 text-white rounded-3xl shadow-lg shadow-gray-900 bg-black mb-5'>
        <div className='flex flex-col items-center justify-center h-full pt-2 pl-2 flex-shrink-0'>
          <h2 className='text-sm md:text-lg font-semibold text-center overflow-hidden w-full break-words leading-tight p-2 md:p-5'>
            {t('submit_text')}
          </h2>
          <button
            className={`border h-8 md:h-10 ${
              pressable ? 'hover:bg-blue-100 hover:text-black' : ''
            } font-bold py-1 md:py-2 px-4 rounded-3xl`}
            onClick={() => (pressable ? submit() : null)}
          >
            {t('submit_button')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ReactCardFlip isFlipped={isFlipped} flipDirection='horizontal'>
        {/* Front of the card */}
        <div
          className={`flex flex-col ${
            partyAnswer ? 'h-[45dvh]' : 'h-[70dvh]'
          } md:h-80 w-[75vw] lg:w-[800px] p-1 text-white rounded-3xl shadow-lg shadow-gray-900 bg-black mb-5`}
        >
          <div className='flex items-start h-auto pt-2 pl-2 flex-shrink-0'>
            <h2 className='text-xs md:text-xl font-thin break-words'>
              {index - 1}/{length - 4} {question.title}
            </h2>
            <button onClick={handleFlip} className='ml-auto mr-2 text-xl'>
              <InfoIcon />
            </button>
          </div>

          <div className='flex-grow flex items-center justify-center'>
            <h2 className='text-sm md:text-lg font-semibold text-center overflow-hidden w-full break-words leading-tight p-2 md:p-5'>
              {question.text}
            </h2>
          </div>

          <div className='flex justify-center items-end flex-shrink-0 pb-2 md:pb-8 max-w-full'>
            <div className='flex space-x-2 sm:space-x-4 max-w-full text-xl'>
              <button
                className={`border w-full h-8 md:h-10 ${
                  wheighted
                    ? 'text-black bg-blue-100'
                    : pressable
                    ? 'md:hover:bg-blue-100 md:hover:text-black'
                    : ''
                } font-bold px-2 md:px-4 rounded-3xl md:absolute left-0 md:left-2 md:w-14 md:rounded-full md:bottom-16`}
                onClick={() => (pressable ? handleWheight(!wheighted) : null)}
              >
                x2
              </button>
              <button
                className={`border w-full h-8 md:h-10 ${
                  answer === 1
                    ? 'text-black bg-blue-100'
                    : pressable
                    ? 'hover:bg-blue-100 hover:text-black'
                    : ''
                } font-bold px-2 sm:px-4 rounded-3xl`}
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
                } font-bold px-2 sm:px-4 rounded-3xl`}
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
                } font-bold px-2 sm:px-4 rounded-3xl`}
                onClick={() => (pressable ? onAnswer(-1) : null)}
              >
                {t('disagree_button')}
              </button>
            </div>
          </div>

          <div className='flex flex-col justify-end text-gray-400 hover:text-gray-200 w-full flex-shrink-0 text-base'>
            <div className='block md:hidden text-white mt-10'>
              <TextInput
                handleSendMessage={handleSendMessage}
                setIsSending={setIsSending}
                isSending={isSending}
                scrollToChat={scrollToChat}
                followup={t(question.followup_short)}
                question={question.text}
              />
            </div>
            <div className='hidden md:block mt-5'>
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
        <div
          className={`flex flex-col ${
            partyAnswer ? 'h-[45dvh]' : 'h-[70dvh]'
          } md:h-80 w-[75vw] lg:w-[800px] p-1 text-white rounded-3xl shadow-lg shadow-gray-900 bg-black mb-5`}
        >
          <div className='flex items-start h-auto pt-2 pl-2 flex-shrink-0'>
            <h2 className='text-xs md:text-xl font-thin break-words'>
              {index - 1}/{length - 4} {t(question.title)}
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
              {question.fact}
            </h2>
          </div>
        </div>
      </ReactCardFlip>
      {partyAnswer ? (
        <div className='flex flex-col h-[20dvh] md:h-20 w-[75vw] lg:w-[800px] p-1 text-center text-white  rounded-xl shadow-lg shadow-gray-900 bg-black mb-5 items-center justify-center'>
          {partyAnswer['Full_Party_Name']} {t('party_voted_for')}{' '}
          {partyAnswer['Party_Answer'] === 1
            ? t('agree_button')
            : partyAnswer['Party_Answer'] === 0
            ? t('neutral_button')
            : t('disagree_button')}
          <button
            className={`border h-8 md:h-10 ${
              pressable ? 'hover:bg-blue-100 hover:text-black' : ''
            } font-bold py-1 md:py-2 px-4 rounded-xl`}
            onClick={() => (pressable ? partyPosition() : null)}
          >
            {t('more_information')}
          </button>
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

export default QuestionCard;
