import React, { useState, useRef, useEffect } from 'react';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import { useTranslation } from 'react-i18next';

const TextInput = ({
  handleSendMessage,
  isSending,
  scrollToChat,
  followup,
  setIsSending,
}) => {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState('');
  const textareaRef = useRef(null);
  const buttonRef = useRef(null);
  const [textareaWidth, setTextareaWidth] = useState('100%');
  const [scrollPosition, setScrollPosition] = useState(0); // State to store scroll position

  useEffect(() => {
    if (buttonRef.current) {
      const buttonWidth = buttonRef.current.offsetWidth;
      setTextareaWidth(`calc(100% - ${buttonWidth + 5}px)`);
    }
  }, [buttonRef.current?.offsetWidth]);

  const handleChange = (event) => {
    setInputValue(event.target.value);
    resizeTextarea();
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey && !isSending) {
      event.preventDefault();
      handleSubmit(event);
    }
  };

  const resizeTextarea = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      const computedStyle = window.getComputedStyle(textarea);
      const lineHeight = parseFloat(computedStyle.lineHeight);
      const marginTop = parseFloat(computedStyle.marginTop);
      const marginBottom = parseFloat(computedStyle.marginBottom);

      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;

      const totalMargin = marginTop + marginBottom;
      const maxLines = Math.floor(
        (textarea.clientHeight - totalMargin) / lineHeight
      );
      if (maxLines >= 7) {
        textarea.style.height = `${7 * (lineHeight + totalMargin)}px`;
        textarea.style.overflowY = 'hidden';
      } else {
        textarea.style.overflowY = 'hidden';
      }
    }
  };

  const handleTextareaClick = () => {
    // Block automatic scrolling when keyboard appears on mobile devices
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      // Store current scroll position
      setScrollPosition(window.scrollY);
      // Listen for the keyboard appearance event
      window.addEventListener('resize', handleResize);
    }
  };

  const handleResize = () => {
    // When keyboard appears, scroll to the bottom of the textarea
    setTimeout(() => {
      textareaRef.current.scrollIntoView(false);
    }, 0);

    // Remove the event listener after handling the keyboard appearance
    window.removeEventListener('resize', handleResize);
    // Return to the original scroll position
    window.scrollTo(0, scrollPosition);
  };

  const abortControllerRef = useRef(null);

  const handleSubmit = async (event) => {
    const textarea = textareaRef.current;
    abortControllerRef.current = new AbortController();

    event.preventDefault();
    if (inputValue.trim() !== '') {
      handleSendMessage(inputValue, abortControllerRef.current);
      setInputValue('');
      textarea.style.height = 'auto';
      scrollToChat();
    }
  };

  const stopStreaming = () => {
    if (abortControllerRef.current && isSending) {
      abortControllerRef.current.abort();
      setIsSending(false);
    }
  };

  return (
    <div className='mt-9 shadow-full relative border-none'>
      <form
        onSubmit={handleSubmit}
        className='flex items-center w-full relative pb-[1px]'
      >
        <textarea
          ref={textareaRef}
          id='input-field'
          placeholder={t(followup)}
          value={inputValue}
          onKeyDown={handleKeyDown}
          onChange={handleChange}
          autoComplete='off'
          rows='1'
          className='shadow-xl bg-white resize-none appearance-none border-none w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline rounded-md box-border'
          style={{
            position: 'absolute',
            bottom: 0,
            width: textareaWidth,
          }}
          onClick={handleTextareaClick} // Add onClick event handler
        />
        <Button
          ref={buttonRef}
          type='submit'
          //disabled={isSending}
          onClick={stopStreaming} // stiopStreaming checks if isSending is true
          className='bg-red-300 scale-105 transition duration-300 ease-in-out transform hover:scale-110'
          variant='contained'
          style={{
            backgroundImage:
              'linear-gradient(to top right, rgba(248, 229, 127), rgba(222, 68, 8))',
            color: 'white', // Set button text color to white
            position: 'absolute',
            right: 1,
            bottom: 1,
            borderStyle: 'solid', // Set border style to solid
          }}
          endIcon={
            isSending ? (
              <StopCircleIcon className='font-semibold scale-150' />
            ) : (
              <SendIcon className='font-semibold' />
            )
          }
        ></Button>
      </form>
    </div>
  );
};

export default TextInput;
