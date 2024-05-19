import React, { useState } from 'react';
import ChatWindow from './ChatWindow';
import TextInput from './TextInput';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

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
      <ChatWindow
        messages={messages}
        scrollToQuestionnaire={scrollToQuestionnaire}
      />
      {/* Korrekt: messages als Prop übergeben */}
      <TextInput
        onSendMessage={handleSendMessage}
        isSending={isSending}
        scrollToChat={scrolltoChat}
      />
    </div>
  );
};

export default Chat;
