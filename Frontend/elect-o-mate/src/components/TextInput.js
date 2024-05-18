import React, { useState, useRef, useEffect } from 'react';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import CircularProgress from '@mui/material/CircularProgress';
import { useTranslation } from 'react-i18next';

const TextInput = ({ onSendMessage, isSending }) => {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState('');
  const textareaRef = useRef(null);
  const buttonRef = useRef(null);
  const [textareaWidth, setTextareaWidth] = useState('100%');

  useEffect(() => {
    if (buttonRef.current) {
      const buttonWidth = buttonRef.current.offsetWidth;
      setTextareaWidth(`calc(100% - ${buttonWidth + 2}px)`);
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

  const handleSubmit = async (event) => {
    const textarea = textareaRef.current;
    event.preventDefault();
    if (inputValue.trim() !== '') {
      onSendMessage(inputValue);
      setInputValue('');
      textarea.style.height = 'auto';
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
          placeholder={t('chat_placeholder')}
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
        />
        <Button
          ref={buttonRef}
          type='submit'
          disabled={isSending}
          className='bg-red-300 scale-105 font-semibold transition duration-300 ease-in-out transform hover:scale-110 text-xl'
          variant='contained'
          style={{
            backgroundColor: 'black', // Set button background color to black
            color: 'white', // Set button text color to white
            position: 'absolute',
            right: 0,
            bottom: 1,
            borderColor: 'white', // Set border color to white
            borderWidth: '1px', // Set border width to 2px to make it visible
            borderStyle: 'solid', // Set border style to solid
          }}
          endIcon={
            isSending ? (
              <CircularProgress size={23} sx={{ color: 'black' }} />
            ) : (
              <SendIcon style={{ fontSize: 22, color: 'white' }} />
            )
          }
        >
          {/* {isSending ? t('send_button_sending') : t('send_button_send')} */}
        </Button>
      </form>
    </div>
  );
};

export default TextInput;
