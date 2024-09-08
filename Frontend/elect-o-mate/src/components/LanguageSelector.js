import React, { useState, useEffect, useRef } from 'react'; // Import necessary React hooks
import ReactCountryFlag from 'react-country-flag'; // Import country flag component
import options from '../data/languages.json'; // Import language options from JSON file
import { useTranslation } from 'react-i18next'; // Import translation hook for internationalization
import FlagWithEnglish from './FlagWithEnglish'; // Import custom flag component for English

function LanguageSelector({ changeLanguage }) {
  const [dropdownVisible, setDropdownVisible] = useState(false); // State to manage dropdown visibility
  const dropdownRef = useRef(null); // Ref for the dropdown element
  const buttonRef = useRef(null); // Ref for the button element

  // Function to handle clicks outside the dropdown to close it
  const handleClickOutside = (event) => {
    if (
      dropdownRef.current && // Check if dropdown exists
      !dropdownRef.current.contains(event.target) && // Check if click is outside dropdown
      buttonRef.current && // Check if button exists
      !buttonRef.current.contains(event.target) // Check if click is outside button
    ) {
      setDropdownVisible(false); // Close dropdown
    }
  };

  // Effect to add/remove event listener for clicks outside the dropdown
  useEffect(() => {
    if (dropdownVisible) {
      document.addEventListener('click', handleClickOutside); // Add listener if dropdown is visible
    } else {
      document.removeEventListener('click', handleClickOutside); // Remove listener if dropdown is hidden
    }
    return () => {
      document.removeEventListener('click', handleClickOutside); // Cleanup listener on component unmount
    };
  }, [dropdownVisible]);

  // Function to handle language change
  const handleLanguageChange = (value) => {
    setDropdownVisible(false); // Close dropdown after selection
    changeLanguage(value); // Call changeLanguage prop with selected value
  };

  // Function to check if the last two characters of the language code are 'en'
  const isLastTwoCharsEn = (value) => {
    return value.slice(-2) === 'en'; // Return true if last two characters are 'en'
  };

  const { t, i18n } = useTranslation(); // Get translation function and i18n instance

  return (
    <div className='m-2 relative'> {/* Container for the language selector */}
      <div className='absolute top-2 right-2 text-pink-100 flex items-center font-thin'> {/* Language selection button */}
        <p className='mr-2'>{t('choose_country')}</p> {/* Text prompting user to choose a country */}
        <button
          ref={buttonRef} // Attach ref to button
          className='flex items-center hover:scale-125 transition-transform duration-200' // Button styling
          onClick={() => setDropdownVisible(!dropdownVisible)} // Toggle dropdown visibility on click
        >
          {isLastTwoCharsEn(i18n.language) ? ( // Check if current language is English
            <FlagWithEnglish
              countryCode={i18n.language.slice(0, 2).toUpperCase()} // Display English flag
            />
          ) : (
            <ReactCountryFlag
              countryCode={i18n.language.slice(0, 2).toUpperCase()} // Display country flag based on language
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

      {dropdownVisible && ( // Render dropdown if visible
        <div
          ref={dropdownRef} // Attach ref to dropdown
          className='absolute right-0 mt-16 p-2 text-white border rounded-xl shadow-lg z-20 max-h-96 overflow-y-auto whitespace-nowrap bg-black bg-opacity-70 backdrop-blur-sm' // Dropdown styling
          style={{ minWidth: 'fit-content' }} // Ensure dropdown has minimum width
        >
          {options.map((option) => ( // Map through language options
            <button
              key={option.value} // Unique key for each option
              onClick={() => handleLanguageChange(option.value)} // Handle language change on click
              className='flex items-center w-full text-left hover:bg-gray-200 hover:text-black cursor-pointer px-[12px] py-3 md:py-1' // Option button styling
            >
              {isLastTwoCharsEn(option.value) ? ( // Check if option is English
                <FlagWithEnglish countryCode={option.countryCode} /> // Display English flag
              ) : (
                <ReactCountryFlag
                  countryCode={option.countryCode} // Display country flag based on option
                  svg
                  style={{
                    width: '32px',
                    height: 'auto',
                    marginRight: '12px',
                    borderRadius: '5px',
                  }}
                />
              )}

              {option.label} {/* Display language label */}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default LanguageSelector; // Export the LanguageSelector component
