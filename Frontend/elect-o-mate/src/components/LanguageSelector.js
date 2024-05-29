import React, { useState, useEffect, useRef } from 'react';
import LanguageIcon from '@mui/icons-material/Translate';
import ReactCountryFlag from 'react-country-flag';
import options from '../data/languages.json';
import i18n from '../i18n';

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

  return (
    <div className='m-2 relative'>
      <button
        ref={buttonRef}
        className='flex items-center hover:scale-125 transition-transform duration-200 absolute right-4 top-4 flex-grow border-white'
        onClick={() => setDropdownVisible(!dropdownVisible)}
      >
        <ReactCountryFlag
          countryCode={i18n.language.slice(0, 2).toUpperCase()}
          svg
          style={{
            width: '30px',
            height: '30px',
          }}
        />
      </button>
      {dropdownVisible && (
        <div
          ref={dropdownRef}
          className='absolute right-0 mt-16 p-2 text-white border rounded shadow-lg z-20 max-h-96 overflow-y-auto whitespace-nowrap bg-black bg-opacity-70 backdrop-blur-sm'
          style={{ minWidth: 'fit-content' }}
        >
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleLanguageChange(option.value)}
              className='flex items-center w-full text-left hover:bg-gray-200 hover:text-black cursor-pointer px-[12px] py-3 md:py-1'
            >
              <ReactCountryFlag
                countryCode={option.countryCode}
                svg
                style={{
                  width: '32px',
                  height: '32px',
                  marginRight: '12px',
                }}
                title={option.label}
              />
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default LanguageSelector;
