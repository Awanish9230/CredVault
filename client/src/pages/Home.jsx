import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, Award } from 'lucide-react';
import api from '../api/axiosInstance';
import Button from '../components/ui/Button';

const Home = () => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/settings');
        setSettings(res.data.data);
      } catch (error) {
        console.error("Failed to fetch settings", error);
      }
    };
    fetchSettings();
  }, []);

  const heroStyle = settings?.heroBackgroundImage 
    ? {
        backgroundImage: `url(${import.meta.env.VITE_API_URL || 'https://credvault-kyqn.onrender.com'}${settings.heroBackgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : {};


  return (
    <div className="min-h-screen bg-background flex flex-col">
      <nav className="glass-effect sticky top-0 z-50 flex items-center justify-between px-8 py-4">
        <div className="flex items-center gap-2 text-primary font-bold text-2xl">
          <ShieldCheck size={32} />
          <span>CredVault</span>
        </div>
        <div className="flex gap-4">
          <Link to="/verify">
            <Button variant="outline">Verify Certificate</Button>
          </Link>
          <Link to="/login">
            <Button variant="primary">Admin Login</Button>
          </Link>
        </div>
      </nav>

      <main 
        className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 relative overflow-hidden"
        style={heroStyle}
      >

        {settings?.heroBackgroundImage && (
          <div 
            className="absolute inset-0 bg-white backdrop-blur-[2px] z-0 transition-opacity duration-300" 
            style={{ opacity: settings.heroOverlayOpacity ?? 0.7 }}
          ></div>
        )}

        <div className="relative z-10 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-soft text-primary font-medium mb-8 text-sm border border-primary/20">
            <Award size={16} /> The #1 Certificate Generation Platform
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-heading max-w-4xl leading-tight mb-6">
            Issue Trust. <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Verify Instantly.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-body max-w-2xl mb-12">
            A production-grade platform for organizations to issue, manage, and instantly verify digital certificates with beautiful, premium templates.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-24">
            <Link to="/admin/generate">
              <Button className="px-8 py-4 text-lg w-full sm:w-auto">Start Generating</Button>
            </Link>
            <Link to="/verify">
              <Button variant="secondary" className="px-8 py-4 text-lg w-full sm:w-auto flex items-center gap-2">
                 <ShieldCheck size={20} /> Verify Now
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto text-left w-full">
            {[
              { icon: <Zap className="text-accent" size={24}/>, title: 'Lightning Fast', desc: 'Generate and distribute certificates in seconds.' },
              { icon: <ShieldCheck className="text-primary" size={24}/>, title: 'Tamper-Proof', desc: 'Unique IDs and QR codes ensure complete authenticity.' },
              { icon: <Award className="text-secondary" size={24}/>, title: 'Premium Designs', desc: 'Beautiful, modern templates that impress.' }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl border border-border shadow-[0_4px_20px_rgba(15,23,42,0.04)]">
                <div className="w-12 h-12 rounded-xl bg-soft flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-body">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      
      <footer className="border-t border-border py-8 text-center text-body">
        <p>© 2026 CredVault. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
