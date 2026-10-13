import { Cake, Heart, Utensils, Sparkles, MessageCircle, PartyPopper } from 'lucide-react';
import { EVENT_CONFIG } from '../config/eventConfig';

export default function GiftSection() {
  const { whatsapp } = EVENT_CONFIG;

  const handleNotifyWhatsapp = () => {
    const text = encodeURIComponent(
      `¡Hola ${whatsapp.contactName}! 🥰 Quería consultarles o avisarles sobre lo que me gustaría llevar de aporte voluntario para la fiesta del Sábado 7 de Noviembre.`
    );
    window.open(`https://wa.me/${whatsapp.phoneNumber}?text=${text}`, '_blank');
  };

  const handleScrollToRsvp = () => {
    const elem = document.getElementById('asistencia');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const ideas = [
    { icon: '🍰', title: 'Queques y Bizcochos', desc: 'Caseros, esponjosos de naranja, vainilla, limón o chocolate' },
    { icon: '🧁', title: 'Dulces & Masitas', desc: 'Cupcakes con chispas, alfajorcitos, galletas o tartaletas' },
    { icon: '🥪', title: 'Bocaditos Salados', desc: 'Canapés, tapaditos, pizzetas, mini empanadas o sándwiches' },
    { icon: '🥤', title: 'Bebidas y Jugos', desc: 'Gaseosas, jugos naturales, néctares o aguas saborizadas' },
    { icon: '🎈', title: 'Globos o Guirnaldas', desc: 'Tonos celestes, rosas o blancos para ambientar el lugar' },
    { icon: '🎀', title: 'Adornos & Detalles', desc: 'Servilletas decorativas, banderines o detalles para la fiesta' },
  ];

  return (
    <section id="regalo" className="py-16 px-4 sm:px-6 relative">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold uppercase tracking-wider mb-2 border border-amber-200">
            <Cake className="w-3.5 h-3.5 text-amber-600" />
            <span>100% Voluntario • Con Cariño</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-800 mb-3">
            Mesa de Compartir y Aportes
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-rose-500 uppercase tracking-widest mb-3">
            Sin compromisos • Sin dinero • Solo amor de familia y amigos
          </p>

          {/* Mensaje cálido y colaborativo */}
          <div className="glass-card rounded-2xl p-5 sm:p-6 border border-amber-200/90 max-w-xl mx-auto text-slate-600 text-xs sm:text-sm leading-relaxed shadow-sm">
            <Heart className="w-5 h-5 text-rose-400 mx-auto mb-2 fill-rose-100" />
            <p>
              Tu presencia y cariño en este día tan especial son nuestro único y mejor regalo. <strong>No pedimos dinero, cuotas ni listas de compras obligatorias</strong>.
            </p>
            <p className="mt-2 text-slate-500">
              Si te nace del corazón colaborar con algún picoteo dulce, salado, bebidas o algún detalle decorativo para sumar alegría, ¡será recibido con los brazos abiertos! Puedes anotarlo en tu confirmación de asistencia más abajo.
            </p>
          </div>
        </div>

        {/* Ideas Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 mb-8">
          {ideas.map((item) => (
            <div
              key={item.title}
              className="glass-card rounded-2xl p-4 border border-white flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow text-center group"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-2xl mx-auto mb-2.5 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm mb-1">
                  {item.title}
                </h3>
                <p className="text-[11px] text-slate-500 leading-snug">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleScrollToRsvp}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-rose-500 via-purple-500 to-sky-500 hover:from-rose-600 hover:via-purple-600 hover:to-sky-600 text-white font-bold text-xs shadow-md shadow-purple-200 transition-all hover:scale-105"
          >
            <PartyPopper className="w-4 h-4" />
            <span>Anotar mi Aporte en mi Confirmación</span>
          </button>

          <button
            type="button"
            onClick={handleNotifyWhatsapp}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs shadow-md shadow-emerald-500/20 transition-all hover:scale-105"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Consultar por WhatsApp</span>
          </button>
        </div>
      </div>
    </section>
  );
}
