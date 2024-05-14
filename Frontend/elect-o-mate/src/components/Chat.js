import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios'; // Importiere axios für HTTP-Anfragen

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
            placeholder="Enter a question..."
            type="text"
            value={inputValue}
            onChange={handleChange}
            className="shadow appearance-none border rounded-l w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r focus:outline-none focus:shadow-outline">
            Send
          </button>
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
      const response = await axios.post('https://backend.bruol.me/openai/invoke?config_hash=', { prompt: text });

      // Antwort der API zum Chat hinzufügen
      setMessages(prevMessages => [...prevMessages, { text: response.data, isUser: false }]);
    } catch (error) {
      // Fehlermeldung zum Chat hinzufügen
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
    <div className="overflow-y-auto h-80 border shadow-xl border-gray-300 rounded-lg flex flex-col justify-between" ref={chatWindowRef}>
      <div className='p-4'>
        <div className="mb-2 flex-grow">
          {messages.map((message, index) => (
            <div key={index} className="mb-2">
              {message.isUser ? (
                <div>
                  <p className="font-bold text-gray-700">You</p>
                  <p className="text-gray-600">{message.text}</p>
                </div>
              ) : (
                <div>
                  <p className={`font-bold ${message.isError ? 'text-red-700' : 'text-blue-700'}`}>
                    {message.isError ? 'Error' : 'Elect-O-Mate'}
                  </p>
                  <p className="text-gray-600">{message.text}</p>
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
