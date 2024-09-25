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
    <footer className='bg-black text-center text-white pt-32 -z-10'>
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
              <FaSquareXTwitter size={38} />
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
              <FaSquareReddit size={38} round />
            </RedditShareButton>
            <a
              href='https://github.com/ghollbeck/Elect-O-Mate/tree/main' // Replace with the actual GitHub URL
              className='transition-transform ease-in-out transform hover:scale-125'
              target='_blank'
              rel='noopener noreferrer'
            >
              <FaSquareGithub size={38} />
            </a>
          </div>
        </section>
        <section className='mb-4'>
          <p>Made with love by people from all over the world.

</p>
        </section>
      </div>



      <div className='bg-black text-center pb-3 flex flex-wrap items-center justify-center'>
         <a className='text-white ml-2  text-xs md:text-base' 
        href='mailto:info@electomate.com'> info@electomate.com</a> 

         <span className='mx-2 md:mx-6'> 
        </span> 
        
        <a className='text-white text-xs md:text-base' 
           href='https://elect-o-mate.eu/'>
            Elect-O-Mate</a>

            
            <span className='md:mx-6 mx-2'>
            </span> 

        
        <a className='text-white ml-2  text-xs md:text-base' 
        >Last updated 03.09.2024 </a> 
            </div>
    </footer>
  );

}