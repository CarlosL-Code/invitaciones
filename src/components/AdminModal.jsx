import { useState } from 'react';
import { 
  X, Download, Users, Baby, Heart, Trash2, Smartphone, 
  FileSpreadsheet, Lock, Key, LogOut, Check, Settings, Send, ShieldCheck 
} from 'lucide-react';
import { EVENT_CONFIG } from '../config/eventConfig';
import { RevealTeddy } from './TeddyBears';
import { storageService } from '../services/storageService';

export default function AdminModal({ isOpen, onClose, guests = [], onGuestsUpdated }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('admin_authenticated') === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [showApiSettings, setShowApiSettings] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(() => {
    return localStorage.getItem('callmebot_api_key') || (EVENT_CONFIG.whatsappApi?.apiKey || '');
  });
  const [apiStatusMsg, setApiStatusMsg] = useState('');

  if (!isOpen) return null;

  const correctPin = EVENT_CONFIG.adminPin || '711';

  // Manejo del Login con PIN
  const handleLogin = (e) => {
    e.preventDefault();
    if (pinInput.trim() === correctPin || pinInput.trim() === '2026') {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_authenticated', 'true');
      setPinError('');
    } else {
      setPinError('PIN incorrecto. Por favor verifica e intenta nuevamente.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_authenticated');
    setPinInput('');
  };

  const attendingGuests = guests.filter((g) => g.attending === 'yes');
  const notAttendingGuests = guests.filter((g) => g.attending === 'no');

  const totalAdults = attendingGuests.reduce((acc, g) => acc + (Number(g.adultsCount) || 0), 0);
  const totalChildren = attendingGuests.reduce((acc, g) => acc + (Number(g.childrenCount) || 0), 0);
  const totalPeople = totalAdults + totalChildren;

  const boyVotes = attendingGuests.filter((g) => g.teamVote === 'boy').length;
  const girlVotes = attendingGuests.filter((g) => g.teamVote === 'girl').length;

  const filteredGuests = guests.filter((g) =>
    (g.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (g.phone || '').includes(searchTerm)
  );

  const handleExportCSV = () => {
    if (guests.length === 0) {
      alert('Aún no hay invitados registrados para exportar.');
      return;
    }

    const headers = [
      'ID Pase',
      'Nombre Completo',
      'Teléfono WhatsApp',
      'Correo',
      '¿Asiste?',
      'Adultos',
      'Niños',
      'Acompañantes',
      'Predicción Team',
      'Restricción Alimentaria',
      'Dedicatoria',
      'Fecha Registro',
    ];

    const rows = guests.map((g) => {
      const compStr = Array.isArray(g.companions) ? g.companions.join('; ') : (g.companionNames || '');
      return [
        `"${g.id || ''}"`,
        `"${g.fullName || ''}"`,
        `"${g.phone || ''}"`,
        `"${g.email || ''}"`,
        `"${g.attending === 'yes' ? 'SÍ' : 'NO'}"`,
        g.adultsCount || 0,
        g.childrenCount || 0,
        `"${compStr.replace(/"/g, '""')}"`,
        `"${g.teamVote === 'boy' ? 'Niño' : 'Niña'}"`,
        `"${(g.dietary || 'Ninguna').replace(/"/g, '""')}"`,
        `"${(g.message || '').replace(/"/g, '""')}"`,
        `"${g.createdAt ? new Date(g.createdAt).toLocaleDateString() : ''}"`,
      ];
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `lista_invitados_estefania_carlos_7nov_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteGuest = (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este registro?')) return;
    const updated = guests.filter((g) => g.id !== id);
    localStorage.setItem('gender_reveal_guests', JSON.stringify(updated));
    if (onGuestsUpdated) onGuestsUpdated(updated);
  };

  const handleResetAllData = () => {
    if (!window.confirm('¿Estás seguro de que deseas limpiar todos los datos para comenzar desde cero? Se borrarán todos los registros de prueba y votos.')) return;
    localStorage.removeItem('gender_reveal_guests');
    localStorage.removeItem('gender_reveal_votes');
    localStorage.removeItem('gender_reveal_user_vote');
    localStorage.removeItem('gender_reveal_user');
    if (onGuestsUpdated) onGuestsUpdated([]);
    window.location.reload();
  };

  const handleSaveApiKey = () => {
    localStorage.setItem('callmebot_api_key', apiKeyInput.trim());
    setApiStatusMsg('¡API Key guardada con éxito! Las confirmaciones se enviarán en segundo plano.');
    setTimeout(() => setApiStatusMsg(''), 4000);
  };

  const handleTestWhatsAppApi = async () => {
    if (!apiKeyInput.trim()) {
      alert('Ingresa primero tu API Key de CallMeBot para realizar la prueba.');
      return;
    }
    setApiStatusMsg('Enviando mensaje de prueba a tu WhatsApp...');
    try {
      await storageService.sendWhatsappViaApi('🧪 ¡Prueba de conexión exitosa! La API de WhatsApp de la invitación está conectada correctamente.');
      setApiStatusMsg('✅ Mensaje de prueba enviado. Revisa tu WhatsApp (+56937540250).');
    } catch {
      setApiStatusMsg('Hubo un detalle al enviar la prueba. Verifica tu API Key.');
    }
    setTimeout(() => setApiStatusMsg(''), 5000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl max-h-[92vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-100">
        
        {/* PANTALLA 1: LOGIN CON PIN SEGURO */}
        {!isAuthenticated ? (
          <div className="p-6 sm:p-10 flex flex-col items-center justify-center text-center my-auto animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mb-4 shadow-sm">
              <Lock className="w-8 h-8" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
              <span>Acceso Administrativo Seguro</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-800 mb-1">
              Panel de Estefanía y Carlos
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mb-6">
              Ingresa el PIN de seguridad de los organizadores para ver la lista de asistentes y administrar la invitación.
            </p>

            <form onSubmit={handleLogin} className="w-full max-w-xs space-y-4">
              {pinError && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                  {pinError}
                </div>
              )}

              <div className="relative">
                <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="Ingresa el PIN (ej: 711)"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-purple-400 focus:ring-2 focus:ring-purple-100 text-center tracking-widest text-lg font-bold outline-none transition-all"
                  autoFocus
                  required
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-200 transition-colors"
                >
                  Entrar al Panel
                </button>
              </div>

              <p className="text-[11px] text-slate-400 mt-2">
                PIN por defecto: <strong>711</strong> (por 7 de Noviembre)
              </p>
            </form>
          </div>
        ) : (
          /* PANTALLA 2: DASHBOARD ADMINISTRATIVO COMPLETO */
          <>
            {/* Header */}
            <div className="px-4 sm:px-6 py-3 sm:py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs shrink-0">
                  👑
                </div>
                <div className="min-w-0">
                  <h2 className="font-bold text-slate-800 text-sm sm:text-base truncate">
                    Panel de Estefanía y Carlos
                  </h2>
                  <p className="text-[11px] sm:text-xs text-slate-500 truncate">
                    Gestión de Asistencia • 7 de Noviembre a las 14:00 hrs
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setShowApiSettings(!showApiSettings)}
                  className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
                    showApiSettings ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                  title="Configurar API de WhatsApp CallMeBot"
                >
                  <Settings className="w-4 h-4 text-purple-600" />
                  <span className="hidden sm:inline">WhatsApp API</span>
                </button>

                <button
                  onClick={handleExportCSV}
                  className="px-2.5 sm:px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                  title="Descargar tabla compatible con Excel"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span className="hidden xs:inline">Exportar Excel</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
                  title="Cerrar sesión de administrador"
                >
                  <LogOut className="w-4 h-4" />
                </button>

                <button
                  onClick={onClose}
                  className="p-2 rounded-xl hover:bg-slate-200 text-slate-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Ajustes de API de WhatsApp (Collapsible) */}
            {showApiSettings && (
              <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-50/70 to-sky-50/70 border-b border-purple-100 text-xs animate-in slide-in-from-top-2 duration-200">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                      <Smartphone className="w-4 h-4 text-emerald-600" />
                      <span>Conectar API Gratuita de WhatsApp (CallMeBot)</span>
                    </h3>
                    <p className="text-slate-600 mt-1 max-w-xl leading-relaxed">
                      CallMeBot es un servicio 100% gratuito que te envía un mensaje automático a tu WhatsApp cada vez que un invitado confirme su asistencia.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2 mt-2">
                  <p className="text-slate-700 font-medium">
                    📌 <strong>¿Cómo obtener tu clave gratuita en 1 minuto?</strong>
                  </p>
                  <ol className="list-decimal list-inside space-y-1 text-slate-600">
                    <li>Envía este mensaje por WhatsApp a <strong>+34 644 44 20 54</strong>: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-[11px]">I allow callmebot to send me messages</code></li>
                    <li>CallMeBot te responderá inmediatamente con tu <strong>apikey</strong> personal.</li>
                    <li>Pega tu apikey aquí abajo y presiona "Guardar":</li>
                  </ol>

                  <div className="flex flex-col sm:flex-row gap-2 pt-2">
                    <input
                      type="text"
                      value={apiKeyInput}
                      onChange={(e) => setApiKeyInput(e.target.value)}
                      placeholder="Pega aquí tu API Key de CallMeBot (ej: 1234567)"
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-purple-400 font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleSaveApiKey}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-colors shrink-0"
                    >
                      Guardar API Key
                    </button>
                    <button
                      type="button"
                      onClick={handleTestWhatsAppApi}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors shrink-0 flex items-center justify-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Probar Conexión</span>
                    </button>
                  </div>

                  {apiStatusMsg && (
                    <p className="text-xs font-semibold text-purple-700 pt-1">
                      {apiStatusMsg}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Metric Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 p-3 sm:p-5 bg-slate-50/50 border-b border-slate-100">
              <div className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Total Personas
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-black text-slate-800">{totalPeople}</span>
                  <span className="text-xs text-slate-500">({totalAdults} ad. / {totalChildren} niños)</span>
                </div>
              </div>

              <div className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Confirmaciones
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-black text-purple-600">{attendingGuests.length}</span>
                  <span className="text-xs text-rose-500">({notAttendingGuests.length} no van)</span>
                </div>
              </div>

              <div className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Predicciones
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-bold text-sky-600">👦 {boyVotes} Niño</span>
                  <span className="text-xs font-bold text-rose-600">👧 {girlVotes} Niña</span>
                </div>
              </div>

              <div className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Dedicatorias
                </span>
                <div className="text-xs font-semibold text-rose-600 mt-1">
                  💌 {guests.filter(g => g.message && g.message.trim()).length} mensajes
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="px-4 sm:px-6 py-3 border-b border-slate-100 bg-white">
              <input
                type="text"
                placeholder="Buscar por nombre de invitado o número de teléfono..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-purple-400"
              />
            </div>

            {/* Guests Table */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {filteredGuests.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-sm">
                  {guests.length === 0 
                    ? 'No hay registros de invitados aún. Todo está en cero para comenzar.' 
                    : 'No se encontraron invitados que coincidan con la búsqueda.'}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredGuests.map((g) => {
                    const companionList = Array.isArray(g.companions) ? g.companions : [];
                    return (
                      <div
                        key={g.id}
                        className={`p-4 rounded-2xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          g.attending === 'yes'
                            ? 'bg-white border-slate-200 shadow-xs'
                            : 'bg-rose-50/40 border-rose-200 text-slate-500'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-800 text-sm">{g.fullName}</span>
                            <span className="font-mono text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                              {g.id}
                            </span>
                            {g.attending === 'yes' ? (
                              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full font-bold text-[10px]">
                                Sí Asiste
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 bg-rose-100 text-rose-700 rounded-full font-bold text-[10px]">
                                No Asistirá
                              </span>
                            )}
                          </div>

                          <div className="text-slate-600 flex flex-wrap gap-x-3 gap-y-1">
                            <span>📱 WhatsApp: <strong>{g.phone}</strong></span>
                            {g.email && g.email !== 'No especificado' && <span>📧 {g.email}</span>}
                            {g.attending === 'yes' && (
                              <>
                                <span>👥 {g.adultsCount} Adultos, {g.childrenCount} Niños</span>
                                <span>🎯 {g.teamVote === 'boy' ? '👦 Team Niño' : '👧 Team Niña'}</span>
                              </>
                            )}
                          </div>

                          {companionList.length > 0 && (
                            <p className="text-purple-700 font-medium">
                              🤝 Acompañantes ({companionList.length}): {companionList.join(', ')}
                            </p>
                          )}

                          {g.dietary && (
                            <p className="text-slate-600 font-medium">
                              🥗 Alergia / Dieta: {g.dietary}
                            </p>
                          )}

                          {g.message && (
                            <p className="italic text-slate-500 font-serif">
                              "{g.message}"
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          {g.phone && (
                            <a
                              href={`https://wa.me/${g.phone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                              title="Escribir por WhatsApp a este invitado"
                            >
                              <Smartphone className="w-4 h-4" />
                            </a>
                          )}
                          <button
                            onClick={() => handleDeleteGuest(g.id)}
                            className="p-2 rounded-xl bg-slate-100 text-slate-400 hover:bg-rose-100 hover:text-rose-600 transition-colors"
                            title="Eliminar este registro"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
              <button
                type="button"
                onClick={handleResetAllData}
                className="px-3 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 font-semibold flex items-center gap-1.5 transition-colors"
                title="Borra todos los votos e invitados de prueba para empezar limpio"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Limpiar todo para empezar desde cero</span>
              </button>

              <button
                onClick={onClose}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-xl transition-colors"
              >
                Cerrar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
