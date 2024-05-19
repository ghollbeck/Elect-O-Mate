import React, { useState } from 'react';
import ChatWindow from './ChatWindow';
import TextInput from './TextInput';

const Chat = ({
  scrollToQuestionnaire,
  scrolltoChat,
  messages,
  handleSendMessage,
  isSending,
  setIsSending,
}) => {
  // Props als Objekt dekonstruieren

  return (
    <div className=''>
      <ChatWindow
        messages={messages}
        scrollToQuestionnaire={scrollToQuestionnaire}
      />
      {/* Korrekt: messages als Prop übergeben */}
      <TextInput
        handleSendMessage={handleSendMessage}
        isSending={isSending}
        scrollToChat={scrolltoChat}
        setIsSending={setIsSending}
      />
    </div>
  );
};

export default Chat;
