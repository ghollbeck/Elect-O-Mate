import React, { useState, useRef, useEffect } from 'react';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import { useTranslation } from 'react-i18next';

const TextInput = ({
  handleSendMessage,
  setIsSending,
  isSending,
  scrollToChat,
  followup,
  question,
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
      handleSendMessage(question, inputValue, abortControllerRef.current);
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
    <div className='shadow-full relative border border-white rounded-3xl backdrop-blur-sm'>
      <form
        onSubmit={handleSubmit}
        className='flex items-center w-full relative'
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
          className='bg-transparent overflow-y-hidden appearance-none w-full py-2 px-3 leading-tight focus:outline-none box-border placeholder-gray-400 resize-none'
          style={{
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
            position: 'absolute',
            bottom: '0',
            right: 0,
            background: 'transparent', // fixed: background needs quotes
            borderRadius: '1.5rem',
          }}
          endIcon={
            isSending ? (
              <StopCircleIcon
                sx={{
                  fontWeight: '600', // font-semibold
                  transition: 'transform 0.2s ease-in-out', // transition duration-400 ease-in-out
                  transform: 'scale(1.25)', // initial scale
                  '&:hover': {
                    transform: 'scale(1.35)', // hover:scale-125
                  },
                  marginRight: '0.35rem', // mr-1
                  marginY: '0.125rem', // my-0.5
                }}
                className='font-semibold text-white'
              />
            ) : (
              <SendIcon
                sx={{
                  fontWeight: '600', // font-semibold
                  transition: 'transform 0.2s ease-in-out', // transition duration-400 ease-in-out
                  transform: 'scale(1.15)', // initial scale
                  '&:hover': {
                    transform: 'scale(1.25)', // hover:scale-125
                  },
                  marginRight: '0.25rem', // mr-1
                  marginY: '0.125rem', // my-0.5
                }}
                className='font-semibold text-white'
              />
            )
          }
        ></Button>
      </form>
    </div>
  );
};

export default TextInput;
