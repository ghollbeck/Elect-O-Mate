import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios'; // Importiere axios für HTTP-Anfragen
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';

const TextInput = ({ onSendMessage }) => {
  const [inputValue, setInputValue] = useState('');

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (inputValue.trim() !== '') {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  return (
    <div className="w-full m-0 p-0">
      <form onSubmit={handleSubmit} className="flex items-center w-full">
        <div className="flex w-full">
          <input
            id="input-field"
            placeholder="Enter a question ..."
            type="text"
            value={inputValue}
            onChange={handleChange}
            className="shadow appearance-none border rounded-l w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
         
          <Button type="submit" variant="contained" endIcon={<SendIcon />}>
        Send
      </Button>
        </div>
      </form>
    </div>
  );
};

const Chat = () => {
  const [messages, setMessages] = useState([]);

  const handleSendMessage = async (text) => {
    // Hinzufügen der Nachricht des Benutzers zum Chat
    setMessages(prevMessages => [...prevMessages, { text, isUser: true }]);
    
    try {
      // API-Anfrage durchführen
      const response = await axios.post('http://localhost:8000/openai/invoke', { input: text });
      console.log(response.data)

      // Antwort der API zum Chat hinzufügen
      setMessages(prevMessages => [...prevMessages, { text: response.data.output, isUser: false }]);
    } catch (error) {
      // Fehlermeldung zum Chat hinzufügen
      console.log(error)
      setMessages(prevMessages => [...prevMessages, { text: 'An error occurred. Please try again.', isUser: false, isError: true }]);
    }
  };

  return (
    <div>
      <ChatWindow messages={messages} onSendMessage={handleSendMessage} />
    </div>
  );
};

const ChatWindow = ({ messages, onSendMessage }) => {
  const chatWindowRef = useRef(null);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="bg-white overflow-y-auto border shadow-xl border-gray-300 rounded-lg flex flex-col justify-between" style={{ height: '700px' }} ref={chatWindowRef}>
      <div className='p-4'>
        <div className="mb-2 flex-grow">
          {messages.map((message, index) => (
            <div key={index} className={`mb-2 ${message.isUser ? 'text-right' : 'text-left'}`}>
              {message.isUser ? (
                <div className="flex flex-col items-end">
                  <p className="font-bold text-gray-700">You</p>
                  <p className="text-gray-600 bg-gray-200 p-2 rounded-md">{message.text}</p>
                </div>
              ) : (
                <div className="flex flex-col items-start">
                  <p className={`font-bold ${message.isError ? 'text-red-700' : 'text-blue-700'}`}>
                    {message.isError ? 'Error' : 'Elect-O-Mate'}
                  </p>
                  <p className="text-gray-600 bg-blue-100 p-2 rounded-md">{message.text}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className='w-full'>
        <TextInput onSendMessage={onSendMessage} />
      </div>
    </div>
  );
};

export default Chat;
