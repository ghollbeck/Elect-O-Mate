import React from 'react';
import GABORPORTRAIT from './../../pictures/Team_Photos/Portrait Gabor.jpeg';

import ANTONIO from './../../pictures/Team_Photos/Antonio.png';
import EUGENIA from './../../pictures/Team_Photos/Eugenia.png';
import JONATHAN from './../../pictures/Team_Photos/Jonathan.png';
import LEO from './../../pictures/Team_Photos/Leo.png';
import LORIN from './../../pictures/Team_Photos/Lorin.png';
import MERCEDES from './../../pictures/Team_Photos/Mercedes.png';
import NIKI from './../../pictures/Team_Photos/Niki.png';
import SIMO from './../../pictures/Team_Photos/Simo.png';
import JISBEL from './../../pictures/Team_Photos/Jisbel.png';

import { FaLinkedin } from 'react-icons/fa'; // Import LinkedIn icon
import { FaSquareGithub } from "react-icons/fa6";
import { FaSquareXTwitter } from "react-icons/fa6";
import { PiLinkFill } from "react-icons/pi";
import { FaExternalLinkSquareAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";


import './Tailwind.css';



import { ImFacebook2 } from "react-icons/im";
import { ImLinkedin } from "react-icons/im";

import { FaSquareReddit } from "react-icons/fa6";


const TeamSection = () => {
  const teamMembers = [
    {
      name: "Gabor Hollbeck",
      role: "Founder - Full Stack Engineer",
      image: GABORPORTRAIT,
      socialLinks: {
        Linkedin: "https://www.linkedin.com/in/gaborhollbeck/",
        twitter: "https://x.com/gaborhollbeck",
        github: "https://github.com/ghollbeck",
        website: "https://gaborhollbeck.com",
        email: "ghollbeck@ethz.ch"
      }
    },
    {
      name: "Jisbel Quiroz",
      role: "Strategic Coordination",
      image: JISBEL,
      socialLinks: {
        Linkedin: "https://www.linkedin.com/in/gisbelquiroz/",
        twitter: "#",
        github: "",
        website: "#",
        email: "jisbel@outlook.com" // Added email
      }
    },
    {
      name: "Mercedes Scheible",
      role: "Global Affairs Coordination",
      image: MERCEDES,
      socialLinks: {
        Linkedin: "https://www.linkedin.com/in/mercedesscheible/",
        twitter: "#",
        github: "#",
        website: "#",
        email: "mercedes.scheible@example.com" // Added email
      }
    } ,
    
    {
      name: "Antonio Guillebau",
      role: "Strategic Partnerships",
      image: ANTONIO,
      socialLinks: {
        Linkedin: "https://www.linkedin.com/in/antonio-guillebeau-1547061b9/",
        twitter: "#",
        github: "#",
        website: "",
        email: "antonio.guillebeau@example.com" // Added email
      }
    },
    {
      name: "Jonathan Maillefaud",
      role: "Full Stack Engineer",
      image: JONATHAN,
      socialLinks: {
        Linkedin: "https://www.linkedin.com/in/jmaillefaud/",
        twitter: "#",
        github: "#",
        website: "#",
        email: "jonathan.maillefaud@example.com" // Added email
      }
    },
    {
      name: "Eugenia Batista",
      role: "Contributor Coordination & Finances",
      image: EUGENIA,
      socialLinks: {
        Linkedin: "https://www.linkedin.com/in/eugenia-brotons-batista/",
        twitter: "#",
        github: "#",
        website: "#",
        email: "eugenia.batista@example.com" // Added email
      }
    },
    {
      name: "Mohammed Kerraz",
      role: "Full Stack Engineer",
      image: SIMO,
      socialLinks: {
        Linkedin: "https://www.linkedin.com/in/mohammed-kerraz-84411b238/",
        twitter: "#",
        github: "#",
        website: "#",
        email: "mohammed.kerraz@example.com" // Added email
      }
    }
  ];

  const Advisors = [
    // {
    //   name: "Prof. MarkusLeipold",
    //   role: " Professor @University of Zurich | Google DeepMind\n | TEDx Speaker | ChatClimate",
    //   image: GABORPORTRAIT,
    //   socialLinks: {
    //     Linkedin: "#",
    //     twitter: "#",
    //     github: "#",
    //     website: "#",
    //     email: "" // Added email
    //   }
    // },
    // {
    //   name: "Audrey Tang",
    //   role: "Minister of Digital Affairs Taiwan | Innovator in Digital Governance",
    //   image: GABORPORTRAIT,
    //   socialLinks: {
    //     Linkedin: "#",
    //     twitter: "#",
    //     github: "#",
    //     website: "#",
    //     email: "" // Added email
    //   }
    // },
    // {
    //   name: "Prof at HSG",
    //   role: "Professor at HSG",
    //   image: GABORPORTRAIT,
    //   socialLinks: {
    //     Linkedin: "#",
    //     twitter: "#",
    //     github: "#",
    //     website: "#",
    //     email: "" // Added email
    //   }
    // },
    {
      name: "Nikolaus Brissa",
      role: "Co-Founder - Full Stack Engineer",
      image: NIKI,
      socialLinks: {
        Linkedin: "https://www.linkedin.com/in/nikolaus-brissa/",
        twitter: "#",
        github: "https://github.com/niki-bri",
        website: "https://nikolausbrissa.com/",
        email: "" // Added email
      }
    },
    {
      name: "Lorin Urbantat,",
      role: "Co-Founder - Full Stack Engineer",
      image: LORIN,
      socialLinks: {
        Linkedin: "https://www.linkedin.com/in/bruol/",
        twitter: "#",
        github: "https://github.com/bruol",
        website: "https://bruol.me/",
        email: "lurbantat@ethz.ch" // Added email
      }
    },
    {
      name: "Leo Kustermann",
      role: "Co-Founder - Full Stack Engineer",
      image: LEO,
      socialLinks: {
        Linkedin: "https://www.linkedin.com/in/lkustermann/",
        twitter: "#",
        github: "",
        website: "#",
        email: "lkustermann@student.ethz.ch" // Added email
      }
    } 
  ];


  

  return (
    <section className="md:px-4 md:w-[60%] w-[90%] mx-auto">



                <div className='flex justify-center '>
                    <h1 className='text-2xl md:text-3xl font-extrabold text-white mb-10 mt-10 custom-gradient44'>Team</h1>
                </div>
             


 
  
  <div className=" grid grid-cols-2 md:grid-cols-3 md:gap-4  justify-center">
    {teamMembers.map((member) => (
      <div
        key={member.name}
        className="text-center m-2 sm:m-4"
      >
        <div
          className="
            w-20 h-20 md:w-32 md:h-32
            overflow-hidden 
            rounded-full 
            flex 
            justify-center 
            items-center 
            mx-auto
          "
        >
          <img
            src={member.image}
            alt={member.name}
            className="w-full h-auto rounded-full"
          />
        </div>
        <h3 className="mt-2 font-bold text-sm md:text-lg">{member.name}</h3>
        <h4 className="text-gray-500 text-xs md:text-base mt-1">
          {member.role}
        </h4>
        <ul className="flex justify-center mt-4 space-x-2">
          {member.socialLinks.Linkedin && member.socialLinks.Linkedin !== "#" && (
            <li>
              <a href={member.socialLinks.Linkedin} target="_blank" rel="noopener noreferrer" className="text-white">
                <FaLinkedin className="w-5 h-5 sm:w-6 sm:h-6 hover:scale-110 transition-transform" />
              </a>
            </li>
          )}
          {member.socialLinks.twitter && member.socialLinks.twitter !== "#" && (
            <li>
              <a href={member.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-white">
                <FaSquareXTwitter className="w-5 h-5 sm:w-6 sm:h-6 hover:scale-110 transition-transform" />
              </a>
            </li>
          )}
          {member.socialLinks.github && member.socialLinks.github !== "#" && (
            <li>
              <a href={member.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-white">
                <FaSquareGithub className="w-5 h-5 sm:w-6 sm:h-6 hover:scale-110 transition-transform" />
              </a>
            </li>
          )}
          {member.socialLinks.website && member.socialLinks.website !== "#" && (
            <li>
              <a href={member.socialLinks.website} target="_blank" rel="noopener noreferrer" className="text-white">
                <PiLinkFill className="w-5 h-5 sm:w-6 sm:h-6 hover:scale-110 transition-transform" />
              </a>
            </li>
          )}
          {member.socialLinks.email && member.socialLinks.email !== "#" && (
            <li>
              <a href={`mailto:${member.socialLinks.email}`} className="text-white">
                <MdEmail className="w-5 h-5 sm:w-6 sm:h-6 hover:scale-110 transition-transform" />
              </a>
            </li>
          )}
        </ul>
      </div>
    ))}
  </div>








      <div className='flex justify-center '>
                    <h1 className='text-2xl md:text-3xl font-extrabold text-white mb-10 mt-32 custom-gradient44'> Past Members</h1> 
                </div>
      <div className="text-center">
       
<div className=" flex flex-wrap md:grid-cols-3 md:gap-20 gap-20  justify-center">
    {Advisors.map((member) => (
      <div
        key={member.name}
        className="text-center m-2 sm:m-4"
      >
        <div
          className="
            w-20 h-20 md:w-32 md:h-32
            overflow-hidden 
            rounded-full 
            flex 
            justify-center 
            items-center 
            mx-auto
          "
        >
          <img
            src={member.image}
            alt={member.name}
            className="w-full h-auto rounded-full"
          />
        </div>
        <h3 className="mt-2 font-bold text-sm md:text-lg"style={{ margin: '10px 0', fontWeight: 'bold' }}>{member.name}</h3>
        <h4 className="text-gray-500 text-xs md:text-base mt-1" style={{ margin: '-10px 0 0 0', color: 'gray' }}>
                {member.role.split(' ').map((word, index) => (
                  <span key={index}>
                    {word}{' '}
                    {index % 4 === 2 ? <br /> : null} {/* Wrap every 3 words */}
                  </span>
                ))}
              </h4>

        <ul className="flex justify-center mt-4 space-x-2">
          {member.socialLinks.Linkedin && member.socialLinks.Linkedin !== "#" && (
            <li>
              <a href={member.socialLinks.Linkedin} target="_blank" rel="noopener noreferrer" className="text-white">
                <FaLinkedin className="w-5 h-5 sm:w-6 sm:h-6 hover:scale-110 transition-transform" />
              </a>
            </li>
          )}
          {member.socialLinks.twitter && member.socialLinks.twitter !== "#" && (
            <li>
              <a href={member.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-white">
                <FaSquareXTwitter className="w-5 h-5 sm:w-6 sm:h-6 hover:scale-110 transition-transform" />
              </a>
            </li>
          )}
          {member.socialLinks.github && member.socialLinks.github !== "#" && (
            <li>
              <a href={member.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-white">
                <FaSquareGithub className="w-5 h-5 sm:w-6 sm:h-6 hover:scale-110 transition-transform" />
              </a>
            </li>
          )}
          {member.socialLinks.website && member.socialLinks.website !== "#" && (
            <li>
              <a href={member.socialLinks.website} target="_blank" rel="noopener noreferrer" className="text-white">
                <PiLinkFill className="w-5 h-5 sm:w-6 sm:h-6 hover:scale-110 transition-transform" />
              </a>
            </li>
          )}
          {member.socialLinks.email && member.socialLinks.email !== "#" && (
            <li>
              <a href={`mailto:${member.socialLinks.email}`} className="text-white">
                <MdEmail className="w-5 h-5 sm:w-6 sm:h-6 hover:scale-110 transition-transform" />
              </a>
            </li>
          )}
        </ul>


       
      </div>
    ))}
  </div>

      </div>







      <div className='flex justify-center '>
                    <h1 className='text-2xl md:text-3xl font-extrabold text-white mb-10 mt-20 custom-gradient44'>Worldwide Contributors</h1>
                </div>
              
          

                <div className="flex justify-center items-center">
                        <div className="flex flex-wrap justify-center space-x-5 ">
                            <div className="text-white mb-3">Vincent B. Schult</div>
                            <div className="text-white mb-3">Stefani Stefanova</div>
                            <div className="text-white mb-3">Alexander Herforth</div>
                            <div className="text-white mb-3">Yuri Simantob</div>
                            <div className="text-white mb-3">Nicholas Scheurenbrand</div>
                            <div className="text-white mb-3">Alec McGail</div>
                         
                        </div>
                    </div>
                    




    </section>
  );
};

export default TeamSection;
