import { useState } from 'react';
import { X, Download, Users, Baby, Heart, Trash2, Smartphone, FileSpreadsheet, Cake } from 'lucide-react';

export default function AdminModal({ isOpen, onClose, guests = [], onGuestsUpdated }) {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
              👑
            </div>
            <div>
              <h2 className="font-bold text-slate-800 text-base">
                Panel de Estefanía y Carlos
              </h2>
              <p className="text-xs text-slate-500">
                Lista de Asistencia & Aportes para el 7 de Noviembre
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
              title="Descargar tabla compatible con Excel"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Exportar Excel (CSV)</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-6 bg-slate-50/50 border-b border-slate-100">
          <div className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Total Asistentes
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
              <span className="text-xs text-rose-500">({notAttendingGuests.length} cancelados)</span>
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
        <div className="px-6 py-3 border-b border-slate-100 bg-white">
          <input
            type="text"
            placeholder="Buscar por nombre o teléfono..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-purple-400"
          />
        </div>

        {/* Guests Table */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredGuests.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              No hay registros aún o no coinciden con la búsqueda.
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
                        ? 'bg-white border-slate-200'
                        : 'bg-rose-50/50 border-rose-200 text-slate-500'
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
                            Asiste
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-rose-100 text-rose-700 rounded-full font-bold text-[10px]">
                            No asistirá
                          </span>
                        )}
                      </div>

                      <div className="text-slate-600 flex flex-wrap gap-x-3 gap-y-1">
                        <span>📱 WhatsApp: {g.phone}</span>
                        {g.email && <span>📧 {g.email}</span>}
                        {g.attending === 'yes' && (
                          <>
                            <span>👥 {g.adultsCount} Adultos, {g.childrenCount} Niños</span>
                            <span>🎯 {g.teamVote === 'boy' ? '👦 Team Niño' : '👧 Team Niña'}</span>
                          </>
                        )}
                      </div>

                      {companionList.length > 0 && (
                        <p className="text-purple-700 font-medium">
                          🤝 Acompañantes: {companionList.join(', ')}
                        </p>
                      )}

                      {g.dietary && (
                        <p className="text-slate-600 font-medium">
                          🥗 Alergia / Dieta: {g.dietary}
                        </p>
                      )}

                      {g.message && (
                        <p className="italic text-slate-500">
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
                          title="Escribir por WhatsApp"
                        >
                          <Smartphone className="w-4 h-4" />
                        </a>
                      )}
                      <button
                        onClick={() => handleDeleteGuest(g.id)}
                        className="p-2 rounded-xl bg-slate-100 text-slate-400 hover:bg-rose-100 hover:text-rose-600 transition-colors"
                        title="Eliminar registro"
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
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Datos guardados en tu navegador listos para exportar.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-xl transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
