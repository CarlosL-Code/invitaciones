// Adorables ilustraciones vectoriales de Ositos Teddy Bear para Niño, Niña y Neutro

export function BoyTeddy({ className = "w-28 h-28" }) {
  return (
    <div className={`relative inline-block ${className} animate-soft-float`}>
      <svg viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
        {/* Ears */}
        <circle cx="50" cy="55" r="28" fill="#D4A373" />
        <circle cx="50" cy="55" r="17" fill="#8ecae6" />
        <circle cx="150" cy="55" r="28" fill="#D4A373" />
        <circle cx="150" cy="55" r="17" fill="#8ecae6" />

        {/* Head */}
        <circle cx="100" cy="95" r="62" fill="#E6BA95" />
        
        {/* Snout */}
        <ellipse cx="100" cy="115" rx="30" ry="24" fill="#FAEDCD" />
        
        {/* Nose */}
        <ellipse cx="100" cy="106" rx="10" ry="7" fill="#3D405B" />
        <path d="M100 113 V123" stroke="#3D405B" strokeWidth="3" strokeLinecap="round" />
        <path d="M91 123 Q100 131 109 123" stroke="#3D405B" strokeWidth="3" strokeLinecap="round" fill="none" />

        {/* Eyes */}
        <circle cx="78" cy="88" r="6" fill="#2B2D42" />
        <circle cx="76" cy="86" r="2" fill="white" />
        <circle cx="122" cy="88" r="6" fill="#2B2D42" />
        <circle cx="120" cy="86" r="2" fill="white" />

        {/* Cheeks */}
        <circle cx="68" cy="105" r="10" fill="#90e0ef" opacity="0.6" />
        <circle cx="132" cy="105" r="10" fill="#90e0ef" opacity="0.6" />

        {/* Body */}
        <ellipse cx="100" cy="170" rx="48" ry="42" fill="#E6BA95" />
        <ellipse cx="100" cy="172" rx="32" ry="28" fill="#FAEDCD" />

        {/* Boy Bowtie (Celeste) */}
        <g transform="translate(100, 142)">
          <path d="M-18 -10 L0 0 L-18 10 Z" fill="#0077b6" />
          <path d="M18 -10 L0 0 L18 10 Z" fill="#0077b6" />
          <circle cx="0" cy="0" r="6" fill="#90e0ef" />
        </g>

        {/* Paws */}
        <ellipse cx="50" cy="165" rx="16" ry="22" fill="#D4A373" transform="rotate(20 50 165)" />
        <ellipse cx="150" cy="165" rx="16" ry="22" fill="#D4A373" transform="rotate(-20 150 165)" />
        
        {/* Foot pads with heart */}
        <circle cx="50" cy="170" r="8" fill="#8ecae6" />
        <circle cx="150" cy="170" r="8" fill="#8ecae6" />
      </svg>
    </div>
  );
}

export function GirlTeddy({ className = "w-28 h-28" }) {
  return (
    <div className={`relative inline-block ${className} animate-soft-float`}>
      <svg viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
        {/* Ears */}
        <circle cx="50" cy="55" r="28" fill="#D4A373" />
        <circle cx="50" cy="55" r="17" fill="#ffb4a2" />
        <circle cx="150" cy="55" r="28" fill="#D4A373" />
        <circle cx="150" cy="55" r="17" fill="#ffb4a2" />

        {/* Girl Hair Bow (Rosa en la orejita) */}
        <g transform="translate(142, 42) rotate(25)">
          <path d="M-14 -8 L0 0 L-14 8 Z" fill="#e5989b" />
          <path d="M14 -8 L0 0 L14 8 Z" fill="#e5989b" />
          <circle cx="0" cy="0" r="5" fill="#ffb4a2" />
        </g>

        {/* Head */}
        <circle cx="100" cy="95" r="62" fill="#E6BA95" />
        
        {/* Snout */}
        <ellipse cx="100" cy="115" rx="30" ry="24" fill="#FAEDCD" />
        
        {/* Nose */}
        <ellipse cx="100" cy="106" rx="10" ry="7" fill="#3D405B" />
        <path d="M100 113 V123" stroke="#3D405B" strokeWidth="3" strokeLinecap="round" />
        <path d="M91 123 Q100 131 109 123" stroke="#3D405B" strokeWidth="3" strokeLinecap="round" fill="none" />

        {/* Eyes (con pestañitas tiernas) */}
        <circle cx="78" cy="88" r="6" fill="#2B2D42" />
        <circle cx="76" cy="86" r="2" fill="white" />
        <path d="M72 82 L75 85" stroke="#2B2D42" strokeWidth="2" strokeLinecap="round" />
        <path d="M84 82 L81 85" stroke="#2B2D42" strokeWidth="2" strokeLinecap="round" />

        <circle cx="122" cy="88" r="6" fill="#2B2D42" />
        <circle cx="120" cy="86" r="2" fill="white" />
        <path d="M116 82 L119 85" stroke="#2B2D42" strokeWidth="2" strokeLinecap="round" />
        <path d="M128 82 L125 85" stroke="#2B2D42" strokeWidth="2" strokeLinecap="round" />

        {/* Cheeks */}
        <circle cx="68" cy="105" r="10" fill="#f4978e" opacity="0.6" />
        <circle cx="132" cy="105" r="10" fill="#f4978e" opacity="0.6" />

        {/* Body */}
        <ellipse cx="100" cy="170" rx="48" ry="42" fill="#E6BA95" />
        <ellipse cx="100" cy="172" rx="32" ry="28" fill="#FAEDCD" />

        {/* Little dress/bib collar */}
        <path d="M80 144 Q100 156 120 144" stroke="#e5989b" strokeWidth="6" strokeLinecap="round" fill="none" />

        {/* Paws */}
        <ellipse cx="50" cy="165" rx="16" ry="22" fill="#D4A373" transform="rotate(20 50 165)" />
        <ellipse cx="150" cy="165" rx="16" ry="22" fill="#D4A373" transform="rotate(-20 150 165)" />
        
        {/* Foot pads with heart */}
        <circle cx="50" cy="170" r="8" fill="#ffb4a2" />
        <circle cx="150" cy="170" r="8" fill="#ffb4a2" />
      </svg>
    </div>
  );
}

export function WelcomeTeddyPair({ className = "h-40" }) {
  return (
    <div className={`flex items-center justify-center gap-4 ${className}`}>
      <BoyTeddy className="w-24 h-24 sm:w-28 sm:h-28" />
      <div className="flex flex-col items-center">
        <span className="text-2xl sm:text-3xl animate-bounce">🎈</span>
        <span className="text-xs font-serif italic text-purple-600 font-bold bg-white/80 px-2 py-0.5 rounded-full border border-purple-100 shadow-sm">
          o
        </span>
      </div>
      <GirlTeddy className="w-24 h-24 sm:w-28 sm:h-28" />
    </div>
  );
}
