import React, { useState } from 'react';
import ChatWindow from './ChatWindow';
import TextInput from './TextInput';

const Chat = ({
  scrollToQuestionnaire,
  scrolltoChat,
  messages,
  handleSendMessage,
  isSending,
}) => {
  // Props als Objekt dekonstruieren

  return (
    <div className='md:mb-[100px]'>
      <ChatWindow messages={messages} />{' '}
      {/* Korrekt: messages als Prop übergeben */}
      <TextInput
        onSendMessage={handleSendMessage}
        isSending={isSending}
        scrollToChat={scrolltoChat}
      />
      <button
        className='m-8 py-4 px-9 text-white rounded-full font-semibold transition duration-300 ease-in-out transform hover:scale-110 text-xl absolute right-10 bottom-[135px]'
        style={{
          backgroundImage: 'radial-gradient(circle, #303030, #030303)',
        }}
        onClick={scrollToQuestionnaire}
      >
        Back to Questionnaire
      </button>
    </div>
  );
};

export default Chat;
