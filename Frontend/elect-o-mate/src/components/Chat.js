// src/components/TextInput.js
import React, { useState } from 'react';

const TextInput = () => {
  const [inputValue, setInputValue] = useState('');

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  return (
    <div className="p-4">
      <label htmlFor="input-field" className="block text-gray-700 text-sm font-bold mb-2">
        Enter Text:
      </label>
      <input
        id="input-field"
        type="text"
        value={inputValue}
        onChange={handleChange}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      />
      <p className="mt-2 text-gray-600">You entered: {inputValue}</p>
    </div>
  );
};

export default TextInput;
