import { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, Trophy, Heart } from 'lucide-react';
import { BoyTeddy, GirlTeddy } from './TeddyBears';
import { EVENT_CONFIG } from '../config/eventConfig';
import { triggerBoyConfetti, triggerGirlConfetti } from '../utils/confetti';
import { storageService } from '../services/storageService';

export default function VoteSection({ 
  currentUser, 
  userVote, 
  onVoteChange, 
  onRequireRegistration,
  votes: externalVotes,
  onVotesUpdated 
}) {
  const [internalVotes, setInternalVotes] = useState(() => storageService.getVotes());
  const votes = externalVotes || internalVotes;
  const setVotes = onVotesUpdated || setInternalVotes;

  useEffect(() => {
    localStorage.setItem('gender_reveal_votes', JSON.stringify(votes));
  }, [votes]);

  const handleVote = (team) => {
    if (!currentUser) {
      if (onRequireRegistration) onRequireRegistration();
      return;
    }

    if (userVote === team) return; // Ya tiene este voto

    setVotes((prev) => {
      const newVotes = { ...prev };
      if (userVote && newVotes[userVote] > 0) {
        newVotes[userVote] -= 1;
      }
      newVotes[team] += 1;
      return newVotes;
    });

    storageService.recordVote(team, userVote);

    if (onVoteChange) {
      onVoteChange(team);
    }

    if (team === 'boy') {
      triggerBoyConfetti();
    } else {
      triggerGirlConfetti();
    }
  };

  const totalVotes = votes.boy + votes.girl;
  const boyPercent = totalVotes > 0 ? Math.round((votes.boy / totalVotes) * 100) : 0;
  const girlPercent = totalVotes > 0 ? 100 - boyPercent : 0;

  return (
    <section id="votacion" className="py-16 px-4 sm:px-6 relative">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold uppercase tracking-wider mb-2">
            <Trophy className="w-3.5 h-3.5" />
            <span>Juego Interactivo</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-800 mb-3">
            ¿Cuál es tu intuición?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
            ¡Elige a tu equipo favorito! Esta votación es pública y tus votos se sumarán a la gráfica en tiempo real.
          </p>
          {currentUser && (
            <p className="text-xs font-semibold text-purple-600 mt-2">
              Votando como: <strong>{currentUser.fullName}</strong>
            </p>
          )}
        </div>

        {/* Voting Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
          {/* TEAM BOY */}
          <div
            onClick={() => handleVote('boy')}
            className={`cursor-pointer rounded-3xl p-6 transition-all duration-300 relative overflow-hidden group flex flex-col items-center text-center ${
              userVote === 'boy'
                ? 'ring-4 ring-sky-400 bg-sky-50 shadow-xl scale-[1.02]'
                : 'glass-card hover:bg-sky-50/60 shadow-md hover:shadow-lg hover:-translate-y-1 border border-sky-100'
            }`}
          >
            {/* Background tint accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-sky-200/40 rounded-full blur-2xl -z-10 group-hover:scale-125 transition-transform" />

            {/* Boy Teddy Bear */}
            <div className="mb-3 transform group-hover:scale-110 transition-transform">
              <BoyTeddy className="w-28 h-28 sm:w-36 sm:h-36" />
            </div>

            <span className="text-xs font-extrabold uppercase tracking-widest text-sky-600 mb-1">
              Predicción
            </span>
            <h3 className="font-serif text-2xl font-bold text-slate-800 mb-1">
              Team Niño 👦
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              El futuro príncipe de la casa
            </p>

            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl font-extrabold text-sky-600">
                {votes.boy}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {totalVotes > 0 ? `votos (${boyPercent}%)` : 'votos'}
              </span>
            </div>

            <button
              type="button"
              className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 ${
                userVote === 'boy'
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-300'
                  : 'bg-white hover:bg-sky-100 text-sky-700 border border-sky-200'
              }`}
            >
              {userVote === 'boy' ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>¡Elegiste Team Niño!</span>
                </>
              ) : (
                <>
                  <span>Votar por Niño</span>
                  <span>💙</span>
                </>
              )}
            </button>
          </div>

          {/* TEAM GIRL */}
          <div
            onClick={() => handleVote('girl')}
            className={`cursor-pointer rounded-3xl p-6 transition-all duration-300 relative overflow-hidden group flex flex-col items-center text-center ${
              userVote === 'girl'
                ? 'ring-4 ring-rose-400 bg-rose-50 shadow-xl scale-[1.02]'
                : 'glass-card hover:bg-rose-50/60 shadow-md hover:shadow-lg hover:-translate-y-1 border border-rose-100'
            }`}
          >
            {/* Background tint accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-200/40 rounded-full blur-2xl -z-10 group-hover:scale-125 transition-transform" />

            {/* Girl Teddy Bear */}
            <div className="mb-3 transform group-hover:scale-110 transition-transform">
              <GirlTeddy className="w-28 h-28 sm:w-36 sm:h-36" />
            </div>

            <span className="text-xs font-extrabold uppercase tracking-widest text-rose-600 mb-1">
              Predicción
            </span>
            <h3 className="font-serif text-2xl font-bold text-slate-800 mb-1">
              Team Niña 👧
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              La futura princesita de la casa
            </p>

            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl font-extrabold text-rose-600">
                {votes.girl}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {totalVotes > 0 ? `votos (${girlPercent}%)` : 'votos'}
              </span>
            </div>

            <button
              type="button"
              className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 ${
                userVote === 'girl'
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-300'
                  : 'bg-white hover:bg-rose-100 text-rose-700 border border-rose-200'
              }`}
            >
              {userVote === 'girl' ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>¡Elegiste Team Niña!</span>
                </>
              ) : (
                <>
                  <span>Votar por Niña</span>
                  <span>💖</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Vote Progress Bar */}
        <div className="glass-card rounded-2xl p-4 sm:p-5 shadow-sm border border-white">
          <div className="flex flex-wrap items-center justify-between text-[11px] sm:text-xs font-bold text-slate-600 gap-1 mb-2">
            <span className="text-sky-600">👦 Niño: {boyPercent}%</span>
            <span className="text-slate-400 text-[10px] sm:text-xs">
              {totalVotes === 0 ? 'Sin votos registrados aún (0 votos)' : `Total: ${totalVotes} votos`}
            </span>
            <span className="text-rose-600">👧 Niña: {girlPercent}%</span>
          </div>

          <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
            {totalVotes === 0 ? (
              <div className="w-full h-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-400 font-semibold">
                Esperando primeras predicciones
              </div>
            ) : (
              <>
                <div
                  className="bg-gradient-to-r from-sky-400 to-blue-500 transition-all duration-700 h-full rounded-l-full"
                  style={{ width: `${boyPercent}%` }}
                />
                <div
                  className="bg-gradient-to-r from-pink-400 to-rose-500 transition-all duration-700 h-full rounded-r-full"
                  style={{ width: `${girlPercent}%` }}
                />
              </>
            )}
          </div>

          <p className="text-center text-xs text-slate-500 mt-3">
            {totalVotes === 0
              ? '✨ ¡Aún no hay votos registrados! Haz clic en el osito de tu preferencia para iniciar la predicción.'
              : userVote
              ? '✨ Tu voto ya quedó registrado y se adjuntará automáticamente a tu confirmación.'
              : 'Haz clic sobre el osito de tu preferencia para emitir tu predicción.'}
          </p>
        </div>
      </div>
    </section>
  );
}
