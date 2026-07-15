import { useState, useEffect } from 'react';

const LOGO_PATH = "/images/logo/logo.png";

interface LogoProps {
  className?: string;
  fallbackSizeClass?: string;
  style?: React.CSSProperties;
}

export default function Logo({ className = "h-[32px] md:h-[42px]", fallbackSizeClass = "w-9 h-9 text-xs", style }: LogoProps) {
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    console.log("Loading logo:", LOGO_PATH);
  }, []);

  return (
    <div className="flex items-center justify-center p-0 m-0" id="logo-root-container">
      {!logoError ? (
        <img
          src={LOGO_PATH}
          alt="Dreamy Vacations"
          onError={() => setLogoError(true)}
          className={`${className} w-auto object-contain block p-0 m-0`}
          style={{
            objectFit: 'contain',
            filter: 'brightness(0) invert(1)',
            opacity: 0.90,
            ...style
          }}
          referrerPolicy="no-referrer"
          id="logo-image-element"
        />
      ) : (
        <div 
          className={`${fallbackSizeClass} rounded bg-[#6b5b4b] flex items-center justify-center text-[#e2d7c5] font-display font-semibold select-none shadow-sm`}
          id="logo-fallback-badge"
        >
          <span>DV</span>
        </div>
      )}
    </div>
  );
}
