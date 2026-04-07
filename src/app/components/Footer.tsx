import { Link, useLocation, useNavigate } from 'react-router';
import { Wallet, Github, Twitter, Mail, Flame } from 'lucide-react';

export function Footer() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleSectionLink = (sectionId: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          const offset = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        const offset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-2xl shadow-lg">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                  Lifestyle Roaster
                </span>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Flame className="w-3 h-3" />
                  Budget Fixer
                </span>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              Get brutally honest financial advice and discover where your money really goes.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <button 
                  onClick={() => handleSectionLink('features')}
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  Features
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleSectionLink('how-it-works')}
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleSectionLink('testimonials')}
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  Testimonials
                </button>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="text-lg mb-4">About</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/analyzer" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Try Analyzer
                </Link>
              </li>
              <li>
                <Link to="/analyzer" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Sample Analysis
                </Link>
              </li>
              <li>
                <button 
                  onClick={() => handleSectionLink('features')}
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  Features & Benefits
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleSectionLink('testimonials')}
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  User Reviews
                </button>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-lg mb-4">Connect</h3>
            <div className="flex gap-4">
              <a
                href="#"
                className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
            <p className="text-gray-400 text-sm mt-4">
              Questions? Reach out to us at{' '}
              <a href="mailto:hello@lifestyleroaster.com" className="text-purple-400 hover:text-purple-300">
                hello@lifestyleroaster.com
              </a>
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2026 Lifestyle Roaster. Built with React, Recharts, and financial reality checks. 
            <br />
            🔒 Your data is processed locally. We don't store or share your financial information.
          </p>
        </div>
      </div>
    </footer>
  );
}