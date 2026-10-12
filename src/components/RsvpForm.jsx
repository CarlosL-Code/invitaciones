import { useState, useEffect } from 'react';
import { Send, CheckCircle2, User, Phone, Users, Heart, Sparkles, MessageCircle, AlertCircle, Plus, Trash2, Utensils } from 'lucide-react';
import { EVENT_CONFIG } from '../config/eventConfig';
import { triggerCelebrationConfetti, triggerBoyConfetti, triggerGirlConfetti } from '../utils/confetti';
import { storageService } from '../services/storageService';

export default function RsvpForm({ currentUser, userVote, onVoteChange, onGuestAdded, onOpenRegistration }) {
  const { whatsapp, date } = EVENT_CONFIG;

  const [attending, setAttending] = useState('yes');
  const [adultsCount, setAdultsCount] = useState(1);
  const [childrenCount, setChildrenCount] = useState(0);
  const [companions, setCompanions] = useState([]); // Lista dinámica de acompañantes
  const [dietary, setDietary] = useState('');
  const [message, setMessage] = useState('');

  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [error, setError] = useState('');

  // Agregar nuevo campo de acompañante
  const handleAddCompanion = () => {
    setCompanions((prev) => [...prev, '']);
  };

  // Actualizar nombre de acompañante específico
  const handleCompanionChange = (index, value) => {
    setCompanions((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  // Quitar acompañante
  const handleRemoveCompanion = (index) => {
    setCompanions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      if (onOpenRegistration) onOpenRegistration();
      return;
    }

    const cleanCompanions = companions.filter((name) => name.trim().length > 0);

    const newTicketId = 'REV-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    setTicketId(newTicketId);

    const guestRecord = {
      id: newTicketId,
      fullName: currentUser.fullName,
      phone: currentUser.phone,
      email: currentUser.email,
      attending,
      adultsCount: attending === 'yes' ? parseInt(adultsCount, 10) : 0,
      childrenCount: attending === 'yes' ? parseInt(childrenCount, 10) : 0,
      companions: cleanCompanions,
      teamVote: userVote || 'boy',
      dietary: dietary.trim(),
      message: message.trim(),
      createdAt: new Date().toISOString(),
    };

    // Guardar mediante el servicio de almacenamiento y sincronización
    await storageService.saveGuest(guestRecord);

    if (onGuestAdded) {
      onGuestAdded(guestRecord);
    }

    if (attending === 'yes') {
      if (userVote === 'boy') triggerBoyConfetti();
      else if (userVote === 'girl') triggerGirlConfetti();
      else triggerCelebrationConfetti();
    }

    setSubmitted(true);
  };

  // Armar y enviar el mensaje completo formateado a WhatsApp
  const handleSendToWhatsapp = () => {
    if (!currentUser) return;

    const attendingText = attending === 'yes' ? '✅ ¡Sí asistiré con mucha alegría!' : '❌ Lamentablemente no podré asistir';
    const teamText = userVote === 'boy' ? '👦 Team Niño' : userVote === 'girl' ? '👧 Team Niña' : '✨ Sorpresa';

    let msg = `¡Hola ${whatsapp.contactName}! 👋 Confirmo mi respuesta para la Gran Revelación de Sexo:\n\n`;
    msg += `👤 *Nombre:* ${currentUser.fullName}\n`;
    msg += `📞 *WhatsApp:* ${currentUser.phone}\n`;
    if (currentUser.email && currentUser.email !== 'No especificado') {
      msg += `📧 *Correo:* ${currentUser.email}\n`;
    }
    msg += `🎟️ *Código Pase:* ${ticketId}\n`;
    msg += `📅 *Asistencia:* ${attendingText}\n`;

    if (attending === 'yes') {
      msg += `👥 *Total Asistentes:* ${adultsCount} Adultos, ${childrenCount} Niños\n`;
      const cleanCompanions = companions.filter(c => c.trim().length > 0);
      if (cleanCompanions.length > 0) {
        msg += `🤝 *Acompañantes:* ${cleanCompanions.join(', ')}\n`;
      }
      msg += `🎯 *Mi Predicción:* ${teamText}\n`;
      if (dietary.trim()) {
        msg += `🥗 *Restricción alimentaria / Alergias:* ${dietary.trim()}\n`;
      }
    }

    if (message.trim()) {
      msg += `💌 *Dedicatoria para los papás:* "${message.trim()}"\n`;
    }

    msg += `\n¡Nos vemos el Sábado 7 de Noviembre! 🎉✨`;

    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/${whatsapp.phoneNumber}?text=${encoded}`, '_blank');
  };

  return (
    <section id="asistencia" className="py-16 px-4 sm:px-6 relative">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-600 mb-2 block">
            RSVP • Confirmación de Asistencia
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-800 mb-3">
            Confirma tu Asistencia
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
            Por favor confírmanos antes del <strong className="text-slate-800">25 de Octubre</strong> para calcular los puestos y compartir una hermosa tarde.
          </p>
        </div>

        {/* Si el usuario aún no ingresó datos de bienvenida */}
        {!currentUser && (
          <div className="glass-card rounded-3xl p-6 sm:p-8 text-center border border-purple-200 shadow-md mb-6">
            <span className="text-4xl mb-2 block">🧸</span>
            <h3 className="font-serif text-xl font-bold text-slate-800 mb-2">
              Primero necesitamos conocerte
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mb-5 max-w-sm mx-auto">
              Ingresa tu nombre y WhatsApp para poder confirmar tu asistencia y votar tu intuición.
            </p>
            <button
              onClick={onOpenRegistration}
              className="py-3 px-6 rounded-xl bg-gradient-to-r from-rose-500 via-purple-500 to-sky-500 text-white font-bold text-xs shadow-md shadow-purple-200 hover:scale-105 transition-all"
            >
              Registrar mis datos para entrar ✨
            </button>
          </div>
        )}

        {currentUser && submitted && (
          /* Card de Éxito con Pase Digital */
          <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-xl border border-white text-center animate-in fade-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <span className="text-xs uppercase tracking-widest font-bold text-emerald-600 mb-1 block">
              ¡Confirmación Guardada!
            </span>
            <h3 className="font-serif text-2xl font-bold text-slate-800 mb-2">
              Muchas gracias, {currentUser.fullName}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 mb-6">
              {attending === 'yes'
                ? '¡Tus lugares han quedado registrados! Ahora presiona el botón para enviar los datos al WhatsApp de Estefanía y Carlos.'
                : 'Agradecemos de corazón tu aviso y tus palabras con cariño.'}
            </p>

            {/* Pase Digital */}
            {attending === 'yes' && (
              <div className="rounded-2xl p-5 bg-gradient-to-br from-rose-50 via-white to-sky-50 border border-purple-200/80 shadow-sm text-left mb-6 relative overflow-hidden">
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-purple-100 text-purple-700 text-[11px] font-mono font-bold">
                  {ticketId}
                </div>

                <div className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-1">
                  Pase de Invitado Oficial
                </div>
                <div className="font-bold text-slate-800 text-lg mb-3">
                  {currentUser.fullName}
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs border-t border-slate-200/60 pt-3">
                  <div>
                    <span className="text-slate-400 block">Fecha</span>
                    <strong className="text-slate-700">{date.displayDate}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Hora</span>
                    <strong className="text-slate-700">{date.displayTime}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Asistentes</span>
                    <strong className="text-slate-700">{adultsCount} Adultos, {childrenCount} Niños</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Tu Predicción</span>
                    <strong className={userVote === 'boy' ? 'text-sky-600' : 'text-rose-600'}>
                      {userVote === 'boy' ? '👦 Team Niño' : '👧 Team Niña'}
                    </strong>
                  </div>
                </div>

                {companions.filter(c => c.trim()).length > 0 && (
                  <div className="mt-3 pt-2 border-t border-slate-200/60 text-xs">
                    <span className="text-slate-400 block">Acompañantes:</span>
                    <span className="text-slate-700 font-medium">
                      {companions.filter(c => c.trim()).join(', ')}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Botón para enviar datos al WhatsApp del organizador */}
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={handleSendToWhatsapp}
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Enviar confirmación al WhatsApp de Estefanía y Carlos</span>
              </button>

              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="py-2.5 px-4 text-xs text-slate-500 hover:text-slate-800 transition-colors"
              >
                Modificar o registrar otra respuesta
              </button>
            </div>
          </div>
        )}

        {currentUser && !submitted && (
          <form
            onSubmit={handleSubmit}
            className="glass-card rounded-3xl p-6 sm:p-8 shadow-lg border border-white space-y-6"
          >
            {/* Header de Invitado Detectado */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50/80 to-rose-50/80 border border-purple-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 block">
                  Invitado Registrado
                </span>
                <p className="font-bold text-slate-800 text-sm">
                  {currentUser.fullName}
                </p>
                <p className="text-xs text-slate-500">
                  📱 {currentUser.phone}
                </p>
              </div>

              {/* Indicador del Voto Seleccionado en la sección anterior */}
              <div className="text-right">
                <span className="text-[11px] font-bold text-slate-400 block">
                  Tu Predicción:
                </span>
                <span className={`inline-flex items-center gap-1 font-bold text-xs px-2.5 py-1 rounded-full ${
                  userVote === 'boy' ? 'bg-sky-100 text-sky-700' : 'bg-rose-100 text-rose-700'
                }`}>
                  {userVote === 'boy' ? '👦 Team Niño' : '👧 Team Niña'}
                </span>
              </div>
            </div>

            {/* ¿Asistirás? */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                ¿Podrás asistir este Sábado 7 de Noviembre? *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAttending('yes')}
                  className={`py-3 px-4 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    attending === 'yes'
                      ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-200'
                      : 'bg-white/80 text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span>¡Sí, asistiré con alegría! 🎉</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAttending('no')}
                  className={`py-3 px-4 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    attending === 'no'
                      ? 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-200'
                      : 'bg-white/80 text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span>No podré asistir 😢</span>
                </button>
              </div>
            </div>

            {/* Campos condicionales si asiste */}
            {attending === 'yes' && (
              <div className="space-y-5 pt-3 border-t border-slate-100 animate-in fade-in duration-200">
                {/* Cantidad de Adultos y Niños */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Adultos
                    </label>
                    <select
                      value={adultsCount}
                      onChange={(e) => setAdultsCount(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-sm outline-none focus:border-purple-400"
                    >
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? 'Adulto' : 'Adultos'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Niños
                    </label>
                    <select
                      value={childrenCount}
                      onChange={(e) => setChildrenCount(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-sm outline-none focus:border-purple-400"
                    >
                      {[0, 1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? 'Niño' : 'Niños'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Campos dinámicos para los nombres de los acompañantes */}
                <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-purple-600" />
                      <span>Nombres de tus Acompañantes</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleAddCompanion}
                      className="text-xs font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1 bg-purple-50 hover:bg-purple-100 px-2.5 py-1 rounded-lg transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Agregar acompañante</span>
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-500 mb-3">
                    Agrega los nombres de quienes vendrán contigo para tener sus identificaciones y sorpresas listas:
                  </p>

                  {companions.length === 0 ? (
                    <div className="text-xs text-slate-400 italic py-2 text-center bg-white rounded-xl border border-dashed border-slate-200">
                      ¿Vienes acompañado? Presiona "+ Agregar acompañante" para escribir sus nombres.
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {companions.map((name, index) => (
                        <div key={index} className="flex items-center gap-2 animate-in fade-in duration-150">
                          <span className="text-xs font-bold text-slate-400 w-6 text-center">
                            #{index + 1}
                          </span>
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => handleCompanionChange(index, e.target.value)}
                            placeholder={`Nombre del acompañante ${index + 1}`}
                            className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs outline-none focus:border-purple-400"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveCompanion(index)}
                            className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                            title="Quitar acompañante"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Restricción alimentaria */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1">
                    <Utensils className="w-3.5 h-3.5 text-amber-500" />
                    <span>Restricciones Alimentarias o Alergias (Opcional)</span>
                  </label>
                  <input
                    type="text"
                    value={dietary}
                    onChange={(e) => setDietary(e.target.value)}
                    placeholder="Ej: Vegetariano, celíaco, alergia a nueces o lácteos..."
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-purple-400 text-sm outline-none transition-all"
                  />
                </div>
              </div>
            )}

            {/* Mensaje de Dedicatoria de Amor para los papás y el bebé */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                <span>Mensaje o Dedicatoria para Estefanía, Carlos y el Bebé</span>
              </label>
              <p className="text-[11px] text-slate-500 mb-2">
                Este mensaje quedará plasmado públicamente en nuestro Muro de Amor para que todos puedan leer tus buenos deseos.
              </p>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                placeholder="Escribe unas palabras llenas de cariño para los futuros papás..."
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-purple-400 text-sm outline-none transition-all resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-rose-500 via-purple-500 to-sky-500 hover:from-rose-600 hover:via-purple-600 hover:to-sky-600 text-white font-bold text-sm shadow-lg shadow-purple-500/25 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Guardar y Confirmar Asistencia</span>
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
