import { useState } from 'react';
import { Calendar, MapPin, Clock, Shirt, Navigation, Copy, Check, ExternalLink, Sparkles, Cake, PartyPopper } from 'lucide-react';
import estefaniaImg from '../assets/estefania_alegre.png';
import { EVENT_CONFIG } from '../config/eventConfig';

export default function EventDetails() {
  const { date, location, dressCode, itinerary } = EVENT_CONFIG;
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [activeStep, setActiveStep] = useState(3); // Por defecto el momento de revelación

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(`${location.placeName}, ${location.address}, ${location.city}`);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2500);
  };

  const getGoogleCalendarUrl = () => {
    const title = encodeURIComponent("Gran Revelación de Sexo - Estefanía y Carlos");
    const details = encodeURIComponent("Acompáñanos a descubrir si será Niño o Niña. ¡Te esperamos!");
    const loc = encodeURIComponent(`${location.placeName}, ${location.address}`);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=20261107T170000Z/20261107T220000Z&details=${details}&location=${loc}`;
  };

  return (
    <section id="detalles" className="py-16 px-4 sm:px-6 relative">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-rose-500 mb-2 block">
            Planifica tu visita
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-800 mb-3">
            Detalles del Evento
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
            Hemos preparado cada momento con mucho amor para disfrutar juntos este Sábado 7 de Noviembre.
          </p>
        </div>

        {/* Mamá Estefanía dándote la bienvenida al evento */}
        <div className="glass-card rounded-3xl p-5 sm:p-7 mb-10 border border-rose-200/80 shadow-md flex flex-col md:flex-row items-center gap-6 bg-gradient-to-r from-rose-50/90 via-white to-purple-50/90">
          <div className="relative group shrink-0">
            <div className="absolute -inset-2 bg-gradient-to-r from-rose-300 to-pink-300 rounded-full blur-md opacity-60 group-hover:opacity-100 transition-opacity" />
            <img
              src={estefaniaImg}
              alt="Mamá Estefanía esperando al bebé"
              className="relative w-28 sm:w-36 max-h-52 object-contain drop-shadow-lg animate-soft-float group-hover:scale-105 transition-transform"
            />
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-white text-[10px] font-bold text-rose-700 shadow-xs border border-rose-200 whitespace-nowrap">
              🤰 Mamá Estefanía
            </span>
          </div>

          <div className="text-center md:text-left flex-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 bg-rose-100/70 px-2.5 py-0.5 rounded-full inline-block mb-1.5">
              Bienvenida con Cariño
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-800 mb-2">
              "¡Cada detalle lo soñamos para vivirlo contigo!" 🌸
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
              Estamos en la dulce espera de nuestro mayor tesoro. Preparamos una jornada llena de juegos, rica comida para compartir y la más linda revelación a las <strong>16:30 hrs</strong>. ¡Ven a disfrutar desde las <strong>14:00 hrs</strong>!
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs font-semibold text-purple-700">
              <span className="px-3 py-1 rounded-full bg-purple-50 border border-purple-200">✨ Comienza 14:00 hrs</span>
              <span className="px-3 py-1 rounded-full bg-rose-50 border border-rose-200">🎈 Revelación 16:30 hrs</span>
            </div>
          </div>
        </div>

        {/* 3 Main Highlight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Card 1: Fecha y Hora */}
          <div className="glass-card rounded-3xl p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow border border-white">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4 shadow-xs">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-slate-800 mb-1">Cuándo</h3>
            <p className="text-sm font-semibold text-purple-700 mb-1">{date.displayDate}</p>
            <p className="text-xs text-slate-500 mb-5">{date.displayTime}</p>

            <a
              href={getGoogleCalendarUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors flex items-center justify-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Agendar en Google</span>
            </a>
          </div>

          {/* Card 2: Dónde */}
          <div className="glass-card rounded-3xl p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow border border-white">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4 shadow-xs">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-slate-800 mb-1">Dónde</h3>
            <p className="text-sm font-semibold text-slate-800 mb-1">{location.placeName}</p>
            <p className="text-xs text-slate-500 mb-5">{location.address}, {location.city}</p>

            <div className="mt-auto w-full flex flex-col gap-2">
              <div className="flex gap-2">
                <a
                  href={location.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors flex items-center justify-center gap-1"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Maps</span>
                </a>
                <a
                  href={location.wazeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold bg-sky-50 text-sky-700 hover:bg-sky-100 transition-colors flex items-center justify-center gap-1"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Waze</span>
                </a>
              </div>
              <button
                type="button"
                onClick={handleCopyAddress}
                className="w-full py-2 px-3 rounded-xl text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center justify-center gap-1.5"
              >
                {copiedAddress ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedAddress ? "¡Dirección copiada!" : "Copiar dirección"}</span>
              </button>
            </div>
          </div>

          {/* Card 3: Dress Code */}
          <div className="glass-card rounded-3xl p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow border border-white">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mb-4 shadow-xs">
              <Shirt className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-slate-800 mb-1">Dress Code</h3>
            <p className="text-sm font-semibold text-slate-800 mb-1">Blanco o tu Team</p>
            <p className="text-xs text-slate-500 mb-4">{dressCode.description}</p>

            <div className="mt-auto flex items-center justify-center gap-2 pt-2">
              <span className="w-5 h-5 rounded-full bg-white border-2 border-slate-300 shadow-sm" title="Blanco" />
              <span className="w-5 h-5 rounded-full bg-sky-400 shadow-sm" title="Team Niño" />
              <span className="w-5 h-5 rounded-full bg-rose-400 shadow-sm" title="Team Niña" />
            </div>
          </div>
        </div>

        {/* Mapa Interactivo Visual */}
        <div className="glass-card rounded-3xl p-6 shadow-md border border-white mb-12">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-rose-500" />
              <h3 className="font-bold text-slate-800 text-base">
                Mapa Interactivo: ¿Cómo llegar?
              </h3>
            </div>
            <span className="text-xs text-slate-500 hidden sm:inline">
              {location.placeName}
            </span>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-inner border border-slate-200 relative aspect-video sm:aspect-[21/9] bg-slate-100">
            <iframe
              title="Ubicación del evento"
              src={location.googleMapsEmbedUrl || "https://maps.google.com/maps?q=-38.69220,-72.64683&hl=es&z=15&output=embed"}
              className="w-full h-full border-0"
              loading="lazy"
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
            <p>
              📍 <strong>Dirección:</strong> {location.address}, {location.city}
            </p>
            <a
              href={location.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 hover:text-purple-800 font-semibold inline-flex items-center gap-1"
            >
              <span>Abrir ruta en Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Itinerario Dinámico y Llamativo */}
        <div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-md border border-white">
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold uppercase tracking-wider mb-2">
              <Clock className="w-3.5 h-3.5" />
              <span>Cronograma del Día</span>
            </div>
            <h3 className="font-serif text-2xl font-bold text-slate-800">
              Itinerario Dinámico
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Haz clic en cada momento para ver lo que tenemos preparado
            </p>
          </div>

          {/* Stepper Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {itinerary.map((item) => {
              const isSelected = activeStep === item.step;
              return (
                <div
                  key={item.step}
                  onClick={() => setActiveStep(item.step)}
                  className={`cursor-pointer rounded-2xl p-4 transition-all duration-300 border flex flex-col justify-between text-left relative overflow-hidden ${
                    isSelected
                      ? 'bg-gradient-to-br from-purple-50 via-white to-rose-50 border-purple-300 shadow-md scale-[1.02] ring-2 ring-purple-200'
                      : 'bg-white/80 hover:bg-white border-slate-200/80 hover:shadow'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-mono">
                      {item.time}
                    </span>
                    <span className="text-xl">
                      {item.step === 1 && "🧸"}
                      {item.step === 2 && "🎯"}
                      {item.step === 3 && "✨"}
                      {item.step === 4 && "🍰"}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-800 text-sm mb-1.5">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {item.desc}
                  </p>

                  {item.step === 3 && (
                    <div className="mt-3 text-[10px] uppercase font-extrabold tracking-wider text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full w-fit">
                      Momento Cumbre
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
