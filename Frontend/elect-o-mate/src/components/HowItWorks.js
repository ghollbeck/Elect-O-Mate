import React from 'react';

const HowItWorks = () => {
  return (
    <section className="bg-transparent text-white py-10">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-6">How It Works</h2>

        <p className="mb-6">
          With Elect-O-Mate we have developed an election tool with an AI chatbot integration and are deeply conscious of the ethical implications this entails. Recognizing the potential risks, such as misinformation and bias, inherent in AI technologies, we are committed to transparency and responsibility. Here’s how we’re approaching this:
        </p>
        <ul className="list-disc list-inside mb-6">
          <li className="mb-2"><strong>Transparency:</strong> We Open Source everything</li>
          <li className="mb-2"><strong>Accuracy and Fairness:</strong> Advanced RAG-Pipeline for frontier source accuracy and LLM rule checkers for fairness maximization</li>
          <li className="mb-2"><strong>Ethical Engagement:</strong> We supervised the preferred sources by political experts and openly take part in the global discussion around AI Safety and Alignment</li>
        </ul>
        <p className="mb-6">
          In navigating the intersection of technology and democracy, Wahl-O-Mat pledges to uphold the highest standards, ensuring our AI tools enhance informed opinion building, decision making, decrease political apathy and make the existing tools shorter as well as more accessible.
        </p>
        <div className="flex space-x-4">
          <button className="bg-gray-800 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">
            <i className="fab fa-github"></i> GitHub
          </button>
          <button className="bg-gradient-to-r from-orange-50 to-orange-300 hover:bg-gradient-to-r hover:from-orange-100 hover:to-orange-400 text-black font-bold py-2 px-4 rounded">
            Read Technical Report
          </button>

        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
