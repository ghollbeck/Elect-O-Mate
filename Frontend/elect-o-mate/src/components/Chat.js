import React, { useState } from 'react';
import ChatWindow from './ChatWindow';
import TextInput from './TextInput';
import { useTranslation } from 'react-i18next';

const Chat = ({ messages, handleSendMessage, isSending }) => {
  // Props als Objekt dekonstruieren

  return (
    <div className='md:mb-[100px]'>
      <ChatWindow messages={messages} />{' '}
      {/* Korrekt: messages als Prop übergeben */}
      <TextInput onSendMessage={handleSendMessage} isSending={isSending} />
    </div>
  );
};

export default Chat;
