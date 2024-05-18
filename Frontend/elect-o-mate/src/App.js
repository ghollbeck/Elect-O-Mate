import React, { useRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './index.css';
import axios from 'axios'; // Import axios for HTTP requests
import Footer from './components/Footer';
import Chat from './components/Chat';
import Top from './components/Top';
import OpenSource from './components/OpenSource';
import Spline from './components/Spline';
import Questionnaire from './components/Questionnaire';
import LanguageSelector from './components/LanguageSelector';
import './i18n';
import Logo from './pictures/protologo.png';
import OrangeCircle from './components/OrangeCircle';

function App() {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState([
    { text: t('bot_greeting'), isUser: false },
  ]);
  const [isSending, setIsSending] = useState(false);
  const toChat = useRef(null);
  const [userLanguage, setUserLanguage] = useState('en'); // Default to English

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

  const scrollToChat = () => {
    toChat.current.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  };

  const changeLanguage = (lang) => {
    setUserLanguage(lang);
    i18n.changeLanguage(lang);
  };

  const getUserCountryFromIP = async () => {
    try {
      const response = await fetch('https://ipinfo.io/json');
      const data = await response.json();
      return data.country;
    } catch (error) {
      console.error(
        'Fehler beim Abrufen des Landes aus der IP-Adresse:',
        error
      );
      return null;
    }
  };

  useEffect(() => {
    const fetchUserLocationAndSetLanguage = async () => {
      try {
        const userCountry = await getUserCountryFromIP();
        setUserLanguage(userCountry);
        i18n.changeLanguage(userCountry);
      } catch (error) {
        console.error('Error fetching user location:', error);
        setUserLanguage('en');
        i18n.changeLanguage('en');
      }
    };

    fetchUserLocationAndSetLanguage();
  }, [i18n]);

  return (
    <div
      className='flex flex-col relative overflow-hidden'
      style={{ backgroundImage: 'radial-gradient(#F0FFFF, #030303)' }}
    >
      <OrangeCircle />

      <div className='flex justify-end z-20'>
        <LanguageSelector changeLanguage={changeLanguage} />
      </div>

      {/* <img src={Logo} alt="Logo" className='z-0 size-[600px] absolute top-[100px] left-[100px]'/> */}
      <div className='flex flex-col items-center pt-0 md:pt-20 mb-0 md:pb-10 w-full z-10'>
        <div className='w-full md:w-1/2 z-10 pt-0 md:pt-25'>
          <Top onButtonClick={scrollToChat} />
        </div>
        <div className='w-30px h-30px'>
          <Spline />
        </div>
      </div>

      <div className='relative mb-10 z-10'>
        <Questionnaire
          scrollToChat={scrollToChat}
          onSendMessage={handleSendMessage}
          isSending={isSending}
        />
      </div>

      <div ref={toChat} className='flex justify-center'>
        <div className='w-full mx-2 md:w-1/2 md:my-20'>
          <Chat
            messages={messages}
            handleSendMessage={handleSendMessage}
            isSending={isSending}
          />
        </div>
      </div>

      <div className='relative mt-10'>
        <div
          className='absolute top-0 left-0 w-full bg-gradient-to-r from-[#3D6964] to-[#FDFFFD] transform skew-y-3 h-100'
          style={{ height: '110%' }}
        />
        <div className='container mx-auto relative z-10 w-full md:w-1/2'>
          <OpenSource />
        </div>
      </div>

      <div className='w-full'>
        <Footer />
      </div>
    </div>
  );
}

export default App;
