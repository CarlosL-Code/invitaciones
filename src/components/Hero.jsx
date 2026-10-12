import { Sparkles, Calendar, MapPin, Heart, UserCheck } from 'lucide-react';
import Countdown from './Countdown';
import { WelcomeTeddyPair } from './TeddyBears';
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

        {/* Script Intro with Parents Names */}
        <p className="font-script text-3xl sm:text-5xl text-rose-500 mb-1">
          {parents.motherName} & {parents.fatherName}
        </p>

        {/* Main Title */}
        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-800 leading-tight mb-3">
          ¿Será <span className="text-rose-500 font-serif italic">Niña</span> o será <span className="text-sky-500 font-serif italic">Niño</span>?
        </h1>

        {/* Cute Teddy Bears Graphic */}
        <div className="my-2 cursor-pointer" onClick={triggerCelebrationConfetti} title="¡Tócame para celebrar!">
          <WelcomeTeddyPair className="h-32 sm:h-36" />
        </div>

        <p className="max-w-xl text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 font-normal">
          Un nuevo milagro de amor está creciendo en nuestras vidas. Queremos compartir con nuestras personas favoritas el momento en que descubriremos su sexo.
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
