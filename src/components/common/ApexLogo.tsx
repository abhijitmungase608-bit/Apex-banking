import React from 'react';
import { Shield } from 'lucide-react';

interface ApexLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  light?: boolean;
}

export const ApexLogo: React.FC<ApexLogoProps> = ({
  className = '',
  size = 'md',
  showTagline = true,
  light = false,
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const titleSizes = {
    sm: 'text-base font-bold',
    md: 'text-xl font-extrabold tracking-tight',
    lg: 'text-2xl font-black tracking-tight',
    xl: 'text-3xl font-black tracking-tight',
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Dynamic Shield Logo Icon */}
      <div className={`relative ${iconSizes[size]} flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#246BFD] to-[#102A56] shadow-premium text-white flex-shrink-0 p-2 overflow-hidden group`}>
        {/* Subtle shine effect */}
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 rounded-2xl pointer-events-none" />
        
        {/* Geometric Winged Apex Triangle */}
        <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
          <path d="M50 15 L85 80 H68 L50 48 L32 80 H15 Z" fill="#FFFFFF" />
          <path d="M50 35 L68 70 H58 L50 54 L42 70 H32 Z" fill="#EAF2FF" opacity="0.9" />
          <polygon points="50,45 55,54 50,63 45,54" fill="#246BFD" />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`${titleSizes[size]} ${light ? 'text-white' : 'text-[#102A56]'}`}>
            APEX
          </span>
          <span className={`${titleSizes[size]} text-[#246BFD]`}>
            BANKING
          </span>
        </div>
        {showTagline && (
          <span className={`text-[10px] font-medium tracking-wider uppercase mt-1 ${light ? 'text-blue-200' : 'text-[#64748B]'}`}>
            Banking Beyond Limits.
          </span>
        )}
      </div>
    </div>
  );
};
