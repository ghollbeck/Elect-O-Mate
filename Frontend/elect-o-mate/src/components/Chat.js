import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios'; // Importiere axios für HTTP-Anfragen
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import chatbot from './../pictures/Bot.png'; //added this icon to @mui
import CircularProgress from '@mui/material/CircularProgress';


const TextInput = ({ onSendMessage, isSending }) => {
  const [inputValue, setInputValue] = useState('');
  const textareaRef = useRef(null);

  const handleChange = (event) => {
    setInputValue(event.target.value);
    resizeTextarea();
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
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
        textarea.style.height = `${7 * lineHeight + totalMargin}px`; // Kinda weird, that total Margin is not added
        // textarea.style.overflowY = 'scroll';                     //do you wanna scroll? otherwise just define it in textarea
        textarea.style.overflowY = 'hidden';
      } else {
        textarea.style.overflowY = 'hidden';
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (inputValue.trim() !== '') {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  return (
    <div className="w-full m-0 p-0 border-b border-r border-l rounded-lg">
      <form onSubmit={handleSubmit} className="flex items-center w-full">
        <div className="flex w-full">
                                          {/* I do not know how to set the minimal height value of textarea to 1 row. */}
          <textarea                                       
            ref={textareaRef}
            id="input-field"
            placeholder="Enter a question..."
            value={inputValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className="shadow resize-none appearance-none overflow-y-hidden border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <Button
            type="submit"
            disabled={isSending}
            className="py-4 px-5 pt-2 bg-gradient-to-r from-orange-200 to-white font-semibold transition duration-300 ease-in-out transform hover:bg-gradient-to-r hover:from-pink-500 hover:to-indigo-500 text-xl"
            variant="contained"
            style={{ color: "black" }}
            endIcon={isSending ? <CircularProgress size={12} sx={{ color: "black" }}/> : <SendIcon sx={{ color: "black" }}/>}
          >
            {isSending ? 'Sending' : 'Send'}
          </Button>
        </div>
      </form>
    </div>
  );
};

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    setMessages([{ text: "Hello, I am here to help you. Please ask me a question!", isUser: false }]);
  }, []); // Empty dependency array ensures it only runs once on mount

  const handleSendMessage = async (text) => {
    // Hinzufügen der Nachricht des Benutzers zum Chat
    setMessages((prevMessages) => [...prevMessages, { text, isUser: true }]);
    setIsSending(true); 

    try { // Antwort posten
      const response = await axios.post('https://backend.bruol.me/openai/invoke', { input: text });
      console.log(response.data);
      setMessages((prevMessages) => [...prevMessages, { text: response.data.output, isUser: false }]);
    } catch (error) { // Fehlermeldung 
      console.error(error);
      setMessages((prevMessages) => [...prevMessages, { text: 'An error occurred. Please try again.', isUser: false, isError: true }]);
    } finally {
      setIsSending(false); // Reset isSending after API call completes
    }
  };

  return (
    <div>
      <ChatWindow messages={messages} onSendMessage={handleSendMessage} isSending={isSending} />
      <TextInput onSendMessage={handleSendMessage} isSending={isSending} />
    </div>
  );
};

const ChatWindow = ({ messages, onSendMessage, isSending }) => {
  const chatWindowRef = useRef(null);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);
  // linebreaks are not displayed in the chat window
  return (
    <div className="bg-white overflow-y-auto border-t border-r border-l shadow-xl border-gray-300 rounded-t-lg flex flex-col justify-between" style={{ height: '700px' }} ref={chatWindowRef}>
      <div className="p-4">
        <div className="mb-2 flex-grow">
          {messages.map((message, index) => (
            <div key={index} className={`mb-2 ${message.isUser ? 'text-right' : 'text-left'}`}>
              {message.isUser ? (
                <div className="flex flex-col items-end overflow-y-auto">
                  <p className="font-bold text-gray-700">You</p>
                  <p className="text-gray-600 bg-gray-200 p-2 rounded-md">{message.text}</p>
                </div>
              ) : (
                <div className="flex flex-col items-start">
                  <p className={`font-bold ${message.isError ? 'text-red-700' : 'text-blue-700'}`}>
                    <span className="inline-block align-middle rounded-full overflow-hidden m-2">
                      <img src={chatbot} alt="Bot Profile" style={{ height: '1.9em', width: '1.9em' }} />
                    </span>
                    {message.isError ? 'Error' : 'Elect-O-Mate'}
                  </p>
                  <p className="text-gray-600 bg-blue-100 p-2 rounded-md">{message.text} </p>
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
