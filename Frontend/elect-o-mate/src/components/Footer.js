import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaSquareXTwitter } from "react-icons/fa6";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  TelegramShareButton,
  EmailShareButton,
  RedditShareButton,
  FacebookIconWhite,
  LinkedinIcon,
  WhatsappIcon,
  TelegramIcon,
  EmailIcon,
  RedditIcon,
} from 'react-share';


import { ImFacebook2 } from "react-icons/im";
import { ImLinkedin } from "react-icons/im";
import { FaSquareGithub } from "react-icons/fa6";
import { FaSquareReddit } from "react-icons/fa6";



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
              className='transition-transform ease-in-out transform hover:scale-125 text-white'
            >
              <ImFacebook2 size={32} className='text-white' />
            </FacebookShareButton>
            <TwitterShareButton
              url={url}
              title={title}
              className='transition-transform ease-in-out transform hover:scale-125'
            >
              <FaSquareXTwitter size={32} />
            </TwitterShareButton>
            <LinkedinShareButton
              url={url}
              title={title}
              className='transition-transform ease-in-out transform hover:scale-125'
            >
              <ImLinkedin size={32} />
            </LinkedinShareButton>
            {/* <WhatsappShareButton
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
            </EmailShareButton> */}
            <RedditShareButton
              url={url}
              title={title}
              className='transition-transform ease-in-out transform hover:scale-125'
            >
              <FaSquareReddit size={32} round />
            </RedditShareButton>
            <a
              href='https://github.com/elect-o-mate' // Replace with the actual GitHub URL
              className=' '
              target='_blank'
              rel='noopener noreferrer'
            >
              <FaSquareGithub size={32} />
            </a>
          </div>
        </section>
        <section className='mb-8'>
          <p>{t('made_with_love')}</p>
        </section>
      </div>
     
      <div className='bg-black text-center pb-3'>
         <a className='text-white ml-2' 
        href='mailto:contact@elect-o-mate.eu'>contact@elect-o-mate.eu</a> 

         <span className='mx-6'> 
        </span> 
        
        <a className='text-white' 
           href='https://elect-o-mate.eu/'>
            Elect-O-Mate</a>

            
            <span className='mx-6'>
            </span> 

        Last updated 03.09.2024 
        
            </div>
    </footer>
  );

}