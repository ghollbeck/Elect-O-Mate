// BackgroundCircle.jsx
import React from 'react';

const BackgroundCircle = () => {
  return (
    <div
      className='absolute top-[-500px] right-[-500px] w-[1600px] h-[1600px] rounded-full z-0'
      style={{
        backgroundImage:
          'linear-gradient(to top right, rgba(248, 229, 127, 0.8), rgba(222, 68, 8, 0.5))',
      }}
    />
  );
};

export default BackgroundCircle;
