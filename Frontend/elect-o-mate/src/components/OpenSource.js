import React from 'react';
import { useTranslation } from 'react-i18next';

const OpenSourceSection = () => {
  const { t } = useTranslation();
  return (
    <section className='bg-transparent text-black pt-10 z-0'>
      <div className='container mx-auto px-4'>
        <h2 className='text-4xl font-bold mb-6'>{t('open_source')}</h2>

        <p className='mb-6'>{t('open_source_p1')}</p>
        <ul className='list-disc list-inside mb-6'>
          <li className='mb-2'>
            <strong>{t('transparency')}</strong>
            {t('transparency_content')}
          </li>
          <li className='mb-2'>
            <strong>{t('accuracy')}</strong>
            {t('accuracy_content')}
          </li>
          <li className='mb-2'>
            <strong>{t('ethics')}</strong>
            {t('ethics_content')}
          </li>
        </ul>
        <p className='mb-6'>{t('open_source_p2')}</p>
        <div className='flex space-x-4'>
          <button
            onClick={() =>
              window.open('https://github.com/ghollbeck/Elect-O-Mate', '_blank')
            }
            className='bg-black transition duration-300 ease-in-out transform hover:scale-110 text-white font-bold py-2 px-4 rounded'
          >
            <i className='fab fa-github'></i> GitHub
          </button>

          {/* <button className='bg-black transition duration-300 ease-in-out transform hover:scale-110 text-white font-bold py-2 px-4 rounded'>
            {t('tech_report')}
          </button> */}
        </div>
      </div>
    </section>
  );
};

export default OpenSourceSection;
