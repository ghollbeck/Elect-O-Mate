import { useState } from 'react';

export default function InterestForm() {
  const [formType, setFormType] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [hoveredInput, setHoveredInput] = useState(null); // State for individual input hover

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleClose = () => {
    setFormType(null);
    setSubmitted(false);
  };

  return (




    <div className=''>





<div className="bg-black ">
                <div className='flex justify-center '>
                    <h1 className='text-6xl md:text-7xl font-extrabold text-white mb-10 mt-10'>Contact Us</h1>
                </div>
                <div className="text-justify text-white px-4 w-1/2 mx-auto pb-10">
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





    <div style={{ 
      backgroundColor: 'transparent', 
      textAlign: 'center', 
      width: '66.67%', // Cover 2/3 of the page
      margin: '0 auto' // Center the form
    }}>
      <div>
        <button
          onClick={() => setFormType('join')}
          style={formType === 'join' ? { ...buttonStyle,   border: '1px solid green',
          } : buttonStyle}
        >
          Join Team
        </button>
        <button
          onClick={() => setFormType('partner')}
          style={formType === 'partner' ? { ...buttonStyle,   border: '1px solid green',
          } : buttonStyle}
        >
          Become Partner
        </button>
      </div>

      {formType && !submitted && (
        <form onSubmit={handleSubmit} style={formStyle}>
          {formType === 'join' && (
            <>
              <input 
                placeholder="Name" 
                style={getInputStyle(hoveredInput === 'name')} 
                onMouseEnter={() => setHoveredInput('name')} 
                onMouseLeave={() => setHoveredInput(null)} 
              />
              <input 
                placeholder="Email Address" 
                style={getInputStyle(hoveredInput === 'email')} 
                onMouseEnter={() => setHoveredInput('email')} 
                onMouseLeave={() => setHoveredInput(null)} 
              />
              <input 
                placeholder="Linked/Twitter" 
                style={getInputStyle(hoveredInput === 'twitter')} 
                onMouseEnter={() => setHoveredInput('twitter')} 
                onMouseLeave={() => setHoveredInput(null)} 
              />
              <textarea 
                placeholder="Comment" 
                style={{ ...getInputStyle(hoveredInput === 'comment'), height: '100px' }} 
                onMouseEnter={() => setHoveredInput('comment')} 
                onMouseLeave={() => setHoveredInput(null)} 
              />
            </>
          )}
          {formType === 'partner' && (
            <>
              <input 
                placeholder="Name" 
                style={getInputStyle(hoveredInput === 'name')} 
                onMouseEnter={() => setHoveredInput('name')} 
                onMouseLeave={() => setHoveredInput(null)} 
              />
             
              <input 
                placeholder="Email Address" 
                style={getInputStyle(hoveredInput === 'email')} 
                onMouseEnter={() => setHoveredInput('email')} 
                onMouseLeave={() => setHoveredInput(null)} 
              />
               <input 
                placeholder="Organization" 
                style={getInputStyle(hoveredInput === 'organization')} 
                onMouseEnter={() => setHoveredInput('organization')} 
                onMouseLeave={() => setHoveredInput(null)} 
              />
              <input 
                placeholder="Website/LinkedIn/Twitter" 
                style={getInputStyle(hoveredInput === 'website')} 
                onMouseEnter={() => setHoveredInput('website')} 
                onMouseLeave={() => setHoveredInput(null)} 
              />
              <textarea 
                placeholder="Comment" 
                style={{ ...getInputStyle(hoveredInput === 'comment'), height: '100px' }} 
                onMouseEnter={() => setHoveredInput('comment')} 
                onMouseLeave={() => setHoveredInput(null)} 
              />
            </>
          )}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-start' }}> {/* Added flex container for buttons */}
            <button type="submit" style={submitButtonStyle}>
              Submit
            </button>
            <button type="button" onClick={handleClose} style={closeButtonStyle}> {/* Close button */}
              Close
            </button>
          </div>
        </form>
      )}

      {submitted && (
        <div style={{marginTop: 20  }}>
          Thanks for reaching out to us !
          <div style={{ marginTop: 20 }}>
            <button onClick={handleClose} style={closeButtonStyle2}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
    </div>

  );
}

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
  border: `1px solid ${isHovered ? 'white' : 'rgba(255, 255, 255, 0.3)'}`, // Change stroke opacity on hover
  borderRadius: '1.5rem',
  padding: '10px 10px 10px 20px', // Added left padding to move placeholder text to the right
  margin: '10px 0',
  width: '100%',
  opacity: 0.6,
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
  