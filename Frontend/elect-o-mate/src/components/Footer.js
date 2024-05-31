import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaXTwitter } from 'react-icons/fa6';
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  TelegramShareButton,
  EmailShareButton,
  RedditShareButton,
  FacebookIcon,
  LinkedinIcon,
  WhatsappIcon,
  TelegramIcon,
  EmailIcon,
  RedditIcon,
} from 'react-share';

export default function App() {
  const { t } = useTranslation();
  const url = 'https://elect-o-mate.eu/'; // Your website URL
  const title = 'Check out this website!'; // Title for sharing

  return (
    <footer className='bg-black text-center text-white pt-40 -z-10'>
      <div className='container mx-auto'>
        <section className='mb-4'>
          <div className='flex justify-center items-center space-x-4'>
            <FacebookShareButton
              url={url}
              className='transition-transform ease-in-out transform hover:scale-125'
            >
              <FacebookIcon size={32} round />
            </FacebookShareButton>
            <TwitterShareButton
              url={url}
              title={title}
              className='transition-transform ease-in-out transform hover:scale-125'
            >
              <FaXTwitter size={32} />
            </TwitterShareButton>
            <LinkedinShareButton
              url={url}
              title={title}
              className='transition-transform ease-in-out transform hover:scale-125'
            >
              <LinkedinIcon size={32} round />
            </LinkedinShareButton>
            <WhatsappShareButton
              url={url}
              title={title}
              className='transition-transform ease-in-out transform hover:scale-125'
            >
              <WhatsappIcon size={32} round />
            </WhatsappShareButton>
            <TelegramShareButton
              url={url}
              title={title}
              className='transition-transform ease-in-out transform hover:scale-125'
            >
              <TelegramIcon size={32} round />
            </TelegramShareButton>
            <EmailShareButton
              url={url}
              subject={title}
              body={t('email_body')}
              className='transition-transform ease-in-out transform hover:scale-125'
            >
              <EmailIcon size={32} round />
            </EmailShareButton>
            <RedditShareButton
              url={url}
              title={title}
              className='transition-transform ease-in-out transform hover:scale-125'
            >
              <RedditIcon size={32} round />
            </RedditShareButton>
          </div>
        </section>
        <section className='mb-8'>
          <p>{t('made_with_love')}</p>
        </section>
      </div>
      Imprint:
      <div className='bg-black text-center pb-3'>
        Adress: Clausiusstrasse 16, 8006 Zürich
        <br />
        Contact:
        <a className='text-white ml-2' href='mailto:contact@elect-o-mate.eu'>
          contact@elect-o-mate.eu
        </a>
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
