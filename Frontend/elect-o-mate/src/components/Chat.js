import React, { useState, useRef, useEffect } from 'react';

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
    <div className="p-4">
      <form onSubmit={handleSubmit}>
        <label htmlFor="input-field" className="block text-gray-700 text-sm font-bold mb-2">
          Enter Text:
        </label>
        <input
          id="input-field"
          type="text"
          value={inputValue}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        <button type="submit" className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Send
        </button>
      </form>
    </div>
  );
};

const ChatWindow = ({ messages }) => {
  const chatWindowRef = useRef(null);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="overflow-y-auto h-64 border border-gray-300 p-4" ref={chatWindowRef}>
      {messages.map((message, index) => (
        <div key={index} className="mb-2">
          {message.isUser ? (
            <div>
              <p className="700" style={{ fontWeight: 'bold' }}>You</p>
              <p className="text-gray-600">{message.text}</p>
            </div>
          
          ) : (
            <div>
              <p className="text-blue-700" style={{ fontWeight: 'bold' }}>Elect-O-Mate</p>
              <p className="text-gray-600">{message.text}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const Chat = () => {
  const [messages, setMessages] = useState([]);

  const handleSendMessage = (text) => {
    setMessages([...messages, { text, isUser: true }]);
    // Hier könntest du die Antwort des Bots erhalten und sie dem Chat hinzufügen
  };

  return (
    <div>
      <ChatWindow messages={messages} />
      <TextInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default Chat;
