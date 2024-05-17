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

  return (
    <div className="m-2 relative">
      <button
        ref={buttonRef}
        className="flex items-center px-4 py-4 rounded-full bg-blue-500 text-white hover:bg-blue-700 hover:scale-110 transition-transform duration-200"
        onClick={() => setDropdownVisible(!dropdownVisible)}
      >
        <LanguageIcon className="w-6 h-6" />
      </button>
      {dropdownVisible && (
        <div
          ref={dropdownRef}
          className="absolute mt-2 w-32 bg-white border-none bg-transparent rounded shadow-lg z-20 max-h-96 overflow-y-auto"
        >
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                setDropdownVisible(false);
                changeLanguage(option.value);
              }}
              className="flex items-center p-2 w-full text-left hover:bg-gray-200 cursor-pointer"
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
