import React, { useState, useEffect, useRef } from 'react';
import ReactCountryFlag from 'react-country-flag';
import options from '../data/languages.json';
import { useTranslation } from 'react-i18next';
import FlagWithEnglish from './FlagWithEnglish';

function LanguageSelector({ changeLanguage }) {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const handleClickOutside = (event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target) &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target)
    ) {
      setDropdownVisible(false);
    }
  };

  useEffect(() => {
    if (dropdownVisible) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [dropdownVisible]);

  const handleLanguageChange = (value) => {
    setDropdownVisible(false);
    changeLanguage(value);
  };

  const isLastTwoCharsEn = (value) => {
    return value.slice(-2) === 'en';
  };

  const { t, i18n } = useTranslation();

  return (
    <div className='m-2 relative'>
      <div className='absolute top-2 right-2 text-pink-100 flex items-center font-thin'>
        <p className='mr-2'>{t('choose_country')}</p>
        <button
          ref={buttonRef}
          className='flex items-center hover:scale-125 transition-transform duration-200'
          onClick={() => setDropdownVisible(!dropdownVisible)}
        >
          {isLastTwoCharsEn(i18n.language) ? (
            <FlagWithEnglish
              countryCode={i18n.language.slice(0, 2).toUpperCase()}
            />
          ) : (
            <ReactCountryFlag
              countryCode={i18n.language.slice(0, 2).toUpperCase()}
              svg
              style={{
                width: '32px',
                height: 'auto',
                marginRight: '12px',
                borderRadius: '5px',
              }}
            />
          )}
        </button>
      </div>

      {dropdownVisible && (
        <div
          ref={dropdownRef}
          className='absolute right-0 mt-16 p-2 text-white border rounded-xl shadow-lg z-20 max-h-96 overflow-y-auto whitespace-nowrap bg-black bg-opacity-70 backdrop-blur-sm'
          style={{ minWidth: 'fit-content' }}
        >
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleLanguageChange(option.value)}
              className='flex items-center w-full text-left hover:bg-gray-200 hover:text-black cursor-pointer px-[12px] py-3 md:py-1'
            >
              {isLastTwoCharsEn(option.value) ? (
                <FlagWithEnglish countryCode={option.countryCode} />
              ) : (
                <ReactCountryFlag
                  countryCode={option.countryCode}
                  svg
                  style={{
                    width: '32px',
                    height: 'auto',
                    marginRight: '12px',
                    borderRadius: '5px',
                  }}
                />
              )}

              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default LanguageSelector;
