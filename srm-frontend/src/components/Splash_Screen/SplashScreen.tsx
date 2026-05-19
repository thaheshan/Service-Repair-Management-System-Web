import React, { useEffect, useState } from 'react';
import './SplashScreen.scss';

interface SplashScreenProps {
  onComplete?: () => void;
  duration?: number;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ 
  onComplete, 
  duration = 3000 
}) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const steps = 50;
    const increment = 100 / steps;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(prev + increment, 100);
        if (next >= 100) clearInterval(interval);
        return next;
      });
    }, duration / steps);

    const timeout = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) setTimeout(onComplete, 500);
    }, duration);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [duration, onComplete]);

  if (!isVisible && progress === 100) return null;

  return (
    <div className={`splash-screen ${!isVisible ? 'fade-out' : ''}`}>
      <div className="splash-screen__background">
        <div className="splash-screen__pattern"></div>
      </div>
      
      <div className="splash-screen__content">
        <div className="splash-screen__logo">
          <h1 className="splash-screen__title">ALL FIX</h1>
          <p className="splash-screen__subtitle">Service & Repair Hub</p>
          <p className="splash-screen__tagline">Streamline Your Repair Business</p>
        </div>

        <div className="splash-screen__loader">
          <div className="splash-screen__progress-bar">
            <div 
              className="splash-screen__progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="splash-screen__progress-text">{Math.round(progress)}%</span>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
