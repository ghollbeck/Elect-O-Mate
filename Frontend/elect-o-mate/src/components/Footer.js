import React from 'react';
import { useTranslation } from 'react-i18next';

export default function App() {
  const { t } = useTranslation();
  return (
    <footer className='bg-black text-center text-white pt-40 -z-10'>
      <div className='container mx-auto'>
        <section className='mb-4'>
          <form action=''>
            <div className='mb-4'>
              <p className='pt-2'>
                <strong>{t('sign_up')}</strong>
              </p>
            </div>
            <div className='flex justify-center items-center'>
              <div className='relative'>
                <input
                  type='email'
                  className='mb-4 p-2 rounded-sm text-gray-800'
                  placeholder={t('email_placeholder')}
                />
              </div>
              <div className='ml-2'>
                <button
                  type='submit'
                  className='mb-4 px-4 py-2 border border-white text-white rounded hover:bg-white hover:text-gray-800 transition duration-300'
                >
                  {t('subscribe_to_newsletter')}
                </button>
              </div>
            </div>
          </form>
        </section>
        <section className='mb-8'>
          <p>{t('made_with_love')}</p>
        </section>
      </div>
      <div className='bg-black text-center pb-3'>
        © 2024 Copyright:
        <a className='text-white ml-2' href='https://elect-o-mate.eu/'>
          Elect-O-Mate
        </a>
      </div>
    </footer>
  );
}
