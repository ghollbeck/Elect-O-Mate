import React, { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography, Graticule } from 'react-simple-maps';
import { Tooltip } from 'react-tooltip';
import InterestForm from './InterestForm'; // Fixed typo in InterestForm import
import Footer from './../Footer';
import ETHLOGO from './../../pictures/ETH_SPH_LogoWhite.png'; // Import this icon to @mui
import MICROSOFTLOGO from './../../pictures/Microsoft-for-StartupsLogo.png';
import './Tailwind.css';

import GABORPORTRAIT from './../../pictures/Portrait Gabor.jpeg';
import TEAMSECTION from './TeamSection';
import ADVISORS from './Advisors';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
const implementedCountries = ['040', '056', '100', '276', '724', '250', '348', '380', '616', '840', '076', '288', '756'];

const LandingPage = ({ onButtonClick }) => {
    const [rotation, setRotation] = useState([-100, -10, 0]);
    const [globeScale, setGlobeScale] = useState(1.5); // Initial scale
    const [manualRotation, setManualRotation] = useState(null); // Tracks the new start point after manual rotation
    const [scrollFraction, setScrollFraction] = useState(0); // Track how far the user has scrolled (0 to 1)
    const [hasManualRotation, setHasManualRotation] = useState(false); // Flag to check if the globe was rotated manually

    const [textPosition, setTextPosition] = useState(0); // Initial position


    const [isDragging, setIsDragging] = useState(false);
    const [tooltipContent, setTooltipContent] = useState("");

    const handleMouseDown = () => {
        setIsDragging(true);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

  
    
    

    const smoothScrollTo = (elementId) => {
        const element = document.getElementById(elementId);
        if (element) {
            window.scrollTo({
                top: element.offsetTop,
                behavior: 'smooth'
            });
        }
    };


        // Manual configurations for scale and rotation
        const maxScale = 3;  // Max scale of the globe
        const minScale = 1.8;  // Min scale of the globe
        const startRotation = [-100, -50, 0];  // Start rotation (x, y, z)
        const endRotation = [-9, -40, 0];  // End rotation (x, y, z)
        const maxScroll = 400;  // Set this to your desired maximum scroll position


        const handleMouseMove = (event) => {
            if (isDragging) {
                const { movementX, movementY } = event;
                const newRotation = [
                    rotation[0] + movementX * 0.1,
                    rotation[1] - movementY * 0.1,
                    rotation[2],
                ];
                setRotation(newRotation);
                setManualRotation(newRotation); // Update the manual rotation
                setHasManualRotation(true); // Set the flag to indicate manual rotation has occurred
                console.log("Manual rotation has occurred."); // Log the event
            }
        };
        

        useEffect(() => {
            const handleScroll = () => {
                const scrollPosition = Math.min(window.scrollY, maxScroll); // Cap scroll position at maxScroll
                const scrollFraction = scrollPosition / maxScroll;  // A value between 0 and 1, based on maxScroll
        
                // Determine the current base rotation: if manually rotated, use manualRotation, else use startRotation
                const currentStartRotation = hasManualRotation ? manualRotation : startRotation;
                console.log("Current Start Rotation is:", hasManualRotation ? "manualRotation" : "startRotation"); // Log whether it's manualRotation or startRotation
        
                // Calculate the new rotation based on the capped scroll position
                const newRotation = [
                    currentStartRotation[0] + (endRotation[0] - currentStartRotation[0]) * scrollFraction,
                    currentStartRotation[1] + (endRotation[1] - currentStartRotation[1]) * scrollFraction,
                    currentStartRotation[2] + (endRotation[2] - currentStartRotation[2]) * scrollFraction,
                ];
        
                // Calculate the new scale based on capped scroll position
                const newScale = minScale + (maxScale - minScale) * scrollFraction;
         
                // Calculate the new text position based on scroll position
          const startTextPosition = 0; // Initial text position (in pixels)
          const endTextPosition = -200; // Final text position when fully scrolled (in pixels)
          const newTextPosition = startTextPosition + (endTextPosition - startTextPosition) * scrollFraction;
  
          setRotation(newRotation);
          setGlobeScale(newScale);
          setTextPosition(newTextPosition); // Update text position
  
        
                // Reset manual rotation flag if the user scrolls back to the top
                // if (scrollPosition === 0) {
                //     setHasManualRotation(false);
                // }
            };
        
            window.addEventListener('scroll', handleScroll);
            return () => {
                window.removeEventListener('scroll', handleScroll);
            };
        }, [maxScale, minScale, startRotation, endRotation, maxScroll, manualRotation, hasManualRotation]);
        
        



    const radius = '20%';
    const transitionSharpness = '20%';

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="bg-black p-6 ">
                <nav>
                    <div className="flex justify-center">
                        <div className="flex space-x-32">
                            <div className="text-white cursor-pointer hover:underline" onClick={() => smoothScrollTo('home-section')}>Home</div>
                            <div className="text-white cursor-pointer hover:underline" onClick={() => smoothScrollTo('how-it-works')}>How It Works</div>
                            <div className="text-white cursor-pointer hover:underline" onClick={() => smoothScrollTo('about-us')}>About Us</div>
                            <div className="text-white cursor-pointer hover:underline" onClick={() => smoothScrollTo('contact-section')}>Contact</div>
                        </div>
                    </div>
                </nav>
            </div>





            <div id="home-section" className='flex justify-center my-40'>
    <div className='text-center text-white inline-block' style={{ transform: `translateY(${textPosition}px)` }}>
        <h1 className='text-6xl md:text-9xl font-extrabold text-white'>Electomate</h1>
        <h1 className='text-6xl md:text-3xl '>Conversational Voting Advice Application</h1>
        <h1 className='text-xs md:text-2xl'>Select the country:</h1>
    </div>
</div>





            {/* World Map - Interactive globe that allows users to explore different regions */}

            <div
                className="mx-auto"
                style={{ 
                    transform: `scale(${globeScale})`, 
                    overflow: 'hidden', 
                    maxWidth: '1000px', 
                    maxHeight: '1000px' 
                }}
            >
                <div
                    className=""
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onMouseMove={(event) => handleMouseMove(event.nativeEvent)}
                >
                    <ComposableMap
                        projection="geoOrthographic"
                        projectionConfig={{
                            rotate: rotation,
                            scale: globeScale * 100,  // Dynamically scaled based on scroll
                            center: [0, 0]
                        }}
                        width={800}
                        height={800}
                        

    >

          {/* Define the gradient inside SVG defs */}
    <defs>
        <linearGradient id="countryGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: "rgba(60,60, 60, 1)", stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: "rgba(100, 100, 100, 1)", stopOpacity: 1 }} />
        </linearGradient>
    </defs>

    <defs>
        <linearGradient id="countryHoverGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: "rgba(50,200, 50, 1)", stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: "rgba(80, 240, 80, 0.9)", stopOpacity: 1 }} />
        </linearGradient>
    </defs>

        <Graticule stroke="rgba(255, 255, 255, 0.1)" strokeWidth={0.4} />

        <Geographies geography={geoUrl}>
            {({ geographies }) =>
                geographies.map((geo) => {
                    const isImplementedCountry = implementedCountries.includes(geo.id); // Check if the country is in the ImplementedCountries array
                    return (
                        <Geography
                            key={geo.rsmKey}
                            geography={geo}
                        fill={isImplementedCountry ? "url(#countryGradient)" : "rgba(244, 244, 244, 0.1)"} // Reference the gradient in the fill
                            stroke={isImplementedCountry ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.3)"} // Transparent for implemented countries, 0.3 opacity for others
                            strokeWidth={isImplementedCountry ? 0.4 : 0.1}// Adjust this value to reduce the stroke width

                            onMouseEnter={() => {
                                const { name } = geo.properties; // Access the country name from the 'name' property
                                setTooltipContent(name);
                            }}
                            onMouseLeave={() => {
                                setTooltipContent("");
                            }}
                            onClick={() => onButtonClick(geo.id)} // Call onButtonClick with the country ID
                            style={{
                                default: { outline: 'none' },
                                hover: { fill: isImplementedCountry ? "rgba(228, 228, 228, 0.5)" : "rgba(255, 0, 0, 0.5)", outline: 'none' }, // Green (rgba) for implemented countries, red (rgba) for others
                                pressed: { fill: "#E42", outline: 'none' },
                            }}
                            data-tip={geo.properties.name} // Set the tooltip content to the country name
                        />
                    );
                })
            }
        </Geographies>
    </ComposableMap>
    <Tooltip place="top" type="dark" effect="float" />

 {/* Radial Gradient Overlay */}
 <div
            className="map-overlay"
            style={{
                transform: `scale(${globeScale/4})`
            }}
        ></div></div>
</div>






            {/* Button to navigate to the main screen */}
            <div className="flex justify-center mb-10 mt-[500px]">
                <button
                    onClick={onButtonClick}
                    className="bg-[rgb(0,128,0)] text-white px-4 py-2 rounded-3xl"
                >
                    Try out for EU-Elections
                </button>
            </div>

            <div id="how-it-works" className="bg-black ">
                <div className='flex justify-center '>
                    <h1 className='text-6xl md:text-7xl font-extrabold text-white mb-10 mt-10'>How It Works</h1>
                </div>
                <div className="text-justify text-white px-4 w-1/2 mx-auto pb-32">
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                        Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris 
                        nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in 
                        reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla 
                        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in 
                        culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                </div>



                <div className='flex justify-start ml-20 '>
                    <h1 className='text-6xl md:text-5xl font-extrabold text-white mb-10 mt-10'>Features</h1>
                </div>
                <div className="text-justify text-white px-4 w-1/2 mx-auto pb-32">
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                        Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris 
                        nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in 
                        reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla 
                        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in 
                        culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                </div>



                <div className='flex justify-end mr-20 '>
                    <h1 className='text-6xl md:text-5xl font-extrabold text-white mb-10 mt-10'>Architecture</h1>
                </div>
               

                <div className=" justify-end text-white w-1/2 pb-32">
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                        Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris 
                        nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in 
                        reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla 
                        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in 
                        culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                </div>



                <div className='flex justify-start ml-20 '>
                    <h1 className='text-6xl md:text-5xl font-extrabold text-white mb-10 mt-10'>Performance</h1>
                </div>
                <div className="text-justify text-white px-4 w-1/2 mx-auto pb-32">
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                        Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris 
                        nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in 
                        reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla 
                        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in 
                        culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                </div>



            </div>

            <FAQSection />

            <div id="about-us" className="bg-black ">
                <div className='flex justify-center '>
                    <h1 className='text-6xl md:text-7xl font-extrabold text-white mb-10 mt-10'>About Us</h1>
                </div>
                <div className="text-justify text-white px-4 w-1/2 mx-auto pb-32">
                    <p>
                        We started this project as a bunch of students at ETH Zurich, who are interested in politics and AI4Good. 
                        By now we have grown to a diverse team of students and advisors from diverse fields. 
                        We have expertise in political science, economy, international affairs, computer science, law and design. 
                        We are constituted as a politically neutral non-profit organization located in Zurich, Switzerland. 
                        Over the lanst months we have grown a community of over 20 volounteers from all over the world to contribute to a globally implemented tool.

                    </p>
                </div>

                <div className='flex justify-center '>
                    <h1 className='text-6xl md:text-3xl font-extrabold text-white mb-10 mt-10'>Team</h1>
                </div>
             
                <div className="text-justify text-white px-4 w-[60%] mx-auto">
                    <TEAMSECTION />
                </div>

                <div className='flex justify-center '>
                    <h1 className='text-6xl md:text-3xl font-extrabold text-white mb-0 mt-10'>Advisors</h1>
                </div>

                <div className="text-justify text-white px-4 w-[80%] mx-auto">
                    <ADVISORS />
                </div>
            



                <div className='flex justify-center '>
                    <h1 className='text-6xl md:text-3xl font-extrabold text-white mb-10 mt-10'>Contributors</h1>
                </div>
                <div className="text-justify text-white px-4 w-1/2 mx-auto pb-32">
                    <ul className="flex flex-col">
                        <li className="flex justify-between">
                            <span className="text-right w-1/2">PR&Marketing</span>
                            <span className="mx-2">-</span>
                            <span className="text-left w-1/2">Gisbel Quiroz-Biland</span>
                        </li>
                        <li className="flex justify-between">
                            <span className="text-right w-1/2">Bulgaria</span>
                            <span className="mx-2">-</span>
                            <span className="text-left w-1/2">Vincent B. Schult</span>
                        </li>
                        <li className="flex justify-between">
                            <span className="text-right w-1/2">Bulgaria</span>
                            <span className="mx-2">-</span>
                            <span className="text-left w-1/2">Vincent B. Schult Girlfriend</span>
                        </li>
                        <li className="flex justify-between">
                            <span className="text-right w-1/2">Denmark, Belgium</span>
                            <span className="mx-2">-</span>
                            <span className="text-left w-1/2">Alexander Herforth</span>
                        </li>
                        <li className="flex justify-between">
                            <span className="text-right w-1/2">Poland</span>
                            <span className="mx-2">-</span>
                            <span className="text-left w-1/2">Yuri Simantob</span>
                        </li>
                        <li className="flex justify-between">
                            <span className="text-right w-1/2">Italy</span>
                            <span className="mx-2">-</span>
                            <span className="text-left w-1/2">Nicholas Scheurenbrand</span>
                        </li>
                        <li className="flex justify-between">
                            <span className="text-right w-1/2">Backend Engineer</span>
                            <span className="mx-2">-</span>
                            <span className="text-left w-1/2">Alec McGail</span>
                            
                        </li>
                        <li className="flex justify-between">
                            <span className="text-right w-1/2">Germany</span>
                            <span className="mx-2">-</span>
                            <span className="text-left w-1/2">Lara Voss</span>
                        </li>

                        <li className="flex justify-between">
                            <span className="text-right w-1/2">Brazil</span>
                            <span className="mx-2">-</span>
                            <span className="text-left w-1/2">Marco Silva</span>
                        </li>
                        <li className="flex justify-between">
                            <span className="text-right w-1/2">India</span>
                            <span className="mx-2">-</span>
                            <span className="text-left w-1/2">Nina Patel</span>
                        </li>
                        <li className="flex justify-between">
                            <span className="text-right w-1/2">United Arab Emirates</span>
                            <span className="mx-2">-</span>
                            <span className="text-left w-1/2">Omar Al-Farsi</span>
                        </li>
                        <li className="flex justify-between">
                            <span className="text-right w-1/2">South Korea</span>
                            <span className="mx-2">-</span>
                            <span className="text-left w-1/2">Sofia Kim</span>
                        </li>
                        <li className="flex justify-between">
                            <span className="text-right w-1/2">Germany</span>
                            <span className="mx-2">-</span>
                            <span className="text-left w-1/2">Lara Voss</span>
                        </li>

                        <li className="flex justify-between">
                            <span className="text-right w-1/2">Brazil</span>
                            <span className="mx-2">-</span>
                            <span className="text-left w-1/2">Marco Silva</span>
                        </li>
                        <li className="flex justify-between">
                            <span className="text-right w-1/2">India</span>
                            <span className="mx-2">-</span>
                            <span className="text-left w-1/2">Nina Patel</span>
                        </li>
                        <li className="flex justify-between">
                            <span className="text-right w-1/2">United Arab Emirates</span>
                            <span className="mx-2">-</span>
                            <span className="text-left w-1/2">Omar Al-Farsi</span>
                        </li>
                        <li className="flex justify-between">
                            <span className="text-right w-1/2">South Korea</span>
                            <span className="mx-2">-</span>
                            <span className="text-left w-1/2">Sofia Kim</span>
                        </li>
                        
                    </ul>
                </div>
          
            </div>

            <div id="contact-section" className="bg-black pb-20">
                <InterestForm />
            </div>

            <div className='flex justify-center '>
                <h1 className='text-6xl md:text-3xl font-extrabold text-white mb-0 mt-10'>We are supported by</h1>
            </div>
            <div className="text-justify text-white px-4 w-1/2 mx-auto ">
                <div className="flex justify-center mt-12">
                    <img src={ETHLOGO} style={{ maxWidth: '200px', height: 'auto', marginRight: 72 }} />
                    <img src={MICROSOFTLOGO} style={{ maxWidth: '200px', height: 'auto' }} />
                </div>
            </div>

            <div className='w-full'>
                <Footer />
            </div>
        </div>
    );
};

const FAQSection = () => {
    const [openOverview, setOpenOverview] = useState(false);
    const [openCompetitors, setOpenCompetitors] = useState(false);
    const [openMarketing, setOpenMarketing] = useState(false);
    const [openSafety, setOpenSafety] = useState(false);
    const [openAccuracy, setOpenAccuracy] = useState(false);
    const [openNeutrality, setOpenNeutrality] = useState(false);
    const [openFeatures, setOpenFeatures] = useState(false);
    const [openDevelopment, setOpenDevelopment] = useState(false);
    const [openSources, setOpenSources] = useState(false);
    const [openLongTerm, setOpenLongTerm] = useState(false);

    return (
        <div className="bg-black text-white">
            <div className='flex justify-center'>
                <h1 className='text-6xl md:text-7xl font-extrabold mb-10 mt-10'>Q&A</h1>
            </div>
            <div className="px-4 w-1/2 mx-auto pb-32">
                <div className="border-b border-gray-700">
                    <button className="flex justify-between w-full py-4 text-left" onClick={() => setOpenSafety(!openSafety)}>
                        <span>How do you ensure safety and privacy?</span>
                        <span>{openSafety ? '-' : '+'}</span>
                    </button>
                    {openSafety && (
                        <p className="text-justify" style={{ marginBottom: '20px' }}>
                            We take safety and privacy very seriously. All sources are exclusively from official party programs and websites. We use a Retrieval Augmented Generation (RAG) pipeline to ensure high source accuracy. Additionally, we do not track or store any user data, and our code is open-source on GitHub for full transparency.
                        </p>
                    )}
                </div>
                <div className="border-b border-gray-700">
                    <button className="flex justify-between w-full py-4 text-left" onClick={() => setOpenAccuracy(!openAccuracy)}>
                        <span>How do you ensure the accuracy of the information?</span>
                        <span>{openAccuracy ? '-' : '+'}</span>
                    </button>
                    {openAccuracy && (
                        <p className="text-justify" style={{ marginBottom: '20px' }}>
                            We ensure accuracy by using the RAG pipeline, which allows for precise control over sources and their accuracy. The pipeline is designed to retrieve relevant information directly from official party programs and manifestos, reducing the risk of misinformation.
                        </p>
                    )}
                </div>
                <div className="border-b border-gray-700">
                    <button className="flex justify-between w-full py-4 text-left" onClick={() => setOpenNeutrality(!openNeutrality)}>
                        <span>How do you maintain political neutrality?</span>
                        <span>{openNeutrality ? '-' : '+'}</span>
                    </button>
                    {openNeutrality && (
                        <p className="text-justify" style={{ marginBottom: '20px' }}>
                            Political neutrality is maintained through precise and restrictive prompt engineering in our API requests. We only use official sources and strictly avoid any subjective interpretations, ensuring that the information provided is unbiased and neutral.
                        </p>
                    )}
                </div>
                <div className="border-b border-gray-700">
                    <button className="flex justify-between w-full py-4 text-left" onClick={() => setOpenFeatures(!openFeatures)}>
                        <span>What are the main features of Elect-O-Mate?</span>
                        <span>{openFeatures ? '-' : '+'}</span>
                    </button>
                    {openFeatures && (
                        <p className="text-justify" style={{ marginBottom: '20px' }}>
                            Elect-O-Mate offers several key features including AI-powered chat with party programs, AI voice calls, overlap graphs (spider, bar chart, grid plot), and support for all European countries. The tool is designed to make election preparation more accessible and engaging.
                        </p>
                    )}
                </div>
                <div className="border-b border-gray-700">
                    <button className="flex justify-between w-full py-4 text-left" onClick={() => setOpenDevelopment(!openDevelopment)}>
                        <span>Will Elect-O-Mate continue to be developed after the release?</span>
                        <span>{openDevelopment ? '-' : '+'}</span>
                    </button>
                    {openDevelopment && (
                        <p className="text-justify" style={{ marginBottom: '20px' }}>
                            Yes, we plan to continue developing Elect-O-Mate based on user feedback. Future plans include adding more features, such as interactive graphs and possibly integrating Perplexity-like web search functionalities.
                        </p>
                    )}
                </div>
                <div className="border-b border-gray-700">
                    <button className="flex justify-between w-full py-4 text-left" onClick={() => setOpenSources(!openSources)}>
                        <span>What sources does Elect-O-Mate use?</span>
                        <span>{openSources ? '-' : '+'}</span>
                    </button>
                    {openSources && (
                        <p className="text-justify" style={{ marginBottom: '20px' }}>
                            Elect-O-Mate exclusively uses official party programs and party websites as its sources. This ensures that the information provided is reliable, up-to-date, and directly from the source.
                        </p>
                    )}
                </div>
                <div className="border-b border-gray-700">
                    <button className="flex justify-between w-full py-4 text-left" onClick={() => setOpenLongTerm(!openLongTerm)}>
                        <span>What are the long-term goals for Elect-O-Mate?</span>
                        <span>{openLongTerm ? '-' : '+'}</span>
                    </button>
                    {openLongTerm && (
                        <p className="text-justify" style={{ marginBottom: '20px' }}>
                            Our long-term goals include adapting the tool for other elections around the world and integrating AI chat and voice call functionalities into institutional websites, such as migration offices, to make interactions more efficient and user-friendly.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
