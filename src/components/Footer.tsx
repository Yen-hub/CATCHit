
import React from 'react';
import { Shield, Twitter, Github, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative pt-16 pb-8 border-t border-cyber-purple/20 overflow-hidden">
      <div className="absolute inset-0 cyber-grid-bg opacity-5 z-0"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-6 w-6 text-cyber-purple" />
              <span className="text-xl font-bold tracking-wider cyber-text-glow">
                CATCH<span className="text-cyber-orange">it</span>
              </span>
            </div>
            <p className="text-gray-400 mb-4">
              Real-time cybersecurity protection for everyone. Stay safe in the digital world.
            </p>
            <div className="flex gap-4">
              {[Twitter, Github, Linkedin, Mail].map((Icon, index) => (
                <a 
                  key={index} 
                  href="#" 
                  className="text-gray-400 hover:text-cyber-purple-light transition-colors"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
          
          {/* Navigation Links */}
          {[
            {
              title: "Product",
              links: ["Features", "How It Works", "Pricing", "Updates"]
            },
            {
              title: "Resources",
              links: ["Documentation", "Help Center", "API", "Blog"]
            },
            {
              title: "Company",
              links: ["About Us", "Careers", "Contact", "Privacy Policy"]
            }
          ].map((section, index) => (
            <div key={index} className="col-span-1">
              <h3 className="text-white font-bold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link}>
                    <a 
                      href="#" 
                      className="text-gray-400 hover:text-cyber-purple-light transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="neon-line mb-6"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; 2025 CATCHit. All rights reserved.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-500 text-sm hover:text-gray-400">Terms</a>
            <a href="#" className="text-gray-500 text-sm hover:text-gray-400">Privacy</a>
            <a href="#" className="text-gray-500 text-sm hover:text-gray-400">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
