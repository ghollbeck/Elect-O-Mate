// BackgroundCircle.jsx
import React from 'react';

const BackgroundCircle = () => {
  return (
    <div
      className='absolute top-[-200px] right-[-350px] w-[700px] h-[700px] md:top-[-500px] md:right-[-500px] md:w-[1600px] md:h-[1600px] rounded-full z-0'
      style={{
        backgroundImage:
          'linear-gradient(to top right, rgba(248, 229, 127, 0.8), rgba(222, 68, 8, 0.5))',
      }}
    />
  );
};

export default BackgroundCircle;
