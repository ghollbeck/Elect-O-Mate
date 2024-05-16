// src/components/LanguageSelector.js
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageIcon from '@mui/icons-material/Translate';

const options = [
  { value: 'en', label: 'English', icon: 'language-icons/icons/en.svg' },
  { value: 'de', label: 'Deutsch', icon: 'language-icons/icons/de.svg' },
  { value: 'es', label: 'Español', icon: 'language-icons/icons/es.svg' },
];

function LanguageSelector() {
  const { i18n } = useTranslation();
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const changeLanguage = (option) => {
    i18n.changeLanguage(option.value);
    setDropdownVisible(false); // Close dropdown after selection
  };

  return (
    <div className="relative z-10">
      <button 
        className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        onClick={() => setDropdownVisible(!dropdownVisible)}
      >
        <LanguageIcon className="w-6 h-6 mr-2" />
        Language
      </button>
      {dropdownVisible && (
        <div className="absolute mt-2 w-32 bg-white border border-gray-300 rounded shadow-lg">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => changeLanguage(option)}
              className="flex items-center p-2 hover:bg-gray-200 cursor-pointer"
            >
              <img src={option.icon} alt={option.label} className="w-6 h-6" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default LanguageSelector;
