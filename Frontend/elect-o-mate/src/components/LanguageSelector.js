import React, { useState } from 'react';
import LanguageIcon from '@mui/icons-material/Translate';

const options = [
  { value: 'en', label: 'English', icon: 'language-icons/icons/en.svg' },
  { value: 'de', label: 'Deutsch', icon: 'language-icons/icons/de.svg' },
];

function LanguageSelector({ changeLanguage }) {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  return (
    <div className="">
      <button 
        className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        onClick={() => setDropdownVisible(!dropdownVisible)}
      >
        <LanguageIcon className="w-6 h-6 mr-2" />
        Language
      </button>
      {dropdownVisible && (
        <div className="absolute mt-2 w-32 bg-white border border-gray-300 bg-transparent rounded shadow-lg z-20">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                setDropdownVisible(false);
                changeLanguage(option.value);
              }}
              className="flex items-center p-2 w-full text-left hover:bg-gray-200 cursor-pointer"
            >
              <img src={option.icon} alt={option.label} className="w-6 h-6 mr-2" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default LanguageSelector;
