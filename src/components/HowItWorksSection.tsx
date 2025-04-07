
import React from 'react';
import { FileSearch, Database, Code, Shield } from 'lucide-react';
import CyberCard from './CyberCard';

const HowItWorksSection = () => {
  const steps = [
    {
      icon: <FileSearch className="h-10 w-10 text-cyber-purple-light" />,
      title: "Input Analysis",
      description: "URL or file is received and preprocessed for scanning"
    },
    {
      icon: <Database className="h-10 w-10 text-cyber-blue" />,
      title: "Threat Database Check",
      description: "Content is checked against known threat signatures"
    },
    {
      icon: <Code className="h-10 w-10 text-cyber-purple" />,
      title: "AI/ML Processing",
      description: "Machine learning models analyze for previously unseen threats"
    },
    {
      icon: <Shield className="h-10 w-10 text-cyber-orange" />,
      title: "Protection Response",
      description: "Results are displayed with actionable security recommendations"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 cyber-grid-bg opacity-5 z-0"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 cyber-text-glow">
            How CATCHit Works
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Our advanced threat detection system operates in four seamless stages
          </p>
        </div>
        
        <div className="relative">
          {/* Process visualization */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 z-0">
            <div className="neon-line"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 relative z-10">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <CyberCard className="h-full">
                  <div className="flex flex-col items-center text-center p-2">
                    {/* Step number indicator */}
                    <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-cyber-dark border border-cyber-purple flex items-center justify-center">
                      <span className="text-cyber-purple-light font-bold">{index + 1}</span>
                    </div>
                    
                    <div className="mb-4 p-3 rounded-full bg-cyber-dark/50 border border-cyber-purple/30">
                      {step.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3 cyber-text-glow">{step.title}</h3>
                    <p className="text-gray-400">{step.description}</p>
                  </div>
                </CyberCard>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
