import { Cake, Heart, Utensils, Sparkles, MessageCircle } from 'lucide-react';
import { EVENT_CONFIG } from '../config/eventConfig';

export default function GiftSection() {
  const { whatsapp } = EVENT_CONFIG;

  const handleNotifyWhatsapp = () => {
    const text = encodeURIComponent(
      `¡Hola ${whatsapp.contactName}! 🥰 Quería consultarles o avisarles sobre lo que puedo llevar para la mesa de compartir el Sábado 7 de Noviembre.`
    );
    window.open(`https://wa.me/${whatsapp.phoneNumber}?text=${text}`, '_blank');
  };

  const ideas = [
    { icon: '🍰', title: 'Queques y Bizcochos', desc: 'Caseros, esponjosos de naranja, vainilla o chocolate' },
    { icon: '🧁', title: 'Dulces & Galletas', desc: 'Cupcakes con chispas, alfajorcitos o galletas decoradas' },
    { icon: '🥪', title: 'Bocaditos Salados', desc: 'Canapés, tapaditos, mini empanadas o sándwiches' },
    { icon: '🥤', title: 'Bebidas y Jugos', desc: 'Aguas saborizadas, gaseosas o néctares bien fríos' },
  ];

  return (
    <section id="regalo" className="py-16 px-4 sm:px-6 relative">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold uppercase tracking-wider mb-2">
            <Cake className="w-3.5 h-3.5" />
            <span>Mesa de Compartir</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-800 mb-3">
            Aporte Voluntario: ¡Mesa Dulce & Salada!
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-rose-500 uppercase tracking-widest mb-3">
            Sin dinero • Solo amor y ricas cositas para picotear
          </p>

          {/* Gentle, collaborative message */}
          <div className="glass-card rounded-2xl p-4 sm:p-6 border border-amber-200/80 max-w-xl mx-auto text-slate-600 text-xs sm:text-sm leading-relaxed shadow-sm">
            <Heart className="w-5 h-5 text-rose-400 mx-auto mb-2 fill-rose-100" />
            <p>
              Tu presencia y cariño en este día tan especial son nuestro mejor regalo. <strong>No pedimos dinero ni transferencias bancarias</strong>. En su lugar, si te nace del corazón colaborar, tendremos una mesa dulce y salada colaborativa donde puedes traer algún queque, bocadillo o bebida para compartir con toda la familia.
            </p>
          </div>
        </div>

        {/* Ideas Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {ideas.map((item) => (
            <div
              key={item.title}
              className="glass-card rounded-2xl p-4 border border-white flex items-center gap-3.5 shadow-sm hover:shadow transition-shadow"
            >
              <span className="text-3xl p-2 bg-amber-50 rounded-xl">
                {item.icon}
              </span>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Action card */}
        <div className="text-center">
          <p className="text-xs text-slate-500 mb-3">
            ¿Tienes dudas sobre qué llevar? Escríbenos directamente:
          </p>
          <button
            type="button"
            onClick={handleNotifyWhatsapp}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs shadow-md shadow-emerald-500/20 transition-all hover:scale-105"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Consultar con Estefanía y Carlos por WhatsApp</span>
          </button>
        </div>
      </div>
    </section>
  );
}
