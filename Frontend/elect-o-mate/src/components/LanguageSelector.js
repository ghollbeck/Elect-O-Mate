import React, { useState, useEffect, useRef } from 'react';
import LanguageIcon from '@mui/icons-material/Translate';
import ReactCountryFlag from 'react-country-flag';
import options from '../data/languages.json';

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
        className='flex items-center px-4 py-4 rounded-full  bg-gradient-to-r from-violet-200 to-pink-200 text-white hover:bg-gradient-to-r hover:from-violet-200 hover:to-pink-200 hover:scale-110 transition-transform duration-200 absolute right-0 top-0'
        onClick={() => setDropdownVisible(!dropdownVisible)}
      >
        <LanguageIcon className='w-6 h-6' />
      </button>
      {dropdownVisible && (
        <div
          ref={dropdownRef}
          className='absolute right-0 mt-16 p-2 bg-white border rounded shadow-lg z-20 max-h-96 overflow-y-auto whitespace-nowrap'
          style={{ minWidth: 'fit-content' }}
        >
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleLanguageChange(option.value)}
              className='flex items-center w-full text-left hover:bg-gray-200 cursor-pointer'
            >
              <ReactCountryFlag
                countryCode={option.countryCode}
                svg
                style={{
                  width: '24px',
                  height: '24px',
                  marginRight: '8px',
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
