import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto py-10 space-y-12">
      <div className="text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            About <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">FurniGen Studio</span>
          </h2>
          <div className="w-24 h-1.5 bg-amber-500 mx-auto rounded-full"></div>
      </div>

      <div className="prose prose-lg text-slate-600 mx-auto leading-relaxed">
        <p className="mb-6">
          We are a technology-driven initiative on a mission to empower furniture designers and SMEs in Indonesia and beyond. We believe that Artificial Intelligence can bridge the gap between boundless creativity and production efficiency, opening up new opportunities for local creative industries to compete on a global stage.
        </p>
        <p>
          Our platform is designed to simplify the complex design process, providing accurate data—from material details to cost analysis—and inspiring innovation through generative visualizations.
        </p>
      </div>

      <div className="bg-amber-50 border-l-4 border-amber-500 p-8 rounded-r-lg">
          <h3 className="text-xl font-bold text-slate-800 mb-2">Our Vision</h3>
          <p className="text-slate-700 italic text-lg">"To democratize professional furniture design tools, making high-quality, production-ready design accessible to everyone."</p>
      </div>
    </div>
  );
};

export default AboutPage;
