import React from 'react';

const OpenSourceSection = () => {
  return (
    <section className="bg-gray-100 py-12">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Open Source Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Replace the placeholders with your open-source project components */}
          <OpenSourceProjectCard title="Project 1" description="Description of project 1" />
          <OpenSourceProjectCard title="Project 2" description="Description of project 2" />
          <OpenSourceProjectCard title="Project 3" description="Description of project 3" />
        </div>
      </div>
    </section>
  );
};

const OpenSourceProjectCard = ({ title, description }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-700">{description}</p>
    </div>
  );
};

export default OpenSourceSection;
