import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios for HTTP requests
import ChatWindow from './ChatWindow';
import { useTranslation } from 'react-i18next';
import TextInput from './TextInput';

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
      const response = await axios.post(
        'https://backend.bruol.me/openai/invoke',
        { input: text }
      );

      // Add API response to chat
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: response.data.output, isUser: false },
      ]);
    } catch (error) {
      // Add error message to chat
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: 'An error occurred. Please try again.',
          isUser: false,
          isError: true,
        },
      ]);
    } finally {
      setIsSending(false); // Reset isSending after API call completes
    }
  };

  return (
    <div className='md:mb-[100px]'>
      {' '}
      {/* Add margin-top */}
      <ChatWindow
        messages={messages}
        onSendMessage={handleSendMessage}
        isSending={isSending}
      />
      <TextInput onSendMessage={handleSendMessage} isSending={isSending} />
    </div>
  );
};

export default Chat;
