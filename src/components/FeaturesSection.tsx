
import React from 'react';
import { Shield, Eye, Zap, Bell } from 'lucide-react';
import CyberCard from './CyberCard';

const FeaturesSection = () => {
  const features = [
    {
      icon: <Shield className="h-10 w-10 text-cyber-purple-light" />,
      title: "Real-time Threat Detection",
      description: "Scans and analyzes URLs, files, and web content in real-time before you interact with them."
    },
    {
      icon: <Eye className="h-10 w-10 text-cyber-blue" />,
      title: "Predictive Analysis",
      description: "Uses AI to identify potential threats based on behavior patterns and known attack signatures."
    },
    {
      icon: <Zap className="h-10 w-10 text-cyber-orange" />,
      title: "Instant Response",
      description: "Blocks dangerous content immediately and provides actionable security recommendations."
    },
    {
      icon: <Bell className="h-10 w-10 text-green-500" />,
      title: "Intelligent Alerts",
      description: "Customizable notification system that warns you about security issues without false alarms."
    }
  ];

  return (
    <section id="features" className="py-20 relative">
      <div className="absolute inset-0 bg-cyber-gradient opacity-50 z-0"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 cyber-text-glow">
            Advanced Protection Features
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            CATCHit utilizes cutting-edge technology to keep you safe in an increasingly dangerous digital world.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <CyberCard key={index} className="h-full">
              <div className="flex flex-col items-center text-center p-2">
                <div className="mb-4 p-3 rounded-full bg-cyber-dark border border-cyber-purple/30">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 cyber-text-glow">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            </CyberCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
