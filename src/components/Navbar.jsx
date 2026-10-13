import { useState } from 'react';
import { Volume2, VolumeX, Heart, Menu, X, User } from 'lucide-react';
import { musicBox } from '../utils/audioPlayer';

export default function Navbar({ currentUser, onOpenRegistration, onOpenAdmin }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMusic = () => {
    const active = musicBox.toggle();
    setIsPlaying(active);
  };

  const navLinks = [
    { name: 'Inicio', href: '#inicio' },
    { name: '¿Niño o Niña?', href: '#votacion' },
    { name: 'Detalles', href: '#detalles' },
    { name: 'Confirmar', href: '#asistencia' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 transition-all duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3">
        <div className="glass-card rounded-full px-3 sm:px-5 py-2 sm:py-2.5 flex items-center justify-between shadow-lg shadow-rose-950/5 border border-white/80">
          {/* Logo / Brand */}
          <a href="#inicio" className="flex items-center gap-1.5 sm:gap-2 group shrink-0">
            <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-rose-300 via-purple-200 to-sky-300 flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform">
              <span className="text-xs sm:text-sm">🧸</span>
            </span>
            <span className="font-serif font-bold text-sm sm:text-base md:text-lg tracking-tight bg-gradient-to-r from-rose-500 via-purple-500 to-sky-600 bg-clip-text text-transparent">
              Estefanía & Carlos
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-xs uppercase tracking-wider font-semibold text-slate-600 hover:text-rose-500 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right Actions: User status + Music + Mobile Menu */}
          <div className="flex items-center gap-2">
            {/* User pill or register button */}
            {currentUser ? (
              <button
                onClick={onOpenRegistration}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-semibold hover:bg-purple-100 transition-colors"
                title="Editar mis datos"
              >
                <User className="w-3.5 h-3.5" />
                <span className="max-w-[100px] truncate">{currentUser.fullName}</span>
              </button>
            ) : (
              <button
                onClick={onOpenRegistration}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-rose-400 to-sky-400 text-white text-xs font-bold hover:opacity-90 shadow-xs"
              >
                <span>Registrarme</span>
              </button>
            )}

            {/* Botón Panel de Papás */}
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-100/90 hover:bg-purple-200 text-purple-800 text-xs font-bold transition-all border border-purple-200 shadow-xs cursor-pointer shrink-0"
              title="Panel Administrativo de Asistencia (Requiere PIN)"
            >
              <span className="text-xs">👑</span>
              <span className="hidden xs:inline">Panel Papás</span>
            </button>

            {/* Music button */}
            <button
              onClick={toggleMusic}
              aria-label="Reproducir música ambiental"
              title={isPlaying ? "Pausar música" : "Activar música suave"}
              className={`p-2 rounded-full transition-all duration-300 flex items-center gap-1.5 text-xs font-medium ${
                isPlaying
                  ? 'bg-rose-100 text-rose-700 shadow-sm shadow-rose-200 animate-pulse'
                  : 'bg-slate-100/80 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {isPlaying ? <Volume2 className="w-4 h-4 text-rose-500" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden lg:inline text-[11px]">
                {isPlaying ? "Música On" : "Música"}
              </span>
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-full bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mx-4 mt-2 p-4 glass-card rounded-2xl shadow-xl animate-in fade-in duration-200 border border-white">
          <div className="flex flex-col gap-3">
            {currentUser && (
              <div className="px-3 py-2 rounded-xl bg-purple-50 text-purple-800 text-xs font-bold flex items-center justify-between">
                <span>Registrado: {currentUser.fullName}</span>
                <button onClick={onOpenRegistration} className="text-purple-600 underline text-[11px]">Cambiar</button>
              </div>
            )}
            {!currentUser && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenRegistration();
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-purple-600 text-white font-bold text-xs text-center"
              >
                Registrar mis datos ✨
              </button>
            )}
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-rose-50 hover:text-rose-600 transition-colors"
              >
                {link.name}
              </a>
            ))}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenAdmin) onOpenAdmin();
              }}
              className="mt-2 w-full py-2.5 px-3 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold text-xs flex items-center justify-center gap-2 border border-purple-200 shadow-xs transition-colors"
            >
              <span>👑</span>
              <span>Panel de Papás (Requiere PIN)</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
