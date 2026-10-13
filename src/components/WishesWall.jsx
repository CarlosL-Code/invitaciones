import { Heart, MessageSquareQuote, Sparkles } from 'lucide-react';
import { EVENT_CONFIG } from '../config/eventConfig';
import { RevealTeddy } from './TeddyBears';

export default function WishesWall({ guests = [] }) {
  const { parents } = EVENT_CONFIG;

  // Extraer las dedicatorias reales dejadas por los invitados en el RSVP
  const actualWishes = guests
    .filter((g) => g.message && g.message.trim().length > 0)
    .map((g) => ({
      id: g.id,
      fullName: g.fullName,
      message: g.message,
      teamVote: g.teamVote || 'boy',
      date: g.createdAt ? new Date(g.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }) : 'Reciente',
    }));

  return (
    <section className="py-16 px-4 sm:px-6 relative">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 text-pink-600 text-xs font-semibold uppercase tracking-wider mb-2">
            <MessageSquareQuote className="w-3.5 h-3.5" />
            <span>Libro de Recuerdos Público</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-800 mb-2">
            Mensajes con Amor
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Dedicatorias compartidas con mucho cariño para {parents.motherName}, {parents.fatherName} y el nuevo bebé.
          </p>
        </div>

        {actualWishes.length === 0 ? (
          <div className="glass-card rounded-3xl p-8 sm:p-10 border border-purple-100 text-center max-w-lg mx-auto shadow-sm">
            <div className="flex justify-center mb-3">
              <RevealTeddy className="w-24 h-24 sm:w-28 sm:h-28" />
            </div>
            <h3 className="font-serif text-xl font-bold text-slate-800 mb-1.5">
              El Libro de Recuerdos está listo
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mb-5 leading-relaxed">
              Sé el primero en dejar tu dedicatoria especial para {parents.motherName}, {parents.fatherName} y su bebé al confirmar tu asistencia abajo.
            </p>
            <a
              href="#asistencia"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-md shadow-rose-200 transition-all hover:scale-105"
            >
              <Heart className="w-3.5 h-3.5 fill-white" />
              <span>Escribir una Dedicatoria</span>
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {actualWishes.map((item) => (
              <div
                key={item.id}
                className={`p-5 rounded-3xl glass-card border shadow-sm flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-md ${
                  item.teamVote === 'boy'
                    ? 'border-sky-200/60 bg-sky-50/40'
                    : 'border-rose-200/60 bg-rose-50/40'
                }`}
              >
                <div className="mb-4">
                  <span className="text-2xl mb-1 block">
                    {item.teamVote === 'boy' ? '🧸 💙' : '🧸 💖'}
                  </span>
                  <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed font-serif">
                    "{item.message}"
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-200/60 text-xs">
                  <div>
                    <strong className="text-slate-800 block text-xs">
                      {item.fullName}
                    </strong>
                    <span className="text-[10px] text-slate-400">
                      {item.date}
                    </span>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    item.teamVote === 'boy' ? 'bg-sky-100 text-sky-700' : 'bg-rose-100 text-rose-700'
                  }`}>
                    {item.teamVote === 'boy' ? 'Team Niño' : 'Team Niña'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
