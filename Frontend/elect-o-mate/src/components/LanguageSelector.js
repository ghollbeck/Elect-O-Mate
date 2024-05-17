import React, { useState } from 'react';
import LanguageIcon from '@mui/icons-material/Translate';
import ReactCountryFlag from 'react-country-flag';
import options from '../data/languages.json';

function LanguageSelector({ changeLanguage }) {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  return (
    <div className="m-2 relative">
      <button
        className="flex items-center px-4 py-4 rounded-full bg-blue-500 text-white hover:bg-blue-700"
        onClick={() => setDropdownVisible(!dropdownVisible)}
      >
        <LanguageIcon className="w-6 h-6" />
      </button>
      {dropdownVisible && (
        <div className="absolute mt-2 w-32 bg-white border-none bg-transparent rounded shadow-lg z-20">
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
                  marginRight: '8px'
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
