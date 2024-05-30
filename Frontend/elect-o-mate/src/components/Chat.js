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
    <div className=' relative h-[80dvh] rounded-3xl shadow-2xl shadow-gray-500'>
      <div className='absolute inset-0'>
        <ChatWindow
          messages={messages}
          scrollToQuestionnaire={scrollToQuestionnaire}
        />
      </div>
      <div className=' absolute bottom-0 w-full z-10'>
        <TextInput
          handleSendMessage={handleSendMessage}
          isSending={isSending}
          scrollToChat={scrolltoChat}
          setIsSending={setIsSending}
          question=''
        />
      </div>
    </div>
  );
};

export default Chat;
