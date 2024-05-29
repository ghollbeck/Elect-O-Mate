import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import './index.css';
import Footer from './components/Footer';
import Chat from './components/Chat';
import Top from './components/Top';
import OpenSource from './components/OpenSource';
import Spline from './components/Spline';
import Questionnaire from './components/Questionnaire';
import LanguageSelector from './components/LanguageSelector';
import './i18n';
import OrangeCircle from './components/OrangeCircle';
import HorizontalBarChart from './components/HorizontalBarChart';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';

function App() {
  const [party, setParty] = useState(null);
  const [data, setData] = useState(null);
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState([
    { text: t('bot_greeting'), isUser: false },
  ]);
  const [isSending, setIsSending] = useState(false);
  const toChat = useRef(null);
  const toQuestionnaire = useRef(null);
  const toResult = useRef(null);

  const questionnaireAnswers = (data, abortController) => {
    const lang = getLanguageNameByCode(i18n.language);
    const result = data;
    console.warn(lang);
    setData(data);
    const instructions =
      'This is my matching with the parties. The first number is the percentage of alignment, the second string is the name of the party. Please list the 10 parties I match best in this format: party (percentage%) new line. If I have any other questions regarding the results, please provide them based on these results. ANSWER in ' +
      lang +
      '. Please add a note, that a graph listing the matching can be found when scrolling down where the user can click on a bar to find more information about the respective party and their positions can be seen back on the question cards. Offer them further assistance. DO NOT LIST ANY SOURCES!!';
    const resultString = JSON.stringify(result);
    const str = instructions + resultString;
    sendMessageToAPI(str, abortController);
  };

  const formatMessage = (question, message) => {
    if (question !== '') {
      const fmessage = `The last question was ${question} answer this message from the user ${message} Please answer in the same language as the message, or the message before.`;
      return fmessage;
    }
    return message;
  };

  const alter = (q, text) => {
    setMessages((prevMessages) => [...prevMessages, { text, isUser: true }]);
    return formatMessage(q, text);
  };

  const handleSendMessage = async (question, text, abortController) => {
    if (question !== '') {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: question, isUser: true },
      ]);

      text = alter(question, text);
    } else {
      setMessages((prevMessages) => [...prevMessages, { text, isUser: true }]);
    }

    sendMessageToAPI(text, abortController);
  };

  const InformationRequest = async (party, abortController) => {
    setParty(party);
    const text = t('informationRequest') + ' ' + party;
    handleSendMessage('', text, abortController);
    scrollToChat();
  };

  const sendMessageToAPI = async (text, abortController) => {
    setIsSending(true);

    try {
      // Perform API request with streaming using Fetch API and AbortController
      const response = await fetch(
        // process.env.REACT_APP_BACKEND_URL + '/openai/stream',
        'http://10.5.189.107:8000/openai/stream',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ input: text }),
          signal: abortController.signal,
        }
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Use TextDecoderStream to decode the response stream
      const reader = response.body
        .pipeThrough(new TextDecoderStream())
        .getReader();

      // Process the streaming response
      let buffer = '';

      // Add an initial bot message to update
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: '', isUser: false },
      ]);

      // Define a variable to hold the ongoing content
      let ongoingContent = '';
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += value;

        // Split buffer by newlines to process individual events
        let lines = buffer.split('\n');
        buffer = lines.pop(); // Save the last line as it might be incomplete

        let content = '';
        for (let line of lines) {
          if (line.startsWith('data: ')) {
            const t = line.slice(6).trim().slice(1, -1);
            if (!t.startsWith('"run_id":')) {
              content += line.slice(6).trim().slice(1, -1); // Remove 'data: ' prefix and trim whitespace
            }
          }
        }

        if (content) {
          // Append streamed response to the ongoing content
          ongoingContent += content;

          // Update the last message with the new ongoing content
          setMessages((prevMessages) => {
            const lastMessage = prevMessages[prevMessages.length - 1];
            if (lastMessage && !lastMessage.isUser) {
              // If the last message is not a user message, append to it
              return [
                ...prevMessages.slice(0, -1),
                { ...lastMessage, text: ongoingContent },
              ];
            } else {
              // Otherwise, add a new bot message
              return [...prevMessages, { text: ongoingContent, isUser: false }];
            }
          });
        }
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        // Handle fetch abortion if needed
      } else {
        // Add error message to chat
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: 'An error occurred. Please try again.',
            isUser: false,
            isError: true,
          },
        ]);
      }
    } finally {
      setIsSending(false); // Reset isSending after API call completes
    }
  };

  // Use this function to scroll smoothly to a target element
  const smoothScrollTo = (ref, duration) => {
    const targetPosition = ref.current.offsetTop;
    const viewportHeight = window.innerHeight;
    const targetCenterPosition =
      targetPosition - viewportHeight / 2 + ref.current.offsetHeight / 2;
    const startPosition = window.pageYOffset;
    const distance = targetCenterPosition - startPosition;
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

  const scrollToResult = () => {
    smoothScrollTo(toResult, 1000);
  };

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  function getLanguageNameByCode(languageCode) {
    languageCode = languageCode.slice(-2);
    const languageNameMap = {
      de: 'German',
      nl: 'Dutch',
      bg: 'Bulgarian',
      el: 'Greek',
      cs: 'Czech',
      da: 'Danish',
      et: 'Estonian',
      es: 'Spanish',
      fi: 'Finnish',
      fr: 'French',
      hr: 'Croatian',
      hu: 'Hungarian',
      en: 'English',
      it: 'Italian',
      lt: 'Lithuanian',
      lv: 'Latvian',
      pl: 'Polish',
      pt: 'Portuguese',
      ro: 'Romanian',
      sv: 'Swedish',
      sl: 'Slovenian',
      sk: 'Slovak',
    };

    // Return the language name corresponding to the language code
    return languageNameMap[languageCode] || 'English';
  }

  const getUserLanguageFromIP = useCallback(async () => {
    const countryLanguageMap = {
      AT: 'atde', // Austria - German
      BE: 'benl', // Belgium - Dutch
      BG: 'bgbg', // Bulgaria - Bulgarian
      CH: 'dede',
      CY: 'cyel', // Cyprus - Greek
      CZ: 'czcs', // Czech Republic - Czech
      DE: 'dede', // Germany - German
      DK: 'dkda', // Denmark - Danish
      EE: 'eeet', // Estonia - Estonian
      ES: 'eses', // Spain - Spanish
      FI: 'fifi', // Finland - Finnish
      FR: 'frfr', // France - French
      GR: 'elel', // Greece - Greek
      HR: 'hrhr', // Croatia - Croatian
      HU: 'huhu', // Hungary - Hungarian
      IE: 'ieen', // Ireland - English
      IT: 'itit', // Italy - Italian
      LT: 'ltlt', // Lithuania - Lithuanian
      LU: 'lufr', // Luxembourg - French
      LV: 'lvlv', // Latvia - Latvian
      MT: 'mten', // Malta - English
      NL: 'nlnl', // Netherlands - Dutch
      PL: 'plpl', // Poland - Polish
      PT: 'ptpt', // Portugal - Portuguese
      RO: 'roro', // Romania - Romanian
      SE: 'sesv', // Sweden - Swedish
      SI: 'sisl', // Slovenia - Slovenian
      SK: 'sksk', // Slovakia - Slovak
    };

    try {
      const response = await fetch('https://ipinfo.io/json');
      const data = await response.json();
      const countryCode = data.country;
      return countryLanguageMap[countryCode] || 'en'; // Default to English if country not found
    } catch (error) {
      return 'deen'; // Default to English in case of error
    }
  }, []);

  useEffect(() => {
    const fetchUserLanguageAndSetLanguage = async () => {
      try {
        // const userLanguage = await getUserLanguageFromIP();
        // i18n.changeLanguage(userLanguage);
      } catch (error) {
        i18n.changeLanguage('deen');
      }
    };

    fetchUserLanguageAndSetLanguage();
  }, [i18n, getUserLanguageFromIP]); // Include i18n in the dependency array`

  const [isPopupOpen, setIsPopupOpen] = useState(true);

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  return (
    <div
      className='flex flex-col relative overflow-hidden bg-gray-800'
      //style={{ backgroundImage: 'radial-gradient(#F0FFFF, #c8c5c9)' }}
    >
      <OrangeCircle />
      <div className='flex justify-end z-20'>
        <LanguageSelector changeLanguage={changeLanguage} />
      </div>
      <div className='flex flex-col items-center mt-20 pt-0 md:pt-20 mb-0 md:pb-10 w-full z-10'>
        <div className='w-full md:w-1/2 z-10 pt-0 md:pt-25'>
          <Top onButtonClick={scrollToQuestionnaire} />
        </div>
        <div className='w-30px h-30px'>
          <Spline />
        </div>
      </div>
      <div ref={toQuestionnaire} className='relative mb-10 z-10 mt-64'>
        <Questionnaire
          scrollToChat={scrollToChat}
          handleSendMessage={handleSendMessage}
          scrollToQuestionnaire={scrollToQuestionnaire}
          isSending={isSending}
          smoothScrollTo={smoothScrollTo}
          setIsSending={setIsSending}
          questionnaireAnswers={questionnaireAnswers}
          scrollToResult={scrollToResult}
          party={party}
          country={i18n.language.slice(0, 2)}
        />
      </div>
      <div ref={toChat} className='flex justify-center relative mt-64'>
        <div className='w-full mx-2 md:w-1/2 '>
          <Chat
            scrollToQuestionnaire={scrollToQuestionnaire}
            scrolltoChat={scrollToChat}
            messages={messages}
            handleSendMessage={handleSendMessage}
            isSending={isSending}
            setIsSending={setIsSending}
          />
        </div>
      </div>
      <div ref={toResult} className='flex justify-center mt-24'>
        {data !== null ? (
          <div className='w-full h-auto mx-2 md:w-2/3 relative'>
            {isPopupOpen ? (
              <>
                <CloseIcon
                  onClick={togglePopup}
                  className='absolute top-0 right-0 m-2 text-white scale-110  z-10'
                />
                <div className='absolute inset-0 bg-gray-700/90 rounded-xl flex items-center justify-center text-white'>
                  <div className='flex flex-col  p-4 w-full h-full'>
                    <div className='flex-shrink-0 flex items-center'>
                      {t('how_graph_works_info')}
                    </div>
                    <div className='flex-grow flex flex-col items-center text-center justify-center p-20'>
                      <h1 className=' text-xl font-bold m-5'>
                        {t('how_graph_works_title')}
                      </h1>
                      <p>{t('how_graph_works_content')}</p>
                    </div>
                  </div>
                </div>
                <HorizontalBarChart
                  data={data}
                  InformationRequest={InformationRequest}
                  setParty={setParty}
                />
              </>
            ) : (
              <>
                <InfoIcon
                  onClick={togglePopup}
                  className='absolute top-0 right-0 m-2 text-white scale-110'
                />

                <HorizontalBarChart
                  data={data}
                  InformationRequest={InformationRequest}
                  setParty={setParty}
                />
              </>
            )}
          </div>
        ) : (
          ''
        )}
      </div>

      <div className='relative mt-72'>
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
