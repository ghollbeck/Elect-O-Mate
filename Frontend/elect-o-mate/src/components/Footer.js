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
            <FacebookShareButton url={url}>
              <FacebookIcon size={32} round />
            </FacebookShareButton>
            <TwitterShareButton url={url} title={title}>
              <FaXTwitter size={32} round />
            </TwitterShareButton>
            <LinkedinShareButton url={url} title={title}>
              <LinkedinIcon size={32} round />
            </LinkedinShareButton>
            <WhatsappShareButton url={url} title={title}>
              <WhatsappIcon size={32} round />
            </WhatsappShareButton>
            <TelegramShareButton url={url} title={title}>
              <TelegramIcon size={32} round />
            </TelegramShareButton>
            <EmailShareButton url={url} subject={title} body={t('email_body')}>
              <EmailIcon size={32} round />
            </EmailShareButton>
            <RedditShareButton url={url} title={title}>
              <RedditIcon size={32} round />
            </RedditShareButton>
          </div>
        </section>
        <section className='mb-8'>
          <p>{t('made_with_love')}</p>
        </section>
      </div>
      <div className='bg-black text-center pb-3'>
        Contact:
        <a className='text-white ml-2' href='mailto:brissanikolaus@gmail.com'>
          brissanikolaus@gmail.com
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
