import React from 'react';

const ProgressBar = ({ current, total }) => {
  const percentage = (current / total) * 100;
  return (
    <div className='relative h-5'>
      <div className='relative h-full bg-transparent w-full rounded-full border'>
        <div
          className='h-full bg-[#ffde08] rounded-full transition-all duration-300'
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className='absolute top-0 left-0 h-full w-full flex items-center justify-center text-white'>
        Answered: {current}/{total}
      </div>
    </div>
  );
};

export default ProgressBar;
