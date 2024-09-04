/* global Vara */

import React, { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography, Graticule } from 'react-simple-maps';
import { Tooltip } from 'react-tooltip';
import InterestForm from './InterestForm'; // Fixed typo in InterestForm import
import Footer from './../Footer';
import ETHLOGO from './../../pictures/ETH_SPH_LogoWhite.png'; // Import this icon to @mui
import MICROSOFTLOGO from './../../pictures/Microsoft-for-StartupsLogo.png';
import './Tailwind.css';
import { motion } from 'framer-motion';

import MadeWithLove from './../../pictures/MadeWithLoveRed.png';



import GABORPORTRAIT from './../../pictures/Portrait Gabor.jpeg';
import TEAMSECTION from './TeamSection';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
const implementedCountries = ['040', '056', '100', '276', '724', '250', '348', '380', '616', '840', '076', '288', '756'];


const HandWritingAnimation = ({ text }) => {
    return (
        <div>
            <motion.h2
                className="text-secondary font-nautigal md:text-6xl text-5xl"
                initial={{ opacity: 0, x: -20 }}  // Starts with opacity 0 and slightly off the left
                animate={{ opacity: 1, x: 0 }}    // Animates to full opacity and 0 x-position
                transition={{ duration: 2 }}      // Duration of 2 seconds for the transition
            >
                {text}
            </motion.h2>
        </div>
    );
};


const LandingPage = ({ onButtonClick }) => {
    const [rotation, setRotation] = useState([-100, -10, 0]);
    const [globeScale, setGlobeScale] = useState(1.5); // Initial scale
    const [manualRotation, setManualRotation] = useState(null); // Tracks the new start point after manual rotation
    const [scrollFraction, setScrollFraction] = useState(0); // Track how far the user has scrolled (0 to 1)
    const [hasManualRotation, setHasManualRotation] = useState(false); // Flag to check if the globe was rotated manually
    const [mapOpacity, setMapOpacity] = useState(0.5); // Initial opacity


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
        const maxScale = 2.2;  // Max scale of the globe
        const minScale = 3;  // Min scale of the globe
        const startRotation = [70, -46, 0];  // Start rotation (x, y, z)
        const endRotation = [-9, -40, 0];  // End rotation (x, y, z)
        const maxScroll = 600;  // Set this to your desired maximum scroll position


        

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
        
        const easeInOutCubic = (t) => {
            return t < 0.4 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        };

        
        useEffect(() => {
            const handleScroll = () => {
                const scrollPosition = window.scrollY;
                const startOpacityScroll = 100; // Scroll position where opacity transition starts
                const endOpacityScroll = 500;   // Scroll position where opacity transition ends
        
                // Cap scroll position at maxScroll for scaling and rotation purposes
                const cappedScrollPosition = Math.min(scrollPosition, maxScroll);
                const scrollFraction = cappedScrollPosition / maxScroll;
                const easedScrollFraction = easeInOutCubic(scrollFraction);
        
                // Calculate the new rotation based on the eased scroll fraction
                const currentStartRotation = hasManualRotation ? manualRotation : startRotation;
                const newRotation = [
                    currentStartRotation[0] + (endRotation[0] - currentStartRotation[0]) * easedScrollFraction,
                    currentStartRotation[1] + (endRotation[1] - currentStartRotation[1]) * easedScrollFraction,
                    currentStartRotation[2] + (endRotation[2] - currentStartRotation[2]) * easedScrollFraction,
                ];
                setRotation(newRotation);
        
                // Calculate the new scale
                const newScale = minScale + (maxScale - minScale) * easedScrollFraction;
                setGlobeScale(newScale);
        
              // Calculate opacity based on scroll position
if (scrollPosition <= startOpacityScroll) {
    // console.log("1");
    // Before the starting point, keep the opacity at the initial value
    setMapOpacity(0.5); // Keep the initial opacity
} else if (scrollPosition > startOpacityScroll && scrollPosition <= endOpacityScroll) {
    // console.log("2");
    // Between start and end, gradually increase the opacity
    const opacityFraction = (scrollPosition - startOpacityScroll) / (endOpacityScroll - startOpacityScroll);
    setMapOpacity(0.3 + opacityFraction * 0.7); // Adjust opacity from 0.5 to 1
} else {
    // console.log("3");
    // After the endOpacityScroll, keep opacity at 100%
    setMapOpacity(1);
}

            };
        
            window.addEventListener('scroll', handleScroll);
            return () => {
                window.removeEventListener('scroll', handleScroll);
            };
        }, [maxScale, minScale, startRotation, endRotation, maxScroll, manualRotation, hasManualRotation]);
        

        

        // useEffect(() => {
        //     // Initialize Vara after the component mounts
        //     new Vara(
        //         "#vara-container", 
        //         "https://raw.githubusercontent.com/akzhy/Vara/master/fonts/Satisfy/SatisfySL.json", 
        //         [
        //             {
        //                 text:"Hello World", // String, text to be shown
        //                 fontSize:24, // Number, size of the text
        //                 strokeWidth:.5, // Width / Thickness of the stroke
        //                 color:"black", // Color of the text
        //                 id:"", // String or integer, for if animations are called manually or when using the get() method. Default is the index of the object.
        //                 duration:2000, // Number, Duration of the animation in milliseconds
        //                 textAlign:"left", // String, text align, accepted values are left,center,right
        //                 x:0, // Number, x coordinate of the text
        //                 y:0, // Number, y coordinate of the text
        //                 fromCurrentPosition:{ // Whether the x or y coordinate should be from its calculated position, ie the position if x or y coordinates were not applied
        //                     x:true, // Boolean
        //                     y:true, // Boolean
        //                 },
        //                 autoAnimation:true, // Boolean, Whether to animate the text automatically
        //                 queued:true, // Boolean, Whether the animation should be in a queue
        //                 delay:0,     // Delay before the animation starts in milliseconds
        //                 /* Letter spacing can be a number or an object, if number, the spacing will be applied to every character.
        //                 If object, each letter can be assigned a different spacing as follows,
        //                 letterSpacing: {
        //                     a: 4,
        //                     j: -6,
        //                     global: -1
        //                 }
        //                 The global property is used to set spacing of all other characters
        //                 */
        //                 letterSpacing:0
        //             }],{
        //                 // The options given below will be applicable to every text created,
        //                 // however they will not override the options set above.
        //                 // They will work as secondary options.
        //                 fontSize:24, // Number, size of the text
        //                 strokeWidth:.5, // Width / Thickness of the stroke
        //                 color:"black", // Color of the text
        //                 duration:2000, // Number, Duration of the animation in milliseconds
        //                 textAlign:"left", // String, text align, accepted values are left,center,right
        //                 autoAnimation:true, // Boolean, Whether to animate the text automatically
        //                 queued:true, // Boolean, Whether the animation should be in a queue
        //                 letterSpacing:0
        //             }
        //     );
        // }, []);
    

    const radius = '20%';
    const transitionSharpness = '20%';

    return (
        <div className="min-h-screen bg-black text-white">
             <div className="p-6" style={{ zIndex: 10, position: 'relative', background: 'linear-gradient(to bottom, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0))' }}>
                <nav>
                    <div className="flex justify-center">
                        <div className="flex space-x-32 font-bold">
                            <div className="text-white cursor-pointer hover:underline" onClick={() => smoothScrollTo('home-section')}>Home</div>
                            <div className="text-white cursor-pointer hover:underline" onClick={() => smoothScrollTo('how-it-works')}>How It Works</div>
                            <div className="text-white cursor-pointer hover:underline" onClick={() => smoothScrollTo('Q&A')}>Q&A</div>
                            <div className="text-white cursor-pointer hover:underline" onClick={() => smoothScrollTo('about-us')}>About Us</div>
                            <div className="text-white cursor-pointer hover:underline" onClick={() => smoothScrollTo('contact-section')}>Contact</div>
                        </div>
                    </div>
                </nav>
            </div>

            <div id="home-section" className="flex justify-center my-40" style={{ zIndex: 10, position: 'relative' }}>
            <header className='text-center  inline-block w-full'>                    
                <h1 className='text-center custom-gradient text-6xl md:text-9xl font-extrabold '>
                        Electomate
                    </h1>
                    <h1 className="text-center custom-gradient2 text-6xl md:text-3xl">Conversational Voting Advice Application</h1>
                    {/* <h1 className="text-center custom-gradient2 text-xs md:text-xl">Made with love by people from all over the world</h1> */}
                    {/* <div id="vara-container" style={{ height: '200px', width: '100%' }}> </div> */}
                    <div className="flex justify-center my-4">
                <img src={MadeWithLove} alt="Made with Love" className="h-16" />
            </div>
                </header>
            
            </div>






            {/* World Map - Interactive globe that allows users to explore different regions */}

            <div
    className="mx-auto"
    style={{
        transform: `scale(${globeScale})`,
        overflow: 'hidden',
        maxWidth: '1000px',
        maxHeight: '1000px',
        opacity: mapOpacity, // Apply the opacity dynamically
        transition: 'opacity 0.3s ease' // Optional: smooth opacity transition
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
            <stop offset="0%" style={{ stopColor: "rgba(120,120, 120, 1)", stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: "rgba(180, 180, 180, 1)", stopOpacity: 1 }} />
        </linearGradient>
    </defs>

    <defs>
        <linearGradient id="countryHoverGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: "rgba(50,200, 50, 1)", stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: "rgba(80, 240, 80, 0.9)", stopOpacity: 1 }} />
        </linearGradient>
    </defs>

    <defs>
  <filter id="glowEffect" x="-50%" y="-50%" width="200%" height="200%">
    <feGaussianBlur stdDeviation="0.6" result="coloredBlur"/>
    <feMerge>
      <feMergeNode in="coloredBlur"/>
      <feMergeNode in="SourceGraphic"/>
    </feMerge>
  </filter>
</defs>





        <Graticule stroke="rgba(255, 255, 255, 0.3)" strokeWidth={0.4} />

        <Geographies geography={geoUrl}>
            {({ geographies }) =>
                geographies.map((geo) => {
                    const isImplementedCountry = implementedCountries.includes(geo.id); // Check if the country is in the ImplementedCountries array
                    return (
                        <Geography
                            key={geo.rsmKey}
                            geography={geo}
                        fill={isImplementedCountry ? "url(#countryGradient)" : "rgba(244, 244, 244, 0.2)"} // Reference the gradient in the fill
                            stroke={isImplementedCountry ? "rgba(255, 255, 255, 1)" : "rgba(255, 255, 255, 0.3)"} // Transparent for implemented countries, 0.3 opacity for others
                            filter = { isImplementedCountry ? "url(#glowEffect)" : "none"} // Add glow effect for implemented countries

                            strokeWidth={isImplementedCountry ? 0.1 : 0.1}// Adjust this value to reduce the stroke width


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
                                hover: { 
                                    fill: isImplementedCountry ? "rgba(8, 228, 8, 0.2)" : "rgba(255, 0, 0, 0.1)", 
                                    stroke: isImplementedCountry ? "rgba(5, 255, 5, 0.6)" : "rgba(255, 5, 5, 0.8)", // Stroke color for hover
                                    strokeWidth: isImplementedCountry ? 0.5 : 0.5, // Added stroke width for hover effect
                                    filter: isImplementedCountry ? "url(#glowEffect)" : "url(#glowEffect)" // Add glow effect for implemented countries
                                }, // Green (rgba) for implemented countries, red (rgba) for others
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
                transform: `scale(${globeScale/4})`,
                zIndex: 0 // Ensure the overlay is behind other elements

            }}
        ></div></div>
</div>






         

            <div  className="">

            <div className='flex justify-center mb-10 mt-[200px]'>
                    <h1 className='text-6xl custom-gradient2 md:text-3xl font-extrabold text-white mb-10 mt-10'>Countries available</h1>
                </div>
              

                </div>


             
                
                    <div className="flex justify-center items-center">
                        <div className="flex flex-wrap justify-center space-x-10 w-[60%]">
                            <div className="text-white cursor-pointer hover:underline mb-3" onClick={onButtonClick}>Germany</div>
                            <div className="text-white cursor-pointer hover:underline mb-3" onClick={onButtonClick}>France</div>
                            <div className="text-white cursor-pointer hover:underline mb-3" onClick={onButtonClick}>Italy</div>
                            <div className="text-white cursor-pointer hover:underline mb-3" onClick={onButtonClick}>Spain</div>
                            <div className="text-white cursor-pointer hover:underline mb-3" onClick={onButtonClick}>Hungary</div>
                            <div className="text-white cursor-pointer hover:underline mb-3" onClick={onButtonClick}>Belgium</div>
                            <div className="text-white cursor-pointer hover:underline mb-3" onClick={onButtonClick}>Austria</div>
                            <div className="text-white cursor-pointer hover:underline mb-3" onClick={onButtonClick}>Poland</div>
                            <div className="text-white cursor-pointer hover:underline mb-3" onClick={onButtonClick}>Bulgaria</div>
                            <div className="text-white cursor-pointer hover:underline mb-3" onClick={onButtonClick}>Denmark</div>

                            <div className="text-white cursor-pointer hover:underline mb-3" onClick={onButtonClick}>United States (soon)</div>
                            <div className="text-white cursor-pointer hover:underline mb-3" onClick={onButtonClick}>Brazil (soon)</div>
                            <div className="text-white cursor-pointer hover:underline mb-3" onClick={onButtonClick}>Ghana (soon)</div>
                            <div className="text-white cursor-pointer hover:underline mb-3" onClick={onButtonClick}>Switzerland (soon)</div>
                           
                         
                        </div>
                    </div>
                    
        




            <div id="how-it-works" className="h-10 mt-10">
            </div>

            <div  className="bg-black mt-12">
                
                <div className='flex justify-center '>
                    <h1 className='text-6xl md:text-7xl font-extrabold mb-10  custom-gradient3'>How It Works</h1>
                </div>
                <div className="text-justify text-white w-[66%] mx-auto ">
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


                

                <div className='flex justify-center'>
                <div className='w-[66%] '>
                    <h1 className='text-6xl text-left md:text-5xl font-extrabold text-white mb-10 mt-10 custom-gradient3'>Features</h1>
                </div>
                </div>
               
                <div className='flex justify-center'>
                <div className='w-[66%] '>
                <div className="w-1/2 text-left">

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
                </div>
              



                <div className='flex justify-center'>
                <div className='w-[66%] '>
                    <h1 className='text-6xl text-right md:text-5xl font-extrabold text-white mb-10 mt-10 custom-gradient3'>Architecture</h1>
                </div>
                </div>
               
                <div className='flex justify-center'>
                <div className='w-[66%] '>
                <div className='flex justify-end'>
                <div className="w-1/2 text-right">

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
                </div>
                </div>
              






                <div className='flex justify-center'>
                <div className='w-[66%] '>
                    <h1 className='text-6xl text-left md:text-5xl font-extrabold text-white mb-10 mt-10 custom-gradient3'>Performance</h1>
                </div>
                </div>
               
                <div className='flex justify-center'>
                <div className='w-[66%] '>
                <div className="w-1/2 text-left">

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
                </div>
              


             {/* Q&A SECTION */}
            </div>
            <div id="Q&A" className="h-10 mt-10">
            </div>


            <div className='flex justify-center'>
                <div className='w-[66%] bg-black  '>
                    <   FAQSection />
                </div>
            </div>




             {/* ABOUT US SECTION */}
            <div id="about-us" className="h-10 mt-10">
            </div>

            <div  className="bg-black mt-12">
            <div className='flex justify-center '>
                    <h1 className='text-6xl md:text-7xl font-extrabold mb-10  custom-gradient4'>About Us</h1>
                </div>
                <div className="text-justify text-white w-[66%] mx-auto ">
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

                <div className="text-justify text-white px-4 w-[60%] mx-auto mt-10">
                    <TEAMSECTION />
                </div>

          

             





            </div>

            <div id="contact-section" className="bg-black mt-24">
                <InterestForm />
            </div>

            <div className='flex justify-center '>
                <h1 className='text-6xl md:text-3xl font-extrabold text-white mb-0 mt-32'>We are supported by</h1>
            </div>
            <div className="text-justify text-white px-4 w-1/2 mx-auto mb-20 ">
                <div className="flex justify-center mt-12">
                    <img src={ETHLOGO} style={{ maxWidth: '200px', height: 'auto', marginRight: 72 }} />
                    <img src={MICROSOFTLOGO} style={{ maxWidth: '200px', height: 'auto' }} />
                </div>
            </div>

            <div className='w-full opacity-35'>
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
                <h1 className='text-6xl md:text-7xl font-extrabold mb-10  custom-gradient5'>Q&A</h1>
            </div>
            <div className=" mx-auto ">
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
