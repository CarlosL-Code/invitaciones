import { Sparkles, Calendar, MapPin, Heart, UserCheck } from 'lucide-react';
import Countdown from './Countdown';
import heroImg from '../assets/hero.png';
import { EVENT_CONFIG } from '../config/eventConfig';
import { triggerCelebrationConfetti } from '../utils/confetti';

export default function Hero({ currentUser, onOpenRegistration }) {
  const { parents, date, location } = EVENT_CONFIG;

  return (
    <section id="inicio" className="relative pt-24 pb-14 px-4 sm:px-6 overflow-hidden text-center">
      {/* Decorative background glow circles */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-r from-rose-200/40 via-purple-100/30 to-sky-200/40 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute -top-10 -left-10 w-72 h-72 bg-rose-200/30 rounded-full blur-2xl -z-10 pointer-events-none animate-pulse-subtle" />
      <div className="absolute top-40 -right-10 w-72 h-72 bg-sky-200/30 rounded-full blur-2xl -z-10 pointer-events-none animate-pulse-subtle" />

      <div className="max-w-3xl mx-auto flex flex-col items-center">
        {/* User Greeting Pill if registered */}
        {currentUser ? (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-4 shadow-xs">
            <UserCheck className="w-4 h-4 text-emerald-600" />
            <span>¡Hola, <strong>{currentUser.fullName}</strong>! Bienvenido/a</span>
            <button
              onClick={onOpenRegistration}
              className="text-[11px] underline text-emerald-600 hover:text-emerald-900 ml-1"
            >
              (Cambiar)
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenRegistration}
            className="cursor-pointer group inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card border border-rose-200/60 shadow-sm hover:scale-105 transition-all duration-300 mb-4"
          >
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
            <span className="text-xs uppercase tracking-widest font-bold bg-gradient-to-r from-rose-600 to-sky-600 bg-clip-text text-transparent">
              ¡Gran Revelación de Sexo!
            </span>
            <span className="text-xs">✨</span>
          </button>
        )}

        {/* Script Intro with Family Names */}
        <div className="flex flex-col items-center mb-1">
          <p className="font-script text-3xl sm:text-5xl text-rose-500">
            {parents.motherName} & {parents.fatherName}
          </p>
          <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-purple-700 bg-purple-50/90 px-3.5 py-1 rounded-full border border-purple-200/80 mt-1 shadow-2xs">
            <span>👧</span>
            <span>junto a la hermanita mayor <strong>{parents.sisterName}</strong></span>
          </span>
        </div>

        {/* Main Title */}
        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-800 leading-tight mb-2 mt-2">
          ¿Será <span className="text-rose-500 font-serif italic">Princesa</span> o <span className="text-sky-500 font-serif italic">Príncipe</span>?
        </h1>

        {/* Royal Hero Centerpiece with Baby Prince & Princess */}
        <div
          className="my-3 relative group cursor-pointer max-w-xs sm:max-w-md mx-auto"
          onClick={triggerCelebrationConfetti}
          title="¡Tócame para celebrar con confeti! ✨"
        >
          {/* Subtle dual-color ambient aura */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-rose-200/50 via-purple-100/30 to-sky-200/50 rounded-full blur-2xl transform group-hover:scale-110 transition-transform duration-500" />
          
          <img
            src={heroImg}
            alt="¿Princesa o Príncipe? Revelación de Sexo Estefanía y Carlos"
            className="w-full max-h-64 sm:max-h-80 object-contain mx-auto drop-shadow-2xl animate-soft-float filter transition-transform duration-300 group-hover:scale-105"
            loading="eager"
          />

          <div className="mt-1">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-purple-700 bg-white/90 backdrop-blur-xs px-3 py-1 rounded-full border border-purple-200/70 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Tócame para celebrar</span>
            </span>
          </div>
        </div>

        <p className="max-w-xl text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 font-normal">
          Un nuevo milagro de amor llega a iluminar nuestra familia. Papá Carlos, mamá Estefanía y la hermana mayor <strong>{parents.sisterName}</strong> queremos compartir con nuestras personas favoritas el gran momento en que descubriremos su sexo.
        </p>

        {/* Date and Location Pills */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mb-5 text-xs sm:text-sm font-medium text-slate-700 w-full max-w-md px-2">
          <div className="w-full sm:w-auto flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-xl glass-card shadow-sm border border-slate-100">
            <Calendar className="w-4 h-4 text-purple-500 shrink-0" />
            <span className="font-semibold text-slate-800">{date.displayDate}</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-600">{date.displayTime}</span>
          </div>

          <div className="w-full sm:w-auto flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-xl glass-card shadow-sm border border-slate-100">
            <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{location.placeName}</span>
          </div>
        </div>

        {/* Countdown Timer */}
        <Countdown targetDateIso={date.targetDateIso} />

        {/* Primary CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-4 w-full sm:w-auto">
          <a
            href="#asistencia"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-rose-500 via-purple-500 to-sky-500 hover:from-rose-600 hover:via-purple-600 hover:to-sky-600 text-white font-semibold text-sm shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Heart className="w-4 h-4 fill-white" />
            <span>Confirmar mi Asistencia</span>
          </a>

          <a
            href="#votacion"
            className="w-full sm:w-auto px-6 py-3.5 rounded-full glass-card hover:bg-white text-slate-700 font-medium text-sm shadow-sm hover:shadow transition-all duration-200 border border-slate-200 flex items-center justify-center gap-2"
          >
            <span>Votar mi Predicción</span>
            <span className="text-sm">🧸</span>
          </a>
        </div>
      </div>
    </section>
  );
}
