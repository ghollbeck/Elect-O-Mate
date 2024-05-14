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
    <form onSubmit={handleSubmit} className="flex items-center">
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

const ChatWindow = ({ messages }) => {
  const chatWindowRef = useRef(null);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="overflow-y-auto h-64 border border-gray-300 p-4 rounded-lg" ref={chatWindowRef}>
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
