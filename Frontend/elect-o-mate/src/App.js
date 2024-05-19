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
import OrangeCircle from './components/OrangeCircle';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

function App() {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState([
    { text: t('bot_greeting'), isUser: false },
  ]);
  const [isSending, setIsSending] = useState(false);
  const toChat = useRef(null);
  const toQuestionnaire = useRef(null);

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

  function smoothScroll(target, duration) {
    const targetPosition = target.offsetTop;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = ease(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function ease(t, b, c, d) {
      // Easing function, for example, easeInOutQuad
      t /= d / 2;
      if (t < 1) return (c / 2) * t * t + b;
      t--;
      return (-c / 2) * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
  }

  // Use this function to scroll smoothly to a target element
  const smoothScrollTo = (ref, duration) => {
    const targetPosition = ref.current.offsetTop;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = ease(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function ease(t, b, c, d) {
      // Easing function, for example, easeInOutQuad
      t /= d / 2;
      if (t < 1) return (c / 2) * t * t + b;
      t--;
      return (-c / 2) * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
  };

  // Update scrollToQuestionnaire and scrollToChat to use smoothScrollTo with references
  const scrollToQuestionnaire = () => {
    smoothScrollTo(toQuestionnaire, 1000);
  };

  const scrollToChat = () => {
    smoothScrollTo(toChat, 1000);
  };

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  const countryLanguageMap = {
    AT: 'de', // Austria - German
    BE: 'nl', // Belgium - Dutch
    BG: 'bg', // Bulgaria - Bulgarian
    CH: 'de',
    CY: 'el', // Cyprus - Greek
    CZ: 'cs', // Czech Republic - Czech
    DE: 'de', // Germany - German
    DK: 'da', // Denmark - Danish
    EE: 'et', // Estonia - Estonian
    ES: 'es', // Spain - Spanish
    FI: 'fi', // Finland - Finnish
    FR: 'fr', // France - French
    GR: 'el', // Greece - Greek
    HR: 'hr', // Croatia - Croatian
    HU: 'hu', // Hungary - Hungarian
    IE: 'en', // Ireland - English
    IT: 'it', // Italy - Italian
    LT: 'lt', // Lithuania - Lithuanian
    LU: 'fr', // Luxembourg - French
    LV: 'lv', // Latvia - Latvian
    MT: 'en', // Malta - English
    NL: 'nl', // Netherlands - Dutch
    PL: 'pl', // Poland - Polish
    PT: 'pt', // Portugal - Portuguese
    RO: 'ro', // Romania - Romanian
    SE: 'sv', // Sweden - Swedish
    SI: 'sl', // Slovenia - Slovenian
    SK: 'sk', // Slovakia - Slovak
  };

  const getUserLanguageFromIP = async () => {
    try {
      const response = await fetch('https://ipinfo.io/json');
      const data = await response.json();
      const countryCode = data.country;
      return countryLanguageMap[countryCode] || 'en'; // Default to English if country not found
    } catch (error) {
      console.error('Error fetching user language:', error);
      return 'en'; // Default to English in case of error
    }
  };

  useEffect(() => {
    const fetchUserLanguageAndSetLanguage = async () => {
      try {
        const userLanguage = await getUserLanguageFromIP();
        i18n.changeLanguage(userLanguage);
      } catch (error) {
        console.error('Error fetching user language:', error);
        i18n.changeLanguage('en');
      }
    };

    fetchUserLanguageAndSetLanguage();
  }, [i18n]); // Include i18n in the dependency array

  return (
    <div
      className='flex flex-col relative overflow-hidden'
      style={{ backgroundImage: 'radial-gradient(#F0FFFF, #030303)' }}
    >
      <OrangeCircle />

      <div className='flex justify-end z-20'>
        <LanguageSelector changeLanguage={changeLanguage} />
      </div>

      <div className='flex flex-col items-center pt-0 md:pt-20 mb-0 md:pb-10 w-full z-10'>
        <div className='w-full md:w-1/2 z-10 pt-0 md:pt-25'>
          <Top onButtonClick={scrollToQuestionnaire} />
        </div>
        <div className='w-30px h-30px'>
          <Spline />
        </div>
      </div>

      <div ref={toQuestionnaire} className='relative mb-10 z-10'>
        <Questionnaire
          scrollToChat={scrollToChat}
          onSendMessage={handleSendMessage}
          scrollToQuestionnaire={scrollToQuestionnaire}
          isSending={isSending}
        />
      </div>

      <div ref={toChat} className='flex justify-center relative'>
        <div className='w-full mx-2 md:w-1/2 mt-20'>
          <Chat
            scrollToQuestionnaire={scrollToQuestionnaire}
            scrolltoChat={scrollToChat}
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
