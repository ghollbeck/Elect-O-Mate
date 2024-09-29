/* global Vara */

import React, { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography, Graticule } from 'react-simple-maps';
import { Tooltip } from 'react-tooltip';
import InterestForm from './InterestForm'; // Fixed typo in InterestForm import
import Footer from './../Footer';
import ETHLOGO from './../../pictures/ETH_SPH_LogoWhite.png'; // Import this icon to @mui
import MICROSOFTLOGO from './../../pictures/Microsoft-for-StartupsLogo.png';
import WACCELOGO from './../../pictures/Partners/WACCE-Menu-Logo.jpg';
import HSGLOGO from './../../pictures/Partners/HSG_Logo_EN_RGB_Weiss-1024x213.png';

import './Tailwind.css';
import { motion } from 'framer-motion';
import MadeWithLove from './../../pictures/MadeWithLoveRed.png';
import GABORPORTRAIT from './../../pictures/Team_Photos/Portrait Gabor.jpeg';
import EMLogo from './../../pictures/ElectoMAteLogoblack1000x.png';
import TEAMSECTION from './TeamSection';
import { FaInfoCircle, FaComments, FaChartBar, FaArrowUp, FaLock, FaTools, FaRegCircle, FaBars } from 'react-icons/fa'; // Added FaBars import
import { useTranslation } from 'react-i18next';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
const implementedCountries = ['040', '056', '100', '276', '724', '250', '348', '380', '616', '840', '076', '288', '756'];
const nonClickableCountries = ['076', '840', '288', '756']; // Brazil, United States, Ghana, Switzerland
const countryToLanguage = {
    '040': 'aten', // Austria
    '056': 'benl', // Belgium
    '100': 'bgbg', // Bulgaria
    '276': 'dede', // Germany
    '724': 'eses', // Spain
    '250': 'frfr', // France
    '348': 'huhu', // Hungary
    '380': 'itit', // Italy
    '616': 'plpl', // Poland
    '840': 'usen', // United States
    '076': 'bren', // Brazil
    '288': 'ghen', // Ghana
    '756': 'chen'  // Switzerland
};


const LandingPage = ({ onButtonClick, changeLanguage }) => {
    // Manual configurations for scale and rotation
    const maxScale = 2.2;  // Max scale of the globe
    const minScale = 2;  // Min scale of the globe
    const startRotation = [40, -90, 0];  // Start rotation (x, y, z) to have the north pole facing the user like in the UN logo
    const endRotation = [-9, -40, 0];  // End rotation (x, y, z)
    const maxScroll = 600;  // Set this to your desired maximum scroll position
    const endOpacityScroll = maxScroll;   // Scroll position where opacity transition ends
    const startOpacityScroll = 0; // Scroll position where opacity transition starts

    const MarginTopconstant = 750;
    const MarginTopconstantMobile = 400;

    // Set initial state for rotation, globeScale, mapOpacity, and isInitialFadeIn
    const [rotation, setRotation] = useState(startRotation); // Set to startRotation
    const [globeScale, setGlobeScale] = useState(minScale); // Set to minScale
    const [mapOpacity, setMapOpacity] = useState(0.5); // Start with 0 opacity
    const [isInitialFadeInComplete, setIsInitialFadeInComplete] = useState(false);
    const [manualRotation, setManualRotation] = useState(null); // Tracks the new start point after manual rotation
    const [scrollFraction, setScrollFraction] = useState(0); // Track how far the user has scrolled (0 to 1)
    const [hasManualRotation, setHasManualRotation] = useState(false); // Flag to check if the globe was rotated manually
    const [textPosition, setTextPosition] = useState(0); // Initial position
    const [isDragging, setIsDragging] = useState(false);
    const [tooltipContent, setTooltipContent] = useState("");
    const [startTouch, setStartTouch] = useState({ x: 0, y: 0 });
    const [isNavOpen, setIsNavOpen] = useState(false); // Added state for navigation menu
    const [marginTop, setMarginTop] = useState(window.innerWidth < 768 ? -MarginTopconstantMobile : -MarginTopconstant); // Set margin-top to -100 for small screens and -300 for desktop
    const [overlayOpacity, setOverlayOpacity] = useState(1); // Initial opacity of the overlay
    const [isTransitionComplete, setIsTransitionComplete] = useState(false); // Track if the transition is complete
    const [titleOpacity, setTitleOpacity] = useState(0);
    const { t, i18n } = useTranslation();

  const [isFirstTextVisible, setIsFirstTextVisible] = useState(true);
  const [opacity, setOpacity] = useState(1); // Initial opacity set to 1

    // Function to update margin-top based on scroll position
    const updateMarginTop = (scrollPosition, startOpacityScroll, endOpacityScroll) => {
        if (window.innerWidth < 768) { // Small screens
            if (scrollPosition <= startOpacityScroll) {
                setMarginTop(-MarginTopconstantMobile); // Start with -100px margin-top
            } else if (scrollPosition > startOpacityScroll && scrollPosition <= endOpacityScroll) {
                const marginFraction = (scrollPosition - startOpacityScroll) / (endOpacityScroll - startOpacityScroll);
                setMarginTop(-MarginTopconstantMobile + marginFraction * (endOpacityScroll+MarginTopconstantMobile)); // Gradually increase from -100px to 400px
            } else {
                setMarginTop(endOpacityScroll); // Full margin-top
            }
        } else { // Desktop screens
            if (scrollPosition <= startOpacityScroll) {
                setMarginTop(-MarginTopconstant); // Start with -300px margin-top
            } else if (scrollPosition > startOpacityScroll && scrollPosition <= endOpacityScroll) {
                const marginFraction = (scrollPosition - startOpacityScroll) / (endOpacityScroll - startOpacityScroll);
                setMarginTop(-MarginTopconstant + marginFraction * MarginTopconstant); // Gradually increase from -300px to 0px
            } else {
                setMarginTop(0); // Full margin-top
            }
        }
    };

    const handleMouseDown = () => {
        setIsDragging(true);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (event) => {
        if (isDragging) {
            const movementX = event.movementX;
            const movementY = event.movementY;
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

    const handleTouchStart = (event) => {
        const touch = event.touches[0];
        setStartTouch({ x: touch.clientX, y: touch.clientY });
        setIsDragging(true);
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
    };

    const handleTouchMove = (event) => {
        if (isDragging) {
            const touch = event.touches[0];
            const movementX = touch.clientX - startTouch.x;
            const movementY = touch.clientY - startTouch.y;
            const newRotation = [
                rotation[0] + movementX * 0.005, // Reduced multiplier for slower rotation
                rotation[1] - movementY * 0.005, // Reduced multiplier for slower rotation
                rotation[2],
            ];
            setRotation(newRotation);
            setManualRotation(newRotation); // Update the manual rotation
            setHasManualRotation(true); // Set the flag to indicate manual rotation has occurred
            console.log("Manual rotation has occurred."); // Log the event
            

            // Prevent default scrolling behavior if the scroll position is below endOpacityScroll
            if (window.scrollY <= endOpacityScroll) {
                event.preventDefault();
            }
        }
    };

    const smoothScrollTo = (elementId, offset = 0) => {
        const element = document.getElementById(elementId);
        if (element) {
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            window.scrollTo({
                top: elementPosition + offset,
                behavior: 'smooth'
            });
        }
    };



    const easeInOutCubic = (t) => {
        return t < 0.4 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

  useEffect(() => {
    if (!isTransitionComplete) {
        const timeout = setTimeout(() => {
            setOverlayOpacity(0); // Reduce opacity to 0
            setIsTransitionComplete(true);
        }, 50); // 2 seconds delay

        return () => clearTimeout(timeout);
    }
}, [isTransitionComplete]);

const handleCountryClick = (countryId) => {
    const languageCode = countryToLanguage[countryId];
    if (languageCode) {
      changeLanguage(languageCode);
      i18n.changeLanguage(languageCode); // Update i18n language
    }
    onButtonClick();
  };


    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;

            // Cap scroll position at maxScroll for scaling and rotation purposes
            const cappedScrollPosition = Math.min(scrollPosition, maxScroll);
            const adjustedScrollPosition = Math.max(cappedScrollPosition - startOpacityScroll, 0);
            const scrollFraction = adjustedScrollPosition / (maxScroll - startOpacityScroll);
            const easedScrollFraction = easeInOutCubic(scrollFraction);

            // Calculate the new rotation based on the eased scroll fraction
            const currentStartRotation = hasManualRotation ? manualRotation : startRotation;
            const newRotation = [
                currentStartRotation[0] + (endRotation[0] - currentStartRotation[0]) * scrollFraction, // Use scrollFraction directly for smooth rotation
                currentStartRotation[1] + (endRotation[1] - currentStartRotation[1]) * scrollFraction, // Use scrollFraction directly for smooth rotation
                currentStartRotation[2] + (endRotation[2] - currentStartRotation[2]) * scrollFraction, // Use scrollFraction directly for smooth rotation
            ];
            setRotation(newRotation);

            // Calculate the new scale
            const newScale = minScale + (maxScale - minScale) * scrollFraction; // Use scrollFraction directly for smooth scaling
            setGlobeScale(newScale);

            // Update opacity calculation
            if (scrollPosition <= startOpacityScroll) {
                setMapOpacity(0.5); // Start with low opacity
            } else if (scrollPosition > startOpacityScroll && scrollPosition <= endOpacityScroll) {
                const opacityFraction = (scrollPosition - startOpacityScroll) / (endOpacityScroll - startOpacityScroll);
                setMapOpacity(0.5 + opacityFraction * 0.5); // Gradually increase from 0.5 to 1
            } else {
                setMapOpacity(1); // Full opacity
            }

            // Update title opacity
            if (scrollPosition >= endOpacityScroll) {
                setTitleOpacity(1);
            } else {
                setTitleOpacity(0);
            }

            // Update margin-top calculation
            updateMarginTop(scrollPosition, startOpacityScroll, endOpacityScroll);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [maxScale, minScale, startRotation, endRotation, maxScroll, manualRotation, hasManualRotation, isInitialFadeInComplete, endOpacityScroll]);


    useEffect(() => {
        let fadeOutTimeout;
        let switchTextTimeout;
        let fadeInTimeout;

        // Function to start the fade-out effect
        const startFadeOut = () => {
            setOpacity(0); // Fade out by setting opacity to 0
            switchTextTimeout = setTimeout(switchText, 1000); // Wait for fade-out to finish (1 second), then switch text
        };

        // Function to switch the text after fade-out is complete
        const switchText = () => {
            setIsFirstTextVisible(prev => !prev); // Switch the text
            fadeInTimeout = setTimeout(startFadeIn, 500); // Wait 0.5 seconds after switching, then start fade-in
        };

        // Function to start the fade-in effect
        const startFadeIn = () => {
            setOpacity(1); // Fade in by setting opacity to 1
            fadeOutTimeout = setTimeout(startFadeOut, 3000); // After 3 seconds of visibility, start fade-out again
        };

        // Start the initial fade-out after 1 second
        fadeOutTimeout = setTimeout(startFadeOut, 1000);

        // Clean up timeouts on component unmount
        return () => {
            clearTimeout(fadeOutTimeout);
            clearTimeout(switchTextTimeout);
            clearTimeout(fadeInTimeout);
        };
    }, []);





    
    return (
        <div className="min-h-screen bg-black text-white">
           <div className="map-overlay2" style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                transform: `scale(1)`,
                zIndex: 5,
                pointerEvents: 'none',
                opacity: overlayOpacity,
                transition: 'opacity 2s ease'
            }}>
            </div>
            
            <div className="p-6" style={{ zIndex: 11, position: 'relative', background: 'linear-gradient(to bottom, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0))' }}>
            <button 
                className="fixed top-4 left-4 z-50 p-2  text-white md:hidden"
                onClick={() => setIsNavOpen(!isNavOpen)}
                style={{
                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                    opacity: Math.max(0.5, 1 - window.scrollY / 200) // Fade effect based on scroll position
                }}
            >
                <FaBars size={20} />
            </button>
                {isNavOpen && ( // Conditional rendering of the nav for mobile
                    <nav className="fixed top-0 left-0 h-full w-2/3 bg-black z-20 transition-transform transform duration-300 ease-in-out" style={{ transform: isNavOpen ? 'translateX(0)' : 'translateX(-100%)' }}>
                      
                      
                      
                      <button 
                            className="absolute top-4 right-4 text-2xl text-white" 
                            onClick={() => setIsNavOpen(false)}
                        >
                            &times; {/* Close button */}
                        </button>
                        <div className="flex flex-col items-center mx-8 mt-2">
                            <img 
                                src={EMLogo} 
                                alt="ElectoMate Logo" 
                                className="mb-4"  // Reduced margin-bottom to move it up
                                style={{ maxWidth: '50px', height: 'auto' }} 
                            />


                            <div className="text-white cursor-pointer hover:underline text-lg my-4 font-bold" 
                                onClick={() => { 
                                    smoothScrollTo(
                                        window.innerWidth < 768 ? 'home-section-mobile' : 'home-section',
                                        window.innerWidth < 768 ? -300 : 0
                                    ); 
                                    setIsNavOpen(false); 
                                }}>
                                Home
                            </div>

                            <div className="text-white cursor-pointer hover:underline text-lg my-4 font-bold" 
                                onClick={() => { 
                                    smoothScrollTo(
                                        window.innerWidth < 768 ? 'how-it-works-mobile' : 'how-it-works', 
                                        window.innerWidth < 768 ? 300 : 0
                                    ); 
                                    setIsNavOpen(false); 
                                }}>
                                How It Works
                            </div>

                            <div className="text-white cursor-pointer hover:underline text-lg my-4 font-bold" 
                                onClick={() => { 
                                    smoothScrollTo(
                                        window.innerWidth < 768 ? 'Q&A-mobile' : 'Q&A',
                                        window.innerWidth < 768 ? 300 : 0
                                    ); 
                                    setIsNavOpen(false); 
                                }}>
                                Q&A
                            </div>

                            <div className="text-white cursor-pointer hover:underline text-lg my-4 font-bold" 
                                onClick={() => { 
                                    smoothScrollTo(
                                        window.innerWidth < 768 ? 'about-us-mobile' : 'about-us',
                                        window.innerWidth < 768 ? 300 : 0
                                    ); 
                                    setIsNavOpen(false); 
                                }}>
                                About Us
                            </div>

                            <div className="text-white cursor-pointer hover:underline text-lg my-4 font-bold" 
                                onClick={() => { 
                                    smoothScrollTo(
                                        window.innerWidth < 768 ? 'contact-section-mobile' : 'contact-section',
                                        window.innerWidth < 768 ? 300 : 0
                                    ); 
                                    setIsNavOpen(false); 
                                }}>
                                Contact
                            </div>
                        </div>
                    </nav>
                )}
                {/* Horizontal Navbar for Desktop */}
                <nav className="hidden md:flex justify-center space-x-10 font-bold">
                    <div className="text-white cursor-pointer hover:underline" onClick={() => smoothScrollTo('home-section')}>Home</div>
                    <div className="text-white cursor-pointer hover:underline" onClick={() => smoothScrollTo('how-it-works')}>How It Works</div>
                    <div className="text-white cursor-pointer hover:underline" onClick={() => smoothScrollTo('Q&A')}>Q&A</div>
                    <div className="text-white cursor-pointer hover:underline" onClick={() => smoothScrollTo('about-us')}>About Us</div>
                    <div className="text-white cursor-pointer hover:underline" onClick={() => smoothScrollTo('contact-section')}>Contact</div>
                </nav>
            </div>
            

            

            <div id="home-section" className="flex justify-center my-40" style={{ zIndex: 10, position: 'relative' }}>
            <header className='text-center inline-block w-full'>
                <h1 id="home-section-mobile" className='text-center custom-gradient text-5xl md:text-9xl font-extrabold'>
                    Electomate
                </h1>

                {/* Conditional rendering of the texts with fade-in/out effect */}
                <h1
                    className="text-center custom-gradient2 text-base md:text-3xl"
                    style={{ opacity: opacity, transition: 'opacity 1s ease' }} // Apply fade-in/out transition
                >
                    {isFirstTextVisible ? 'Conversational Election Tool' : 'Made with love by people from all over the world'}
                    </h1>
            </header>
               
                
            
            </div>
            


            <div className="relative">
            <div className="absolute w-full text-center top-[850px] md:top-[200px]" style={{ opacity: titleOpacity, transition: 'opacity 0.5s ease', zIndex: 20 }}>

        <h2 className="text-white text-md md:text-2xl font-bold">Rotate the globe and click on a country</h2>
  
</div>
        </div>




            {/* World Map - Interactive globe that allows users to explore different regions */}

            <div
    className="mx-auto   md:mt-0"
    style={{
        transform: `scale(${globeScale})`,
        overflow: 'hidden',
        maxWidth: '1000px',
        maxHeight: '1000px',
        opacity: mapOpacity, // Apply the opacity dynamically
        // transition: scrollFraction > 0 ? 'opacity 0.3s ease' : 'opacity 4s ease', // Smooth opacity transition for fade-in effect and scrolling
        transition: 'opacity 0.3s ease' , // Smooth opacity transition for fade-in effect and scrolling

        marginTop: `${marginTop}px` // Apply the dynamic margin-top

    }}
>

                <div
                    className=""
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onMouseMove={(event) => handleMouseMove(event.nativeEvent)}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    onTouchMove={(event) => handleTouchMove(event.nativeEvent)}
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
                        const isNonClickableCountry = nonClickableCountries.includes(geo.id); // Check if the country is in the non-clickable list
                        return (
                            <Geography
                                key={geo.rsmKey}
                                geography={geo}
                                fill={isImplementedCountry ? "url(#countryGradient)" : "rgba(244, 244, 244, 0.2)"} // Default fill for implemented and non-implemented countries
                                stroke={isImplementedCountry ? "rgba(255, 255, 255, 1)" : "rgba(255, 255, 255, 0.3)"} // Default stroke for implemented and non-implemented countries
                                filter={isImplementedCountry ? "url(#glowEffect)" : "none"} // Add glow effect for implemented countries
                                strokeWidth={isImplementedCountry || isNonClickableCountry ? 0.1 : 0.1} // Adjust this value to reduce the stroke width
                                onMouseEnter={() => {
                                    const { name } = geo.properties; // Access the country name from the 'name' property
                                    setTooltipContent(name);
                                }}
                                onMouseLeave={() => {
                                    setTooltipContent("");
                                }}

                                onClick={() => {
                                            if (isImplementedCountry && !isNonClickableCountry) {
                                            handleCountryClick(geo.id);
                                            }
                                        }}
                                style={{
                                    default: { outline: 'none' },
                                    hover: {
                                        fill: isNonClickableCountry ? "rgb(255, 125, 0, 0.2)" : (isImplementedCountry ? "rgba(8, 228, 8, 0.2)" : "rgba(255, 0, 0, 0.2)"),
                                        stroke: isNonClickableCountry ? "rgb(255, 125, 0, 0.8)" : (isImplementedCountry ? "rgba(5, 255, 5, 0.6)" : "rgba(255, 5, 5, 0.8)"), // Stroke color for hover
                                        strokeWidth: isImplementedCountry || isNonClickableCountry ? 0.5 : 0.5, // Added stroke width for hover effect
                                        filter: isImplementedCountry ? "url(#glowEffect)" : "none" // Add glow effect for implemented countries
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
        ></div>
        </div>
</div>






         

            <div  className="">

            <div className='flex justify-center mb-5 mt-[100px] md:mt-[200px]'>
                    <h1 className='text-xl custom-gradient2 md:text-3xl font-extrabold text-white mt-10' style={{ zIndex: 20 }}>Countries</h1>
                </div>
                <div className="flex justify-center mb-10">
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-x-4 w-[66%]'>
                        
                        <h1 className='text-md font-extrabold text-white text-center '>1. Select a country</h1>
                        <h1 className='text-md font-extrabold text-white text-center '>2. Answer Questions</h1>
                        <h1 className='text-md font-extrabold text-white text-center '>3. Chat with Sources</h1>

                        
                    </div>
                </div>
            </div>
             
            <div className='flex justify-center mt-2 '>
                    <h1 className='text-lmd md:text-xl font-extrabold text-white'>For the European Elections 2024</h1>
                </div>

            <div className="px-2 md:px-6 md:mt-6 mt-4" >
                
                
                <div className="flex justify-center items-center  "style={{  position: 'relative' }}>
               
                <nav className="flex flex-wrap justify-center space-x-4 md:space-x-10 w-[90%] md:w-[66%] text-sm md:text-md">
                    <div className="text-white cursor-pointer hover:underline mb-3" onClick={() => handleCountryClick('276')}>Germany</div>
                    <div className="text-white cursor-pointer hover:underline mb-3" onClick={() => handleCountryClick('250')}>France</div>
                    <div className="text-white cursor-pointer hover:underline mb-3" onClick={() => handleCountryClick('380')}>Italy</div>
                    <div className="text-white cursor-pointer hover:underline mb-3" onClick={() => handleCountryClick('724')}>Spain</div>
                    <div className="text-white cursor-pointer hover:underline mb-3" onClick={() => handleCountryClick('348')}>Hungary</div>
                    <div className="text-white cursor-pointer hover:underline mb-3" onClick={() => handleCountryClick('056')}>Belgium</div>
                    <div className="text-white cursor-pointer hover:underline mb-3" onClick={() => handleCountryClick('040')}>Austria</div>
                    <div className="text-white cursor-pointer hover:underline mb-3" onClick={() => handleCountryClick('616')}>Poland</div>
                    <div className="text-white cursor-pointer hover:underline mb-3" onClick={() => handleCountryClick('100')}>Bulgaria</div>
                
                </nav>
                    </div>
                  
            </div>
                    

            <div className='flex justify-center mt-10 '>
                    <h1 className='text-lmd md:text-xl font-extrabold text-white'>We are currently working on</h1>
                </div>

            <div className="px-2 md:px-6 md:mt-6 mt-4" >
                
                
                <div className="flex justify-center items-center  "style={{  position: 'relative' }}>
               
                <nav className="flex flex-wrap justify-center space-x-4 md:space-x-10 w-[90%] md:w-[66%] text-sm md:text-md">
               
                    <div className="text-white mb-3" >Denmark (soon)</div>
                    <div className="text-white mb-3">United States (soon)</div>
                    <div className="text-white mb-3">Brazil (soon)</div>
                    <div className="text-white mb-3">Ghana (soon)</div>
                    <div className="text-white mb-3">Switzerland (soon)</div>
                </nav>
                    </div>
                  
            </div>
                    



             


        




            <div id="how-it-works" className="h-10 mt-10">
            </div>

            <div className="bg-black mt-12">
                
                <div id="how-it-works-mobile"  className='flex justify-center '>
                    <h1 className='text-4xl md:text-7xl font-extrabold mb-10  custom-gradient33'>How It Works</h1>
                </div>
                <div className="text-justify text-white w-[66%] mx-auto ">
                    {/* <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                        Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris 
                        nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in 
                        reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla 
                        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in 
                        culpa qui officia deserunt mollit anim id est laborum.
                    </p> */}
                </div>


                

                <div className='flex justify-center'>
                <div className='w-[80%] md:w-[66%]  '>
                    <h1 className='text-2xl text-left md:text-5xl font-extrabold text-white mb-10 md:mt-10 custom-gradient33'>Features</h1>
                </div>
                </div>
               
                <div className='flex justify-center'>
                <div className='w-[90%] md:w-[66%] '>
                <div className=" mx-5 md:mx-0 md:w-1/2 text-left">

                   
                    <ul className="list-none space-y-3">
                        <li className="flex items-center text-md md:text-lg">
                            <span className="text-xl md:text-3xl font-extrabold mr-4">1.</span>
                            <span> Party ranking according to overlap with answers</span>
                        </li>
                        <li className="flex items-center text-md md:text-lg">
                            <span className="text-xl md:text-3xl font-extrabold mr-4">2.</span>
                            <span>Immediate chat function</span>
                        </li>
                        <li className="flex items-center text-md md:text-lg">
                            <span className="text-xl md:text-3xl font-extrabold mr-4">3.</span>
                            <span>Accurate sources</span>
                        </li>
                        <li className="flex items-center text-md md:text-lg">
                            <span className="text-xl md:text-3xl font-extrabold mr-4">4.</span>
                            <span>Multi-language support (english & original country language)</span>
                        </li>
                        <li className="flex items-start text-md md:text-lg">
                            <span className="text-xl md:text-3xl font-extrabold mr-4 align-top self-start">5.</span>
                            <span>Coming features: AI voice calls, interactive graphs, "Perplexity for elections"-sourcing option, more countries, select language style: "12yo child, professor, etc. "</span>
                        </li>
                    </ul>
                </div>
                </div>
                </div>
              



                <div className='flex justify-center'>
                <div className='w-[80%] md:w-[66%]  '>
                    <h1 className='text-2xl text-left md:text-right md:text-5xl font-extrabold text-white mb-10 mt-20 custom-gradient33'>Architecture</h1>
                </div>
                </div>
               
                <div className='flex justify-center'>
                <div className='w-[90%] md:w-[66%] '>
                <div className='flex justify-end'>
                <div className="w-[90%] md:w-1/2 text-left mx-5 md:mx-0">

                <ul className="list-none space-y-3">
                   
                    <li className="flex items-center text-md md:text-lg">
                                    <FaTools className="text-2xl mr-4 " />
                                    <span>Sophisticated RAG Pipeline:</span>
                                </li>



                        <li className="flex items-center text-md md:text-lg">
                            <span className="text-xl md:text-3xl font-extrabold mr-4">1.</span>
                            <span>Query: semantic vector embedding</span>
                        </li>
                        <li className="flex items-center text-md md:text-lg">
                            <span className="text-xl md:text-3xl font-extrabold mr-4">2.</span>
                            <span>Vector search: Relevant excerpts from party manifestos (database) are selected</span>
                        </li>
                        <li className="flex items-center text-md md:text-lg">
                            <span className="text-xl md:text-3xl font-extrabold mr-4">3.</span>
                            <span>Context & User Question: LLM</span>
                        </li>
                        <li className="flex items-center text-md md:text-lg">
                            <span className="text-xl md:text-3xl font-extrabold mr-4">4.</span>
                            <span>Answer</span>
                        </li>
                    </ul>
                </div>
                </div>
                </div>
                </div>
              






                <div className='flex justify-center'>
                <div className='w-[80%] md:w-[66%]  '>
                    <h1 className='text-2xl text-left md:text-right md:text-5xl  font-extrabold text-white  mt-20 custom-gradient33'>Our Goals & Safety</h1>
                </div>
                </div>
               
                <div className='flex justify-center'>
                <div className='w-[90%] md:w-[66%]'>
                    <div className="w-[90%] md: w-[70%] text-left mx-5 md:mx-0">
                        <div className='flex '>
                            <h1 className='text-xl md:text-2xl text-left font-extrabold mb-4 mt-5 md:mt-14 custom-gradient33'>Goals</h1>
                        </div>
                        <div className="">
                            <ul className="list-none space-y-4">
                                <li className="flex items-center text-md md:text-lg">
                                    <FaInfoCircle className="text-2xl md:text-2xl mr-4" /> {/* 5xl for mobile, 2xl for desktop */}
                                    <span>Help voters build informed opinions.</span>
                                </li>
                                <li className="flex items-center text-md md:text-lg">
                                    <FaComments className="text-2xl md:text-2xl mr-4" /> {/* 5xl for mobile, 2xl for desktop */}
                                    <span>Find the parties best-aligned with their views.</span>
                                </li>
                                <li className="flex items-center text-md md:text-lg">
                                    <FaChartBar className="text-2xl md:text-2xl mr-4" /> {/* 5xl for mobile, 2xl for desktop */}
                                    <span>Make data about elections easy & accessible.</span>
                                </li>
                                <li className="flex items-center text-md md:text-lg">
                                    <FaArrowUp className="text-3xl md:text-2xl mr-4" /> {/* 5xl for mobile, 2xl for desktop */}
                                    <span>Reduce political apathy, misinformation and increase voter turnout.</span>
                                </li>
                            </ul>
                        </div>

                        <div className='flex mt-14'>
                            <h1 className='text-xl md:text-2xl text-left font-extrabold mb-4 mt-5 md:mt-14 mb-4 custom-gradient33'>Safety & Privacy</h1>
                        </div>
                        <div className="">
                            <ul className="list-none space-y-4">
                                <li className="flex items-center text-md">
                                    <FaLock className="text-5xl md:text-2xl mr-4" />
                                    <span>Sources are exclusively the official party programs and party websites</span>
                                </li>
                                <ul className="list-disc ml-20 space-y-2 ">
                                    <li className="text-md">Retrieval Augmented Generation (RAG) pipeline for source control and accuracy</li>
                                    <li className="text-md">We do not track or store any user data</li>
                                    <li className="text-md">Open source code on GitHub</li>
                                </ul>
                                <li className="flex items-center text-md">
                                    <FaLock className="text-5xl md:text-2xl mr-4" />
                                    <span>Precise and restrictive prompt engineering in the API request for political neutrality</span>
                                </li>
                                <li className="flex items-center text-md">
                                    <FaLock className="text-2xl md:text-2xl mr-4" />
                                    <span>We are an independent non-profit</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                </div>
                


                <div className='flex justify-center'>
                <div className='w-[80%] md:w-[66%] '>
                    <h1 className='text-2xl md:text-5xl text-left md:text-right font-extrabold text-white mt-20 mb-5 custom-gradient33'>Performance </h1>
                </div>
                </div>
               
                <div className='flex justify-center'>
                <div className='w-[80%]  md:w-[66%] '>
                <div className='flex   justify-center md:justify-end'>
                <div className="w-full md:w-1/2 text-left md:text-right">

                <h2 className=' textl-xl md:text-4xl text-left md:text-right font-bold text-white mb-4 custom-gradient33'>Abstract</h2>
                <p className="text-justify text-white text-sm md:text-md">
               
                In the past decade Voting Advice Applications (VAAs) have become an established source of information for elections in 
                many countries around the world. With the rise of generative AI, these simple and deterministic VAAs are facing a potential 
                extension with probabilistic and more complex competitors. Moreover, AI models show clear political tendencies when applied to 
                questions of conventional VAAs. How does this affect the output of LLMs in queries related to voting advice and election information, 
                and how can we mitigate that bias?
                <br />
                This research performs a risk analysis and provides a new benchmark for large language models (LLMs) in the realm of election information and VAAs. 
                Specific subjects of exploration are bias, hallucination, predictive accuracy of election pledges and party statements. Key methodologies include sentiment 
                analysis and examination of the influence of factors, such as the political party, topic, model choice, country, and context, on the accuracy of Retrieval 
                Augmented Generation (RAG). Various sourcing techniques, such as manifestos, domain- restricted searches, unrestricted searches, and YouTube videos provide 
                contexts of controllability. Additionally, a synthetically upscaled hybrid dataset is created based on official party and candidate documents and statements is used as an 
                instruction fine-tuning (IFT) dataset. A thorough comparison of a newly one-party fine-tuned model (+ RAG) and our RAG implementation is carried out. Lastly, the study compares 
                AI-generated predictions of party answers with actual election pledges and past legislative resolutions, providing an analysis of the improvements brought by AI-driven VAAs over traditional VAAs.
                <br /><br />
                The initial findings show very low accuracy (40% - 75%, depending on model and party) of state-of-the-art models in the predictions of party pledges, 
                with roughly 50% of the misses being the exact opposite of the party stances. The research on context extension shows a significant increase in both prediction
                accuracy and reasoning. This examination framework is provided in the form of a new benchmark that reflects predictive power on election pledges, reasons, and 
                political bias. The fine-tuned model shows little to significant increase in accuracy and decrease in bias. By providing a statistical framework for evaluating 
                LLM behaviour in political issues, we enhance the safety and reliability of AI in and outside of election times.


 </p>

{/* 
                    This research explores the potential of AI-driven Voting Advice Applications (AIVAAs). The study discusses the challenges and risks associated with using AI in this domain, such as bias, misinformation, and the reliability of sourcing techniques. Key methodologies include bias testing, sentiment analysis, and the examination of how the accuracy of Retrieval Augmented Generation (RAG) driven AIVAAs is influenced by factors such as the political party, topic, AI model and different context. A detailed comparison is provided of various sourcing techniques, including the use of exclusively manifestos, domain-restricted searches, unrestricted searches, and YouTube videos. The research also evaluates the predictive accuracy of different AI models (e.g., GPT-4o, Claude 3.5 Sonnet, Gemini Pro 2m, Llama 3.1 405B, Grok) across various sourcing techniques, providing a comprehensive analysis of their effectiveness.
                    <br /><br />
                    Additionally, the study compares the AI-generated predictions of party answers with actual election pledges and past legislative resolutions, assessing how well AI VAAs align with official party positions provided to traditional VAAs when using different sourcing methods.
                </p> */}
                <p className="italic text-white mt-4">Performance report will be published soon. </p>

                
                </div>
                </div>
                </div>
                </div>
              




             {/* Q&A SECTION */}
            </div>
            <div id="Q&A" className="h-10 mt-10">
            </div>


            <div className='flex justify-center'>
                <h1 id="Q&A-mobile" className='text-4xl md:text-7xl font-extrabold mb-10  custom-gradient55'>Q&A</h1>
            </div>

            <div className='flex justify-center'>

                
                <div className='md:w-[66%] w-[80%] bg-black  '>
                    <   FAQSection />
                </div>
            </div>




             {/* ABOUT US SECTION */}
            <div id="about-us" className="h-10 mt-10">
            </div>

            <div className="bg-black mt-12">
                <div className='flex justify-center '>
                    <h1 id="about-us-mobile" className='text-4xl md:text-7xl font-extrabold mb-10 custom-gradient44'>About Us</h1>
                </div>
                <div className="text-justify text-white md:w-[66%] w-[80%] mx-auto ">
                    <p>
                        This project is worked on and is supervised by over 20 researchers and students at ETH Zürich, Hochschule Sankt Gallen, and Universität Zürich. 
                        Many of us connected through Model United Nations, driven by a strong desire to support democracy 
                        through the power of technology.Our mission is to provide accessible and reliable information on politics in and outside of elections.
                    </p>
                </div>

                <div className="text-justify text-white  mt-10">
                    <TEAMSECTION />
                </div>

          

             





            </div>

            <div id="contact-section" className="bg-black mt-24">
            <div className='flex justify-center '>
          <h1 id="contact-section-mobile"  className='text-4xl md:text-7xl font-extrabold text-white mb-10 mt-10 custom-gradient66'>Contact Us</h1>
        </div>
                {/* <InterestForm /> */}

            <div className="text-center text-white mt-4">
                <p>Contact us on info@electomate.com</p>
            </div>

            </div>

            <div className='flex justify-center '>
                <h1 className='text-2xl md:text-3xl font-extrabold text-white mb-0 mt-32'>Partners & Sponsors</h1>
            </div>

            <div className="text-justify text-white px-4 w-[90%] h-auto mx-auto mb-0 md:mb-20 ">
                <div className="flex justify-center mt-12 flex-wrap lg:flex-nowrap md:space-x-12 space-x-8 ">
                    <img src={ETHLOGO} className="h-[35px] md:h-[70px] w-auto mb-5 object-contain" />
                    <img src={MICROSOFTLOGO} className="h-[35px] md:h-[70px] w-auto mb-5 object-contain" />
                    <img src={WACCELOGO} className="h-[35px] md:h-[70px] w-auto mb-5 object-contain" />
                    <img src={HSGLOGO} className="h-[35px] md:h-[70px] w-auto mb-5 object-contain" />
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
  const [openSection, setOpenSection] = useState(null);

    const toggleSection = (section) => {
        setOpenSection(openSection === section ? null : section);
    };

    
    return (
        <div className="bg-black text-white">
            <div className="mx-auto">
                <div className="border-b border-gray-700">
                    <button className="flex justify-between w-full py-4 text-left" onClick={() => toggleSection('safety')}>
                        <span>How do you ensure safety and privacy?</span>
                        <span>{openSection === 'safety' ? '-' : '+'}</span>
                    </button>
                    {openSection === 'safety' && (
                        <p className="text-justify" style={{ marginBottom: '20px' }}>
                            We are very aware of the risks of such a tool in the context of elections. All sources are exclusively from official party programs and websites. We use a Retrieval Augmented Generation (RAG) pipeline to ensure high source accuracy. Additionally, we do not track or store any user data, and our code is open-source on GitHub for full transparency.
                        </p>
                    )}
                </div>
                <div className="border-b border-gray-700">
                    <button className="flex justify-between w-full py-4 text-left" onClick={() => toggleSection('accuracy')}>
                        <span>How do you ensure the accuracy of the information?</span>
                        <span>{openSection === 'accuracy' ? '-' : '+'}</span>
                    </button>
                    {openSection === 'accuracy' && (
                        <p className="text-justify" style={{ marginBottom: '20px' }}>
                            We ensure accuracy by using the RAG pipeline, which allows for precise control over sources and their accuracy. The pipeline is designed to retrieve relevant information directly from official party programs and manifestos, reducing the risk of misinformation and always providing reliable sources.
                        </p>
                    )}
                </div>
                <div className="border-b border-gray-700">
                    <button className="flex justify-between w-full py-4 text-left" onClick={() => toggleSection('neutrality')}>
                        <span>How do you maintain political neutrality?</span>
                        <span>{openSection === 'neutrality' ? '-' : '+'}</span>
                    </button>
                    {openSection === 'neutrality' && (
                        <p className="text-justify" style={{ marginBottom: '20px' }}>
                            Political neutrality is maintained through precise and restrictive prompt engineering in our API requests. We only use official sources and strictly avoid any subjective interpretations, ensuring that the information provided is unbiased and neutral. See more about the prompts we use on our <span style={{ color: 'orange' }}>GitHub repository</span>.
                        </p>
                    )}
                </div>
                <div className="border-b border-gray-700">
                    <button className="flex justify-between w-full py-4 text-left" onClick={() => toggleSection('features')}>
                        <span>What are the main features of Electomate?</span>
                        <span>{openSection === 'features' ? '-' : '+'}</span>
                    </button>
                    {openSection === 'features' && (
                        <p className="text-justify" style={{ marginBottom: '20px' }}>
                            Electomate offers several key features including AI-powered chat with party programs, Party rankings according to overlap with answers, and referencing sources. In future we will add overlap graphs (spider, grid plot) and different sourcing options.
                        </p>
                    )}
                </div>
                <div className="border-b border-gray-700">
                    <button className="flex justify-between w-full py-4 text-left" onClick={() => toggleSection('sources')}>
                        <span>What sources does Electomate use?</span>
                        <span>{openSection === 'sources' ? '-' : '+'}</span>
                    </button>
                    {openSection === 'sources' && (
                        <p className="text-justify" style={{ marginBottom: '20px' }}>
                            Electomate exclusively uses official party programs and party websites as its sources. This ensures that the information provided is reliable, up-to-date, and directly from the source.
                        </p>
                    )}
                </div>
                <div className="border-b border-gray-700">
                    <button className="flex justify-between w-full py-4 text-left" onClick={() => toggleSection('longTerm')}>
                        <span>What are the long-term goals for Electomate?</span>
                        <span>{openSection === 'longTerm' ? '-' : '+'}</span>
                    </button>
                    {openSection === 'longTerm' && (
                        <p className="text-justify" style={{ marginBottom: '20px' }}>
                         Our long-term goals include adapting the tool for elections globally and integrating AI-powered chat and voice functionalities into institutional websites, such as VAAs and election offices. This will make interactions more efficient and user-friendly. We are building a global network of contributors committed to enhancing the transparency and accessibility of democracy. These contributors supply election data and connect us with local institutions, election officers, and government representatives.                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
