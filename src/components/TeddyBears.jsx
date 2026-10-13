import boyTeddyImg from '../assets/osito_pardo.png';
import girlTeddyImg from '../assets/osito_rosa.png';
import revealTeddyImg from '../assets/osito_blanco.png';

/**
 * Adorables Ositos Teddy Bear con las ilustraciones de alta definición
 * Niño (osito pardo con moño celeste)
 * Niña (osito blanco con moño rosa)
 * Revelación (osito con moño mitad rosa y mitad celeste)
 */

export function BoyTeddy({ className = "w-28 h-28 sm:w-36 sm:h-36", alt = "Osito Team Niño" }) {
  return (
    <div className={`relative inline-block ${className} animate-soft-float select-none`}>
      <img
        src={boyTeddyImg}
        alt={alt}
        className="w-full h-full object-contain drop-shadow-xl filter transition-transform duration-300"
        loading="eager"
      />
    </div>
  );
}

export function GirlTeddy({ className = "w-28 h-28 sm:w-36 sm:h-36", alt = "Osita Team Niña" }) {
  return (
    <div className={`relative inline-block ${className} animate-soft-float select-none`}>
      <img
        src={girlTeddyImg}
        alt={alt}
        className="w-full h-full object-contain drop-shadow-xl filter transition-transform duration-300"
        loading="eager"
      />
    </div>
  );
}

export function RevealTeddy({ className = "w-28 h-28 sm:w-36 sm:h-36", alt = "Osito Revelación" }) {
  return (
    <div className={`relative inline-block ${className} animate-soft-float select-none`}>
      <img
        src={revealTeddyImg}
        alt={alt}
        className="w-full h-full object-contain drop-shadow-xl filter transition-transform duration-300"
        loading="eager"
      />
    </div>
  );
}

export function WelcomeTeddyPair({ className = "h-36" }) {
  return (
    <div className={`flex items-center justify-center gap-2 sm:gap-4 ${className} select-none`}>
      <div className="relative transform hover:scale-105 transition-transform">
        <img
          src={boyTeddyImg}
          alt="Team Niño"
          className="h-28 sm:h-32 object-contain drop-shadow-lg"
          loading="eager"
        />
      </div>

      <div className="flex flex-col items-center justify-center px-1">
        <span className="text-2xl sm:text-3xl animate-bounce">🎈</span>
        <span className="text-xs font-serif italic text-purple-700 font-bold bg-white/90 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-purple-200 shadow-sm mt-0.5">
          ¿o?
        </span>
      </div>

      <div className="relative transform hover:scale-105 transition-transform">
        <img
          src={girlTeddyImg}
          alt="Team Niña"
          className="h-28 sm:h-32 object-contain drop-shadow-lg"
          loading="eager"
        />
      </div>
    </div>
  );
}
