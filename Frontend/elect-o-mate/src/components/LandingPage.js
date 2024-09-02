import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography, Graticule } from 'react-simple-maps';
import { Tooltip } from 'react-tooltip';
import InterestForm from './InterestFrom';
import Footer from './Footer';
import ETHLOGO from './../pictures/ETH_SPH_LogoWhite.png'; // Import this icon to @mui
import MICROSOFTLOGO from './../pictures/Microsoft-for-StartupsLogo.png';


const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
const implementedCountries = ['040', '056', '100', '276', '724', '250', '348', '380', '616', '840', '076', '288', '756'];

const LandingPage = ({ onButtonClick }) => {
    const [rotation, setRotation] = useState([-20, -10, 0]); // Adjust rotation to match your desired view
    const [isDragging, setIsDragging] = useState(false);
    const [tooltipContent, setTooltipContent] = useState("");

    const handleMouseDown = () => {
        setIsDragging(true);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (event) => {
        if (isDragging) {
            const { movementX, movementY } = event;
            setRotation((prevRotation) => [
                prevRotation[0] + movementX * 0.1,
                prevRotation[1] - movementY * 0.1,
                prevRotation[2],
            ]);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="bg-transparent p-6 ">
                <nav>
                    <div className="flex justify-center">
                        <div className="flex space-x-32">
                            <div className="text-white">Home</div>
                            <div className="text-white">How It Works</div>
                            <div className="text-white">About Us</div>
                            <div className="text-white">Contact</div>
                        </div>
                    </div>
                </nav>
            </div>

            <div className='flex justify-center my-40'>
                <div className='text-center text-whiteinline-block '>
                    <h1 className='text-6xl md:text-9xl font-extrabold text-white'>Electomate</h1>
                    <h1 className='text-6xl md:text-3xl '>Conversational Voting Advice Application</h1>
                    <h1 className='text-xs md:text-2xl'>Select the country:</h1>
                </div>
            </div>

            {/* World Map - Interactive globe that allows users to explore different regions */}
            <div
                className="mt-[-10%]"
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onMouseMove={(event) => handleMouseMove(event.nativeEvent)}
            >
                <ComposableMap
                    projection="geoOrthographic"
                    projectionConfig={{
                        rotate: rotation,
                        scale: 400,
                        center: [0, 30]  // This shifts the globe down by 30 degrees latitude
                    }}
                    width={800}
                    height={500}
                >
                    <Graticule stroke="rgba(234, 234, 236, 0.1)"/>

                    <Geographies geography={geoUrl}>
                        {({ geographies }) =>
                            geographies.map((geo) => {
                                const isImplementedCountry = implementedCountries.includes(geo.id); // Check if the country is in the ImplementedCountries array
                                return (
                                    <Geography
                                        key={geo.rsmKey}
                                        geography={geo}
                                        fill={isImplementedCountry ? "rgba(100, 184, 100, 0.8)" : "rgba(244, 244, 244, 0.1)"} // Implemented for specified countries, default color otherwise
                                        stroke={isImplementedCountry ? "rgba(205, 205, 205, 1)" : "rgba(255, 255, 255, 0.3)"} // Transparent for implemented countries, 0.3 opacity for others
                                        strokeWidth={isImplementedCountry ? 0.7 : 0.1}// Adjust this value to reduce the stroke width

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
                                            hover: { fill: isImplementedCountry ? "rgba(0, 128, 0, 0.5)" : "rgba(255, 0, 0, 0.5)", outline: 'none' }, // Green (rgba) for implemented countries, red (rgba) for others
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
            </div>


            {/* Button to navigate to the main screen */}
            <div className="flex justify-center mb-10 mt-10">
                <button
                    onClick={onButtonClick}
                    className="bg-[rgb(0,128,0)] text-white px-4 py-2 rounded-3xl"
                >
                    Try out for EU-Elections
                </button>
            </div>

            <div className="bg-black ">
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
            </div>

            <FAQSection />

            <div className="bg-black ">
                <div className='flex justify-center '>
                    <h1 className='text-6xl md:text-7xl font-extrabold text-white mb-10 mt-10'>About Us</h1>
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

            <div className="bg-black pb-20">
               


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
