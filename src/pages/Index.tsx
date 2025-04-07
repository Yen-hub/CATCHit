
import React, { useState } from 'react';
import CyberHeader from '@/components/CyberHeader';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import RecentScansSection from '@/components/RecentScansSection';
import Footer from '@/components/Footer';
import MobileMenu from '@/components/MobileMenu';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toast } = useToast();

  // Show welcome toast on first load
  React.useEffect(() => {
    toast({
      title: "Welcome to CATCHit",
      description: "Your cybersecurity guardian is ready to protect you.",
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <CyberHeader onMenuToggle={() => setMobileMenuOpen(true)} />
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      
      <main className="flex-grow">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <RecentScansSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
