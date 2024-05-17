import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios'; // Import axios for HTTP requests
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import chatbot from './../pictures/Bot.png'; // Add this icon to @mui
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
      const maxLines = Math.floor((textarea.clientHeight - totalMargin) / lineHeight);
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
    <div className="mt-9 rounded- shadow-full relative border-none">
      <form onSubmit={handleSubmit} className="flex items-center w-full relative pb-[1px]">
        <textarea
          ref={textareaRef}
          id="input-field"
          placeholder={t('chat_placeholder')}
          value={inputValue}
          onKeyDown={handleKeyDown}
          onChange={handleChange}
          autoComplete="off"
          rows="1"
          className="shadow-xl bg-gradient-to-r from-blue-100 to-green-100 resize-none appearance-none border-none w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline rounded-md box-border"
          style={{
            position: 'absolute',
            bottom: 0,
            width: textareaWidth,
          }} 
        />
        <Button
          ref={buttonRef}
          type="submit"
          disabled={isSending}
          className="bg-gradient-to-r from-green-500 to-blue-500 scale-105 font-semibold transition duration-300 ease-in-out transform hover:bg-gradient-to-r hover:from-pink-500 hover:to-indigo-500 text-xl"
          variant="contained"
          style={{ color: 'black', position: 'absolute', right: 0, bottom: 1 }}
          endIcon={isSending ? <CircularProgress size={23} sx={{ color: 'black' }} /> : <SendIcon style={{ fontSize: 22, color: 'black' }} />}
        >
          {/* {isSending ? t('send_button_sending') : t('send_button_send')} */}
        </Button>

      </form>
    </div>
  );
};



const Chat = () => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    setMessages([{ text: t('bot_greeting'), isUser: false }]);
  }, [t]); // Empty dependency array ensures it only runs once on mount

  const handleSendMessage = async (text) => {
    // Add user's message to chat
    setMessages((prevMessages) => [...prevMessages, { text, isUser: true }]);
    setIsSending(true); 

    try {
      // Perform API request
      const response = await axios.post('https://backend.bruol.me/openai/invoke', { input: text });

      // Add API response to chat
      setMessages((prevMessages) => [...prevMessages, { text: response.data.output, isUser: false }]);
    } catch (error) {
      // Add error message to chat
      setMessages((prevMessages) => [...prevMessages, { text: 'An error occurred. Please try again.', isUser: false, isError: true }]);
    } finally {
      setIsSending(false); // Reset isSending after API call completes
    }
  };

  return (
    <div > {/* Add margin-top */}
      <ChatWindow messages={messages} onSendMessage={handleSendMessage} isSending={isSending} />
      <TextInput onSendMessage={handleSendMessage} isSending={isSending} />
    </div>
  );
};


const ChatWindow = ({ messages, onSendMessage, isSending }) => {
  const { t } = useTranslation();
  const chatWindowRef = useRef(null);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  const convertTextToLinks = (text) => {
    const urlRegex = /(\b(?:https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/ig;
    return text.split(urlRegex).map((part, index) => {
      if (urlRegex.test(part)) {
        return <a key={index} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{part}</a>;
      }
      return part;
    });
  };

  return (
    <div className="bg-gradient-to-r from-orange-50 to-orange-100 overflow-y-auto border-none shadow-xl border-gray-300 flex flex-col justify-between" style={{ height: '700px', overflowY: 'auto', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'thin', scrollbarColor: 'rgba(155, 155, 155, 0.5) rgba(255, 255, 255, 0.5)', borderRadius: '10px'}} ref={chatWindowRef}>
      <div className="p-4">
        <div className="mb-2 flex-grow">
          {messages.map((message, index) => (
            <div key={index} className={`mb-2 ${message.isUser ? 'text-right' : 'text-left'}`}>
              {message.isUser ? (
                <div className="flex flex-col items-end overflow-y-auto">
                  <p className="font-bold text-gray-700">{t('chat_YOU')}</p>
                  <p className="text-gray-600 bg-green-200 p-2 rounded-md text-left" style={{ wordBreak: 'break-word' }}>{message.text}</p>
                </div>
              ) : (
                <div className="flex flex-col items-start">
                  <p className={`font-bold ${message.isError ? 'text-red-700' : 'text-blue-700'}`}>
                    <span className="inline-block align-middle rounded-full overflow-hidden m-2">
                      <img src={chatbot} alt="Bot Profile" style={{ height: '1.9em', width: '1.9em' }} />
                    </span>
                    {message.isError ? 'Error' : 'Elect-O-Mate'}
                  </p>
                  <p className="text-gray-600 bg-blue-100 p-2 rounded-md text-left break-words">{convertTextToLinks(message.text)}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Chat;
