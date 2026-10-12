import { useState } from 'react';
import { User, Mail, Phone, Sparkles, Heart } from 'lucide-react';
import { WelcomeTeddyPair } from './TeddyBears';
import { triggerCelebrationConfetti } from '../utils/confetti';
import { EVENT_CONFIG } from '../config/eventConfig';
import { storageService } from '../services/storageService';

export default function RegistrationModal({ isOpen, onRegister }) {
  const { parents } = EVENT_CONFIG;
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
  });
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      setError('Por favor ingresa tu nombre completo.');
      return;
    }
    if (!formData.phone.trim()) {
      setError('Por favor ingresa tu número de WhatsApp.');
      return;
    }

    setError('');
    const userRecord = {
      fullName: formData.fullName.trim(),
      email: formData.email.trim() || 'No especificado',
      phone: formData.phone.trim(),
      registeredAt: new Date().toISOString(),
    };

    storageService.saveUser(userRecord);
    triggerCelebrationConfetti();
    onRegister(userRecord);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-gradient-to-b from-white via-rose-50/30 to-sky-50/30 w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-white relative overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Decorative corner glows */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-sky-200/50 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-rose-200/50 rounded-full blur-2xl pointer-events-none" />

        {/* Teddy Pair Illustration */}
        <div className="mb-2">
          <WelcomeTeddyPair className="h-28 sm:h-32" />
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100/80 text-purple-700 text-xs font-bold uppercase tracking-wider mb-2 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Invitación Exclusiva</span>
          </div>
          
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-800 leading-tight">
            Gran Revelación de Sexo
          </h2>
          <p className="font-script text-2xl text-rose-500 mt-0.5">
            {parents.motherName} & {parents.fatherName}
          </p>
          
          <p className="text-xs text-slate-600 mt-2 max-w-xs mx-auto">
            ¡Qué alegría que nos acompañes! Para ingresar a la invitación y votar tu predicción, ingresa tus datos:
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs text-center font-medium">
              {error}
            </div>
          )}

          {/* Nombre */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Nombre Completo *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Ej: Carolina Morales"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-slate-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 text-sm outline-none transition-all shadow-xs"
                required
              />
            </div>
          </div>

          {/* WhatsApp */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Número de WhatsApp *
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Ej: +56 9 1234 5678"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-slate-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 text-sm outline-none transition-all shadow-xs"
                required
              />
            </div>
          </div>

          {/* Correo */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Correo Electrónico (Opcional)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Ej: carolina@correo.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-slate-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 text-sm outline-none transition-all shadow-xs"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-rose-500 via-purple-500 to-sky-500 hover:from-rose-600 hover:via-purple-600 hover:to-sky-600 text-white font-bold text-sm shadow-lg shadow-purple-500/25 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 mt-2"
          >
            <Heart className="w-4 h-4 fill-white" />
            <span>Ingresar a la Invitación ✨</span>
          </button>
        </form>

        <p className="text-[11px] text-center text-slate-400 mt-4">
          Tus datos serán enviados con tu confirmación a los papás.
        </p>
      </div>
    </div>
  );
}
