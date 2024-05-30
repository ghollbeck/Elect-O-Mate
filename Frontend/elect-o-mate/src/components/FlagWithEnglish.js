import React from 'react';
import ReactCountryFlag from 'react-country-flag';

const FlagWithEnglish = ({ countryCode }) => {
  return (
    <div
      className='mr-3 h-auto'
      style={{
        position: 'relative',
        display: 'inline-block',
        width: '2em',
      }}
    >
      <div
        style={{
          bottom: 0,
          right: 0,
        }}
      >
        <ReactCountryFlag
          countryCode={countryCode}
          svg
          style={{ width: '100%', height: 'auto', borderRadius: '5px' }}
        />
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: '100%',
          height: '100%',
          clipPath: 'polygon(0 100%, 100% 0, 100% 100%)',
        }}
      >
        <ReactCountryFlag
          countryCode='GB'
          svg
          style={{
            width: '100%',
            height: 'auto',
            borderRadius: '5px',
          }}
        />
      </div>
    </div>
  );
};

export default FlagWithEnglish;
