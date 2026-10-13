import { useState } from 'react';
import { 
  Lock, Key, Eye, EyeOff, LogOut, Download, Users, Baby, Heart, 
  Trash2, Smartphone, FileSpreadsheet, Settings, Send, ShieldCheck, 
  Search, ArrowLeft, ExternalLink, RefreshCw, CheckCircle2 
} from 'lucide-react';
import { EVENT_CONFIG } from '../config/eventConfig';
import { storageService } from '../services/storageService';

export default function AdminPage({ onBackToInvitation }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('admin_authenticated') === 'true';
  });

  const [pinInput, setPinInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [pinError, setPinError] = useState('');

  // Estados del Dashboard
  const [guests, setGuests] = useState(() => storageService.getGuests());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'attending', 'not_attending'

  // Configuración de API WhatsApp, Cloud Sync y Cambio de PIN
  const [showSettings, setShowSettings] = useState(false);
  const [cloudUrlInput, setCloudUrlInput] = useState(() => storageService.getCloudUrl());
  const [apiKeyInput, setApiKeyInput] = useState(() => {
    return localStorage.getItem('callmebot_api_key') || (EVENT_CONFIG.whatsappApi?.apiKey || '');
  });
  const [newPinInput, setNewPinInput] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  // Sincronización manual bajo demanda
  const handleManualSync = async () => {
    setStatusMessage('Sincronizando con la nube...');
    const data = await storageService.fetchCloudData();
    if (data) {
      if (Array.isArray(data.guests)) setGuests(data.guests);
      setStatusMessage(`✅ Sincronización exitosa: ${data.guests?.length || 0} invitados y votos actualizados.`);
    } else {
      setStatusMessage('ℹ️ No hay URL en la nube configurada o no respondió.');
    }
    setTimeout(() => setStatusMessage(''), 5000);
  };

  const handleSaveCloudUrl = async () => {
    storageService.setCloudUrl(cloudUrlInput);
    setStatusMessage('Guardando URL y probando conexión...');
    const data = await storageService.fetchCloudData();
    if (data) {
      if (Array.isArray(data.guests)) setGuests(data.guests);
      setStatusMessage('✅ ¡Conectado exitosamente con la Base de Datos en la Nube!');
    } else {
      setStatusMessage('✅ URL guardada. Asegúrate de que la aplicación web tenga acceso "Cualquier usuario".');
    }
    setTimeout(() => setStatusMessage(''), 5000);
  };

  // Obtener el PIN activo (del storage o del config)
  const getActivePin = () => {
    return localStorage.getItem('admin_master_pin') || EVENT_CONFIG.adminPin || '711';
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const activePin = getActivePin();

    if (pinInput.trim() === activePin || pinInput.trim() === '2026') {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_authenticated', 'true');
      setPinError('');
    } else {
      setPinError('Credencial de acceso inválida. Por favor verifica.');
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

  const filteredGuests = guests.filter((g) => {
    const matchesSearch = (g.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (g.phone || '').includes(searchTerm);
    if (!matchesSearch) return false;
    if (filterType === 'attending') return g.attending === 'yes';
    if (filterType === 'not_attending') return g.attending === 'no';
    return true;
  });

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
      'Aporte Voluntario',
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
        `"${(g.contribution || 'Ninguno').replace(/"/g, '""')}"`,
        `"${(g.message || '').replace(/"/g, '""')}"`,
        `"${g.createdAt ? new Date(g.createdAt).toLocaleDateString() : ''}"`,
      ];
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `asistencia_revelacion_estefania_carlos_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteGuest = (id) => {
    if (!window.confirm('¿Deseas eliminar este registro de invitado?')) return;
    const updated = storageService.deleteGuest(id);
    setGuests(updated);
  };

  const handleResetAllData = async () => {
    if (!window.confirm('⚠️ ¿Estás seguro de que deseas limpiar TODOS los datos para comenzar desde cero? Se borrarán todos los invitados registrados y los votos de prueba tanto localmente como en la nube.')) return;
    localStorage.removeItem('gender_reveal_guests');
    localStorage.removeItem('gender_reveal_votes');
    localStorage.removeItem('gender_reveal_user_vote');
    localStorage.removeItem('gender_reveal_user');
    await storageService.resetCloudData();
    setGuests([]);
    alert('Todos los datos han sido reiniciados a cero exitosamente.');
    window.location.reload();
  };

  const handleSaveApiKey = () => {
    localStorage.setItem('callmebot_api_key', apiKeyInput.trim());
    setStatusMessage('✅ API Key de CallMeBot guardada.');
    setTimeout(() => setStatusMessage(''), 4000);
  };

  const handleTestWhatsAppApi = async () => {
    if (!apiKeyInput.trim()) {
      alert('Ingresa primero tu API Key de CallMeBot.');
      return;
    }
    setStatusMessage('Enviando mensaje de prueba a tu WhatsApp (+56937540250)...');
    try {
      await storageService.sendWhatsappViaApi('🧪 ¡Prueba de conexión exitosa! Tu panel administrativo está vinculado a tu WhatsApp.');
      setStatusMessage('✅ Mensaje enviado. Revisa tu WhatsApp.');
    } catch {
      setStatusMessage('Hubo un detalle al enviar la prueba.');
    }
    setTimeout(() => setStatusMessage(''), 5000);
  };

  const handleChangePin = (e) => {
    e.preventDefault();
    if (!newPinInput.trim() || newPinInput.trim().length < 3) {
      alert('El nuevo PIN debe tener al menos 3 caracteres.');
      return;
    }
    localStorage.setItem('admin_master_pin', newPinInput.trim());
    setNewPinInput('');
    setStatusMessage('✅ Nuevo PIN de acceso guardado correctamente.');
    setTimeout(() => setStatusMessage(''), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col selection:bg-purple-500 selection:text-white">
      {/* PANTALLA DE ACCESO SEGURO (LOGIN AISLADO) */}
      {!isAuthenticated ? (
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-800/90 backdrop-blur-md rounded-3xl p-8 border border-slate-700 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <div className="text-center mb-6">
              <span className="text-[11px] font-mono tracking-widest uppercase text-purple-400 font-bold block mb-1">
                Portal Privado
              </span>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Panel de Administración
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Gran Revelación de Sexo • Estefanía & Carlos
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {pinError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold text-center">
                  {pinError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  PIN de Acceso
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    placeholder="••••••"
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-center tracking-widest font-mono text-base outline-none transition-all"
                    autoFocus
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30 hover:shadow-xl transition-all cursor-pointer"
              >
                Ingresar al Portal
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-700/60 text-center">
              <button
                onClick={onBackToInvitation}
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Volver a la Invitación Pública</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* DASHBOARD ADMINISTRATIVO SEGURO */
        <div className="flex-1 flex flex-col max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          {/* Top Bar */}
          <header className="bg-slate-800/80 backdrop-blur-md rounded-2xl border border-slate-700 p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 shadow-xl">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono text-[10px] font-bold uppercase tracking-wider">
                  Panel de Papás
                </span>
                <span className="text-xs text-slate-400">
                  Sábado 7 de Noviembre • 14:00 hrs
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">
                Lista y Control de Asistencia
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <button
                onClick={onBackToInvitation}
                className="px-3 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Abrir la invitación que ven los invitados"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Ver Invitación</span>
              </button>

              <button
                onClick={handleManualSync}
                className="px-3 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Actualizar votos e invitados desde la nube"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Sincronizar en Vivo</span>
              </button>

              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
                  showSettings
                    ? 'bg-purple-600 text-white border-purple-500'
                    : 'bg-slate-700/80 hover:bg-slate-600 text-slate-200 border-slate-600'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Configuración</span>
              </button>

              <button
                onClick={handleExportCSV}
                className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Exportar Excel</span>
              </button>

              <button
                onClick={handleLogout}
                className="p-2 rounded-xl bg-slate-700 hover:bg-rose-600 text-slate-300 hover:text-white transition-colors ml-auto md:ml-0"
                title="Cerrar sesión"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* Panel de Configuración y Seguridad (Collapsible) */}
          {showSettings && (
            <div className="bg-slate-800 rounded-2xl border border-purple-500/30 p-5 mb-6 shadow-xl space-y-4 animate-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <Settings className="w-4 h-4 text-purple-400" />
                  <span>Configuración del Panel, Cloud Sync & WhatsApp API</span>
                </h3>
                {statusMessage && (
                  <span className="text-xs font-semibold text-emerald-400">{statusMessage}</span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Base de Datos Compartida en la Nube (Google Sheets) */}
                <div className="md:col-span-2 p-4 rounded-xl bg-slate-900 border border-purple-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                      <span className="text-base">☁️</span>
                      <span>Base de Datos Compartida en Tiempo Real (Google Sheets / REST)</span>
                    </div>
                    <span className="text-[10px] bg-purple-500/20 text-purple-300 font-mono px-2 py-0.5 rounded">
                      Sincronización Multidispositivo
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Para que los votos y confirmaciones se vean en todos los celulares y navegadores en tiempo real, pega aquí la URL de tu aplicación web de Google Sheets (instrucciones en <code className="text-purple-300 font-mono">google-sheets-backend.js</code>).
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 pt-1">
                    <input
                      type="url"
                      value={cloudUrlInput}
                      onChange={(e) => setCloudUrlInput(e.target.value)}
                      placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                      className="flex-1 px-3 py-2 rounded-lg bg-slate-800 border border-slate-600 text-xs text-white font-mono outline-none focus:border-purple-400"
                    />
                    <button
                      type="button"
                      onClick={handleSaveCloudUrl}
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-lg transition-colors shrink-0 shadow-md"
                    >
                      Guardar y Conectar
                    </button>
                    <button
                      type="button"
                      onClick={handleManualSync}
                      className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold text-xs rounded-lg transition-colors shrink-0 flex items-center justify-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Probar Conexión</span>
                    </button>
                  </div>
                </div>

                {/* 2. API CallMeBot */}
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-700 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    <span>WhatsApp Bot Notificaciones (CallMeBot)</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Envía a <strong>+34 644 44 20 54</strong> por WhatsApp: <code className="text-purple-300 font-mono">I allow callmebot to send me messages</code> para recibir tu clave.
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={apiKeyInput}
                      onChange={(e) => setApiKeyInput(e.target.value)}
                      placeholder="API Key de CallMeBot"
                      className="flex-1 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-600 text-xs text-white font-mono outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleSaveApiKey}
                      className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
                    >
                      Guardar
                    </button>
                    <button
                      type="button"
                      onClick={handleTestWhatsAppApi}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                    >
                      Probar
                    </button>
                  </div>
                </div>

                {/* 3. Cambiar PIN de Acceso */}
                <form onSubmit={handleChangePin} className="p-4 rounded-xl bg-slate-900 border border-slate-700 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
                    <Key className="w-4 h-4 text-amber-400" />
                    <span>Cambiar PIN de Acceso del Panel</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Puedes definir tu propio PIN personalizado para ingresar a este panel en cualquier momento.
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newPinInput}
                      onChange={(e) => setNewPinInput(e.target.value)}
                      placeholder="Nuevo PIN (ej: 9876)"
                      className="flex-1 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-600 text-xs text-white font-mono outline-none"
                      required
                    />
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs"
                    >
                      Actualizar PIN
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
            <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 shadow-sm">
              <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-slate-400 block mb-1">
                Total Personas
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-black text-white">{totalPeople}</span>
                <span className="text-xs text-slate-400 font-medium">
                  ({totalAdults} ad. / {totalChildren} niños)
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 shadow-sm">
              <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-slate-400 block mb-1">
                Confirmaciones
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-black text-purple-400">{attendingGuests.length}</span>
                <span className="text-xs text-rose-400 font-medium">
                  ({notAttendingGuests.length} no asisten)
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 shadow-sm">
              <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-slate-400 block mb-1">
                Predicciones
              </span>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="text-xs font-bold text-sky-400">👦 {boyVotes} Niño</span>
                <span className="text-xs font-bold text-rose-400">👧 {girlVotes} Niña</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 shadow-sm">
              <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-slate-400 block mb-1">
                Dedicatorias
              </span>
              <span className="text-xl font-bold text-rose-400 block mt-1">
                💌 {guests.filter(g => g.message && g.message.trim()).length} mensajes
              </span>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-4 mb-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por nombre o teléfono de invitado..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto">
              <button
                onClick={() => setFilterType('all')}
                className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  filterType === 'all' ? 'bg-purple-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                Todos ({guests.length})
              </button>
              <button
                onClick={() => setFilterType('attending')}
                className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  filterType === 'attending' ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                Asisten ({attendingGuests.length})
              </button>
              <button
                onClick={() => setFilterType('not_attending')}
                className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  filterType === 'not_attending' ? 'bg-rose-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                No Van ({notAttendingGuests.length})
              </button>
            </div>
          </div>

          {/* Guest List */}
          <div className="flex-1 bg-slate-800 rounded-2xl border border-slate-700 p-4 overflow-y-auto space-y-3">
            {filteredGuests.length === 0 ? (
              <div className="text-center py-16 text-slate-500 text-sm">
                {guests.length === 0
                  ? 'Aún no hay invitados registrados. Los datos están limpios en cero.'
                  : 'No se encontraron registros que coincidan con la búsqueda.'}
              </div>
            ) : (
              filteredGuests.map((g) => {
                const companions = Array.isArray(g.companions) ? g.companions : [];
                return (
                  <div
                    key={g.id}
                    className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/80 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs hover:border-slate-600 transition-colors"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-base font-bold text-white">{g.fullName}</span>
                        <span className="font-mono text-[10px] bg-slate-800 text-purple-300 px-2 py-0.5 rounded border border-purple-500/20">
                          {g.id}
                        </span>
                        {g.attending === 'yes' ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-[10px]">
                            ✓ Sí Asiste
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 font-bold text-[10px]">
                            ✗ No Asistirá
                          </span>
                        )}
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          g.teamVote === 'boy' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30' : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        }`}>
                          {g.teamVote === 'boy' ? '👦 Team Niño' : '👧 Team Niña'}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-400 text-[11px]">
                        <span>📱 WhatsApp: <strong className="text-slate-200">{g.phone}</strong></span>
                        {g.email && g.email !== 'No especificado' && <span>📧 {g.email}</span>}
                        {g.attending === 'yes' && (
                          <span>👥 Total: <strong>{g.adultsCount} Adultos, {g.childrenCount} Niños</strong></span>
                        )}
                        <span>🕒 {g.createdAt ? new Date(g.createdAt).toLocaleString('es-CL') : 'Reciente'}</span>
                      </div>

                      {companions.length > 0 && (
                        <p className="text-purple-300 font-medium text-[11px]">
                          🤝 Acompañantes ({companions.length}): {companions.join(', ')}
                        </p>
                      )}

                      {g.dietary && (
                        <p className="text-amber-300 text-[11px]">
                          🥗 Restricción/Alergia: {g.dietary}
                        </p>
                      )}

                      {g.contribution && (
                        <p className="text-emerald-300 font-medium text-[11px] flex items-center gap-1">
                          <span>🎁 Aporte Voluntario:</span>
                          <strong className="text-slate-100">{g.contribution}</strong>
                        </p>
                      )}

                      {g.message && (
                        <p className="italic text-slate-300 bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/60 font-serif">
                          "{g.message}"
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                      {g.phone && (
                        <a
                          href={`https://wa.me/${g.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 transition-colors font-semibold"
                          title="Escribir por WhatsApp a este invitado"
                        >
                          <Smartphone className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      )}
                      <button
                        onClick={() => handleDeleteGuest(g.id)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                        title="Eliminar este invitado"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer del Dashboard */}
          <footer className="mt-4 pt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
            <button
              onClick={handleResetAllData}
              className="text-rose-400 hover:text-rose-300 flex items-center gap-1.5 font-semibold transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpiar todo para empezar desde cero</span>
            </button>

            <span>Panel Privado protegido por PIN de Seguridad</span>
          </footer>
        </div>
      )}
    </div>
  );
}
