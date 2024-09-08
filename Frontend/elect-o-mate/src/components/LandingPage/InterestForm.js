import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import './Tailwind.css';

// Dropdown Component
const Dropdown = ({ options, label, selectedOption, onSelect, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Toggle dropdown open/close
  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  // Handle option selection
  const handleOptionClick = (option) => {
    onSelect(option);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div 
      className={`relative ${className}`} 
      ref={dropdownRef}
    >
      <div 
        className={`w-full bg-transparent text-white border border-white rounded-3xl py-2 px-5 focus:outline-none hover:border-opacity-100 transition-all duration-300 flex items-center justify-between cursor-pointer`}
        onClick={handleToggle}
      >
        <span className="truncate text-left text-white opacity-50">
          {selectedOption || label}
        </span>
        <ChevronDown 
          className={`w-4 h-4 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </div>
      {isOpen && (
        <div 
          className="absolute w-full mt-2 bg-black border border-white rounded-3xl shadow-lg overflow-hidden z-10"
        >
          <ul className="dropdown-list">
            {options.map((option, index) => (
              <li 
                key={index} 
                className="px-5 py-3 hover:bg-gray-600 hover:bg-opacity-70 cursor-pointer transition-colors duration-200 truncate hover:text-green-500 text-left"
                onClick={() => handleOptionClick(option)}
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// Main InterestForm Component
export default function InterestForm() {
  const [formType, setFormType] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [hoveredInput, setHoveredInput] = useState(null); // State for individual input hover
  const [selectedRole, setSelectedRole] = useState("Select Role");

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  // Handle form close
  const handleClose = () => {
    setFormType(null);
    setSubmitted(false);
  };

  return (
    <div className=''>
      <div className="bg-black ">
       
        <div className="text-justify text-white md:w-[66%] w-[80%] mx-auto pb-10">
          <p>
            We are collaborating with various partners and organizations to increase the accessibility of 
            fast accurate information on politics and elections to every country. 
            If you are interested in joining us or becoming a partner, please fill out the form below. 
            We are specifically looking for experts in the field of elections and political science to 
            join our team. If you want to help in the implementation of your country or commun, hre is the chance to have some impact. 
            <br /><br />
            We are also looking for Partenrs on the institutional level to collaborate on adirect integration of our tool on existing VAAs. 
            As a politically independent organization with strong technical backing fro ETH students and experts, we provide a platfrom usable by any country and goverment, that accept political symmetry.
          </p>
        </div>
      </div>

      <div className="flex justify-center items-center">
        <div className="w-[80%] md:w-[66.67%] mx-auto">
          <div className="flex flex-wrap items-center justify-center space-x-4 text-xs md:text-base"> {/* Added text size adjustment for mobile */}
            <button
              onClick={() => setFormType('join')}
              style={formType === 'join' ? { ...buttonStyle, border: '1px solid green' } : buttonStyle}
            >
              Join Team
            </button>
            <button
              onClick={() => setFormType('interest')}
              style={formType === 'interest' ? { ...buttonStyle, border: '1px solid green' } : buttonStyle}
            >
              Join as Contributor
            </button>
            <button
              onClick={() => setFormType('partner')}
              style={formType === 'partner' ? { ...buttonStyle, border: '1px solid green' } : buttonStyle}
            >
              Become Partner
            </button>
          </div>
        </div>
        </div>



        
        <div className="flex justify-center items-center w-full">
  {formType && !submitted && (
    <form onSubmit={handleSubmit} className="w-[90%]  lg:w-1/2 space-y-4 bg-transparent rounded-3xl p-5">
      {formType === 'join' && (
        <>
          <input 
            placeholder="Name" 
            className="w-full bg-transparent text-white border border-white rounded-3xl py-2 px-5 focus:outline-none focus:border-white hover:border-opacity-100 transition-all duration-300"
          />
          <input 
            placeholder="Email Address" 
            className="w-full bg-transparent text-white border border-white rounded-3xl py-2 px-5 focus:outline-none focus:border-white hover:border-opacity-100 transition-all duration-300"
          />
          <input 
            placeholder="LinkedIn/Twitter" 
            className="w-full bg-transparent text-white border border-white rounded-3xl py-2 px-5 focus:outline-none focus:border-white hover:border-opacity-100 transition-all duration-300"
          />
          <Dropdown 
            label="Select Role" 
            options={["Frontend Engineer", "Backend Engineer", "PR Marketing", "Operations", "Expert in Elections and Political Science"]}
            selectedOption={selectedRole}
            onSelect={setSelectedRole}
            className="w-full"
          />
                    <textarea 
            placeholder="Comment" 
            className="w-full bg-transparent text-white border border-white rounded-3xl py-2 px-5 h-24 focus:outline-none focus:border-white hover:border-opacity-100 transition-all duration-300"
          />
        </>
      )}
      {formType === 'partner' && (
        <>
          <input 
            placeholder="Name" 
            className="w-full bg-transparent text-white border border-white rounded-3xl py-2 px-5 focus:outline-none focus:border-white hover:border-opacity-100 transition-all duration-300"
          />
          <input 
            placeholder="Email Address" 
            className="w-full bg-transparent text-white border border-white rounded-3xl py-2 px-5 focus:outline-none focus:border-white hover:border-opacity-100 transition-all duration-300"
          />
          <input 
            placeholder="Organization" 
            className="w-full bg-transparent text-white border border-white rounded-3xl py-2 px-5 focus:outline-none focus:border-white hover:border-opacity-100 transition-all duration-300"
          />
          <input 
            placeholder="Website/LinkedIn/Twitter" 
            className="w-full bg-transparent text-white border border-white rounded-3xl py-2 px-5 focus:outline-none focus:border-white hover:border-opacity-100 transition-all duration-300"
          />
          <textarea 
            placeholder="Comment" 
            className="w-full bg-transparent text-white border border-white rounded-3xl py-2 px-5 h-24 focus:outline-none focus:border-white hover:border-opacity-100 transition-all duration-300"
          />
        </>
      )}
      {formType === 'interest' && (
        <>
          <input 
            placeholder="Name" 
            className="w-full bg-transparent text-white border border-white rounded-3xl py-2 px-5 focus:outline-none focus:border-white hover:border-opacity-100 transition-all duration-300"
          />
          <input 
            placeholder="Email Address" 
            className="w-full bg-transparent text-white border border-white rounded-3xl py-2 px-5 focus:outline-none focus:border-white hover:border-opacity-100 transition-all duration-300"
          />
          <input 
            placeholder="LinkedIn/Twitter" 
            className="w-full bg-transparent text-white border border-white rounded-3xl py-2 px-5 focus:outline-none focus:border-white hover:border-opacity-100 transition-all duration-300"
          />
          <input 
            placeholder="Country of Interest" 
            className="w-full bg-transparent text-white border border-white rounded-3xl py-2 px-5 focus:outline-none focus:border-white hover:border-opacity-100 transition-all duration-300"
          />
          <textarea 
            placeholder="Comment" 
            className="w-full bg-transparent text-white border border-white rounded-3xl py-2 px-5 h-24 focus:outline-none focus:border-white hover:border-opacity-100 transition-all duration-300"
          />
        </>
      )}
      <div className="flex gap-4 justify-start">
        <button type="submit" className="px-4 py-2 bg-transparent text-white border border-green-500 rounded-3xl hover:bg-green-500 hover:bg-opacity-20 transition-all duration-300">
          Submit
        </button>
        <button type="button" onClick={handleClose} className="px-4 py-2 bg-transparent text-white border border-red-500 rounded-3xl hover:bg-red-500 hover:bg-opacity-20 transition-all duration-300">
          Close
        </button>
      </div>
    </form>
  )}

  {submitted && (
    <div className="text-center mt-8 bg-transparent text-white border border-white rounded-3xl p-5">
      <p className="mb-4">Thanks for reaching out to us!</p>
      <button onClick={handleClose} className="px-4 py-2 bg-transparent text-white border border-red-500 rounded-3xl hover:bg-red-500 hover:bg-opacity-20 transition-all duration-300">
        Close
      </button>
    </div>
  )}
</div>




    </div>
  );
}

// Styles for buttons and form elements
const buttonStyle = {
  backgroundColor: 'transparent',
  color: 'white',
  border: '1px solid white',
  borderRadius: '1.5rem',
  padding: '10px 20px',
  margin: '10px',
  cursor: 'pointer',
  transition: 'background-color 0.3s',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundColor: 'transparent',
  borderRadius: '1.5rem',
  padding: '20px',
};

const getInputStyle = (isHovered) => ({
  backgroundColor: 'transparent',
  color: 'white',
  border: `1px solid ${isHovered ? 'white' : 'rgba(255, 255, 255, 1)'}`, // Change stroke opacity on hover
  borderRadius: '1.5rem',
  padding: '10px 10px 10px 20px', // Added left padding to move placeholder text to the right
  margin: '10px 0',
  width: '100%',
  opacity: 1,
  transition: 'background-color 0.3s',
});

const submitButtonStyle = {
  backgroundColor: 'transparent',
  color: 'white',
  border: '1px solid green',
  borderRadius: '1.5rem',
  padding: '10px 20px',
  cursor: 'pointer',
  marginTop: '10px',
};

const thankYouStyle = {
  backgroundColor: 'transparent',
  color: 'white',
  border: '1px solid white',
  borderRadius: '1.5rem',
  padding: '20px',
  marginTop: '20px',
};

const closeButtonStyle = {
  backgroundColor: 'transparent',
  color: 'white',
  border: '1px solid red',
  borderRadius: '1.5rem',
  padding: '10px 20px',
  cursor: 'pointer',
  marginTop: '10px',
};

const closeButtonStyle2 = {
  backgroundColor: 'transparent',
  color: 'white',
  border: '1px solid red',
  borderRadius: '1.5rem',
  padding: '5px 10px',
  cursor: 'pointer',
  marginTop: '10px',
};
