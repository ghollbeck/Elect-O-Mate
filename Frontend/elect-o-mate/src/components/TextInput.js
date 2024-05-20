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
    if (event.key === 'Tab' && !isSending && inputValue.trim() === '') {
      event.preventDefault();
      setInputValue(t(followup));
      textareaRef.current.focus();
    }
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
    <div className='mt-9 shadow-full relative border-none z-20'>
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
          className='shadow-xl bg-transparent resize-none appearance-none border border-white w-full py-2 px-3 text-white leading-tight focus:outline-none rounded-xl box-border placeholder-gray-400'
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
          onClick={stopStreaming} // stiopStreaming checks if isSending is true
          sx={{
            backgroundColor: 'transparent',
            border: '1px solid white',
            // paddingY: 1,
            //paddingX: 2,
            borderRadius: '0.75rem',
            transition: 'transform 300ms ease-in-out',
            position: 'absolute',
            right: 0,
            bottom: 0,
          }}
          endIcon={
            isSending ? (
              <StopCircleIcon className='font-semibold scale-150 text-white transition duration-400 ease-in-out transform hover:scale-125' />
            ) : (
              <SendIcon className='font-semibold text-white transition duration-400 ease-in-out transform hover:scale-125 mr-1 my-0.5' />
            )
          }
        ></Button>
      </form>
    </div>
  );
};

export default TextInput;
