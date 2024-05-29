import React from 'react';
import parse from 'html-react-parser';
import 'tailwindcss/tailwind.css';

const convertTextToLinks = (text) => {
  const urlRegex =
    /(\b(?:https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi;
  let linkCounter = 0;

  // Replace all occurrences of escaped double quotes with regular double quotes
  const formattedText = text
    .replace(/\\n/g, '\n') // Replace double backslashes with single newline
    .replace(/\\"/g, '"') // Replace escaped double quotes
    .split(urlRegex) // Split based on URL regex
    .map((part, index) => {
      if (urlRegex.test(part)) {
        linkCounter++;
        return `<a key="${index}" href="${part}" target='_blank' rel='noopener noreferrer' class='text-blue-500 hover:underline'>${linkCounter}</a>`;
      } else {
        return part.replace(/\n/g, '<br />');
      }
    })
    .join('');

  return parse(formattedText);
};

const TextWithLineBreaks = ({ text }) => {
  const formattedText = convertTextToLinks(text);
  return <div>{formattedText}</div>;
};

export default TextWithLineBreaks;
