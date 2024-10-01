import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useLocation,
} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './index.css';
import Footer from './components/Footer';
import Chat from './components/Chat';
import Top from './components/Top';
import OpenSource from './components/OpenSource';
import Questionnaire from './components/Questionnaire';
import LanguageSelector from './components/LanguageSelector';
import './i18n';
import HorizontalBarChart from './components/HorizontalBarChart';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import { initGA, logPageView } from './analytics';
import Cookies from 'js-cookie';
import langs from './data/languages.json';
import { FaArrowLeft } from 'react-icons/fa'; // Import the back arrow icon from react-icons


import LandingPage from './components/LandingPage/LandingPage';


function App() {
  const { t, i18n } = useTranslation();
  const [init, setInit] = useState(false);
  const toHowItWorks = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!init) {
        setInit(true);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Clean up the event listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [init]);

  useEffect(() => {
    var savedLanguage = Cookies.get('languageApp');

    if (savedLanguage) {
      if (!isValidLang(savedLanguage)) {
        savedLanguage = 'deen';
      }
    }

    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage.toLowerCase());
    } else {
      Cookies.set('languageApp', i18n.language.toLowerCase(), { expires: 7 });
    }
  }, [i18n]);

  useEffect(() => {
    Cookies.set('languageApp', i18n.language.toLowerCase(), { expires: 7 });
  }, [i18n.language]);

  const [party, setParty] = useState(null);
  const [data, setData] = useState(null);

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
    setData(data);
    const instructions =
      'This is my matching with the parties. The first number is the percentage of alignment, the second string is the name of the party. Please list the 10 parties I match best in this format: party (percentage%) new line. If I have any other questions regarding the results, please provide them based on these results. ANSWER in ' +
      lang +
      '. Please add a note, that a graph listing the matching can be found when scrolling down where the user can click on a bar to find more information about the respective party and their positions can be seen back on the question cards. Offer them further assistance. DO NOT LIST ANY SOURCES!!';
    const resultString = JSON.stringify(result);
    const str = instructions + resultString;
    sendMessageToAPI(str, abortController);
  };

  useEffect(() => {
    initGA();
    logPageView();
    window.addEventListener('popstate', logPageView);
  }, []);

  const formatMessage = (question, message) => {
    if (question !== '') {
      const fmessage = `This is the statement I have a question to: ${question}. The question is: ${message} Please answer in the same language as the message, or the message before.`;
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

      text = alter(question, text, messages);
    } else {
      setMessages((prevMessages) => [...prevMessages, { text, isUser: true }]);
    }

    sendMessageToAPI(text, abortController);
  };

  const InformationRequest = async (party, partyName, abortController) => {
    setParty(party);
    ////console.warn(party);
    const text = partyName;
    handleSendMessage('', text, abortController);
    scrollToChat();
  };

  const sendMessageToAPI = async (text, abortController) => {
    setIsSending(true);

    const countryCode = i18n.language.slice(0, 2).toUpperCase();
    var languageCode = i18n.language.slice(2, 4).toUpperCase();
    
    if(languageCode != 'EN'){
      languageCode = countryCode;
    }

    try {
      // Perform API request with streaming using Fetch API and AbortController
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL +
          '/' +
          countryCode +
          '/' +
          languageCode +
          '/stream',
        //'http://10.5.187.62:8000/openai/stream',
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
            text: 'Sorry, the chat feature is currently under testing & improvement, we will bring it back very soon!',
            isUser: false,
            isError: true,
          },
        ]);
      }
    } finally {
      setIsSending(false); // Reset isSending after API call completes
    }
  };

  function isValidLang(string) {
    const languageCodes = [
      'atde', // Austria - German
      'benl', // Belgium - Dutch
      'bgbg', // Bulgaria - Bulgarian
      'czcs', // Czech Republic - Czech
      'dkda', // Denmark - Danish
      'eeet', // Estonia - Estonian
      'eses', // Spain - Spanish
      'fifi', // Finland - Finnish
      'frfr', // France - French
      'elel', // Greece - Greek
      'hrhr', // Croatia - Croatian
      'huhu', // Hungary - Hungarian
      'ieen', // Ireland - English
      'itit', // Italy - Italian
      'ltlt', // Lithuania - Lithuanian
      'lvlv', // Latvia - Latvian
      'lufr', // Luxembourg - French
      'mten', // Malta - Englishx
      'nlnl', // Netherlands - Dutch
      'plpl', // Poland - Polish
      'ptpt', // Portugal - Portuguese
      'roro', // Romania - Romanian
      'sesv', // Sweden - Swedish
      'sisl', // Slovenia - Slovenian
      'sksk', // Slovakia - Slovak
    ];
    return languageCodes.includes(string);
  }

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

  const scrollToChatslow = () => {
    smoothScrollTo(toChat, 2000);
  };

  const scrollToResult = () => {
    smoothScrollTo(toResult, 1000);
  };

  useEffect(() => {
    setQuestionnaireKey((prevKey) => prevKey + 1);
  }, [i18n.language]);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setInit(false);
    setMessages((prevMessages) => {
      // Update only the first message
      const updatedMessages = [...prevMessages];
      updatedMessages[0] = { ...updatedMessages[0], text: t('bot_greeting') };
      return updatedMessages;
    });
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
    //console.warn('IP');
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
      GH: 'ghgh', // Ghana - Ghanaese
    };

    function isCountryPresent(countryCode) {
      return langs.some((country) => country.countryCode === countryCode);
    }

    try {
      const response = await fetch('https://ipinfo.io/json');
      const data = await response.json();
      const countryCode = data.country;
      if (countryCode && isCountryPresent(countryCode)) {
        return countryLanguageMap[countryCode] || 'en'; // Default to English if country not found
      }
    } catch (error) {
      return 'deen'; // Default to English in case of error
    }
  }, []);

  /*  useEffect(() => {
    const fetchUserLanguageAndSetLanguage = async () => {
      try {
        const userLanguage = await getUserLanguageFromIP(); // Ensure getUserLanguageFromIP is called
        i18n.changeLanguage(userLanguage);
      } catch (error) {
        //console.warn('error, could not find userlanguage.');
        i18n.changeLanguage('deen');
      }
    };

    fetchUserLanguageAndSetLanguage();
  }, [i18n]); */

  useEffect(() => {
    const checkAndSetLanguage = async () => {
      var savedLanguage = Cookies.get('languageApp');

      if (savedLanguage) {
        if (!isValidLang(savedLanguage)) {
          savedLanguage = 'deen';
        }
      }

      if (savedLanguage) {
        i18n.changeLanguage(savedLanguage.toLowerCase());
      } else {
        const userLanguage = await getUserLanguageFromIP();
        i18n.changeLanguage(userLanguage.toLowerCase());
        Cookies.set('languageApp', userLanguage.toLowerCase(), { expires: 7 });
      }
    };

    checkAndSetLanguage();
  }, [i18n]);
  // Include i18n in the dependency array`

  const [isPopupOpen, setIsPopupOpen] = useState(true);

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };



  const [questionnaireKey, setQuestionnaireKey] = useState(0);








// ------- HERE the SETSCREEN Fucntions start ----------


const [currentScreen, setCurrentScreen] = useState('newScreen');

const setScreen = (screen) => {
  setCurrentScreen(screen);
};

useEffect(() => {
  if (currentScreen === 'main') {
    window.scrollTo(0, 0);
  }
}, [currentScreen]);


// ------- UNTIL HERE ----------




return (
  <Router>
    <usePageViews />
    {currentScreen === 'newScreen' ? (
  <LandingPage onButtonClick={() => setScreen('main')} changeLanguage={changeLanguage} />
) : (






      <div className='flex flex-col relative overflow-hidden bg-black '>
        <button
          onClick={() => setScreen('newScreen')}
          className='absolute top-4 left-4 border-[1px] border-[rgb(128,128,128)] text-[rgb(128,128,128)] px-4 py-1 rounded-3xl md:text-base text-xs flex items-center hover:border-[rgb(228,228,228)] hover:text-[rgb(228,228,228)] transition-transform duration-200 transform hover:scale-105'
      >
          <FaArrowLeft className='mr-2' /> {/* Back arrow icon */}
          Back Home
      </button>
        <LanguageSelector changeLanguage={changeLanguage} />

        {/* Existing main screen content */}
        <div className='flex flex-col items-center mt-20 pt-0 md:pt-20 mb-0 md:pb-10 w-full z-10'>
          <div className='w-full md:w-2/3 z-10 pt-0 md:pt-25 flex justify-center'>
            <Top
              onButtonClick={scrollToQuestionnaire}
              handleSendMessage={handleSendMessage}
              isSending={isSending}
              scrollToChat={scrollToChatslow}
              setIsSending={setIsSending}
            />
          </div>
        </div>

        <div ref={toQuestionnaire} className='relative mb-10 z-10 mt-64'>
          <Questionnaire
            key={questionnaireKey}
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
            init={init}
          />
        </div>
        <div ref={toChat} className='flex justify-center relative mt-64'>
          <div className='w-full mx-2 lg:w-1/2 '>
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
                    className='absolute top-0 right-0 m-2 text-black scale-125 border-2 border-black rounded-full   z-10 cursor-pointer'
                  />
                  <div
                    onClick={togglePopup}
                    className='absolute inset-0  bg-gradient-to-r from-violet-200 to-pink-200  rounded-xl flex items-center justify-center text-black'
                  >
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
                    className='absolute top-0 right-0 m-2 text-white scale-125 cursor-pointer'
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
            className='absolute top-0 left-0 w-full  bg-gradient-to-r from-violet-200 to-pink-200 transform skew-y-3 h-100'
            style={{
              height: '110%',
            }}
          />
          <div className='container mx-auto relative z-10 w-full md:w-1/2'>
            <OpenSource />
          </div>
        </div>
        <div className='w-full'>
          <Footer />
        </div>
      </div>
    )}
  </Router>
);


}

export default App;
