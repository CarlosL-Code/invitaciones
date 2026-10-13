import { Heart, Sparkles, Settings } from 'lucide-react';
import { EVENT_CONFIG } from '../config/eventConfig';

export default function Footer({ onOpenAdmin }) {
  const { parents } = EVENT_CONFIG;

  return (
    <footer className="mt-20 border-t border-slate-200/60 bg-white/50 backdrop-blur-md py-12 px-4 sm:px-6 text-center relative">
      <div className="max-w-3xl mx-auto flex flex-col items-center">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-200 via-purple-200 to-sky-200 flex items-center justify-center text-slate-700 mb-3 shadow-inner">
          <Heart className="w-5 h-5 text-rose-500 fill-rose-500/30" />
        </div>

        <p className="font-script text-3xl sm:text-5xl text-slate-700 mb-1">
          {parents.motherName} & {parents.fatherName}
        </p>
        <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-6">
          Esperando con amor la llegada de nuestro bebé
        </p>

        <p className="text-xs text-slate-500 max-w-md leading-relaxed mb-8">
          "Cada hijo es una promesa de amor infinito. Gracias por ser parte de nuestra historia y acompañarnos en este hermoso comienzo."
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-xs text-slate-500 pt-2">
          <span>Sábado 7 de Noviembre de 2026 • 14:00 hrs</span>
          <span className="hidden sm:inline">•</span>
          <button
            onClick={onOpenAdmin}
            className="px-4 py-2 rounded-xl bg-purple-100/90 hover:bg-purple-200 text-purple-800 font-bold text-xs inline-flex items-center gap-2 border border-purple-200 shadow-xs transition-all cursor-pointer"
          >
            <span>👑</span>
            <span>Panel de Papás (Estefanía & Carlos)</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
