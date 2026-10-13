export const EVENT_CONFIG = {
  // Información de los Padres y Bebé
  parents: {
    motherName: "Estefanía",
    fatherName: "Carlos",
    babyNickName: "Nuestro Pequeño Amor",
  },

  // Fecha y Hora del Evento
  date: {
    displayDate: "Sábado 7 de Noviembre de 2026",
    displayTime: "14:00 hrs",
    targetDateIso: "2026-11-07T14:00:00", // Para el contador regresivo
    dayOfWeek: "Sábado",
    day: "7",
    month: "Noviembre",
    year: "2026",
    time: "14:00 hrs",
  },

  // Ubicación del Evento
  location: {
    placeName: "Lugar del Evento",
    address: "-38.69220, -72.64683",
    city: "Región de La Araucanía, Chile",
    googleMapsEmbedUrl: "https://maps.google.com/maps?q=-38.69220,-72.64683&hl=es&z=15&output=embed",
    googleMapsUrl: "https://www.google.com/maps?q=-38.69220,-72.64683",
    wazeUrl: "https://waze.com/ul?ll=-38.69220,-72.64683&navigate=yes",
  },

  // Código de Vestimenta & Notas
  dressCode: {
    title: "Dress Code: Blanco o el color de tu Team",
    description: "Te invitamos a vestir de color blanco, o lucir una prenda/accesorio rosa o celeste según tu intuición.",
    colorSuggestions: ["#ffffff", "#93c5fd", "#f472b6"],
  },

  // Itinerario dinámico comenzando a las 14:00 hrs
  itinerary: [
    { 
      step: 1,
      time: "14:00 hrs", 
      title: "Bienvenida y Recepción", 
      desc: "Llegada de invitados, bienvenida con cariño y firma del libro de recuerdos.",
      icon: "bear" 
    },
    { 
      step: 2,
      time: "15:00 hrs", 
      title: "Juegos Dinámicos de Equipos", 
      desc: "Divertidos desafíos y dinámicas entre el Team Niño y el Team Niña.",
      icon: "game" 
    },
    { 
      step: 3,
      time: "16:30 hrs", 
      title: "¡El Gran Momento: Revelación!", 
      desc: "La emocionante cuenta regresiva para descubrir si será príncipe o princesa.",
      icon: "sparkles" 
    },
    { 
      step: 4,
      time: "17:15 hrs", 
      title: "Mesa Dulce & Brindis", 
      desc: "Compartimos ricas preparaciones, queques, fotos familiares y abrazos.",
      icon: "cake" 
    },
  ],

  // Contacto para WhatsApp (RSVP y consultas)
  whatsapp: {
    phoneNumber: "56937540250", // Número chileno 937540250 con código país 56
    contactName: "Estefanía y Carlos",
  },

  // PIN de seguridad para el Panel Administrativo de Papás
  adminPin: "711", // PIN seguro (7 de Noviembre = 711)

  // Opciones de Votación Iniciales limpias desde cero
  initialVotes: {
    boy: 0,
    girl: 0,
  },

  // API Opcional de WhatsApp (Ej: CallMeBot API gratuita para recibir alertas en segundo plano)
  whatsappApi: {
    enabled: false,
    apiKey: "", // Tu API Key gratuita de CallMeBot (opcional)
  },

  // Sincronización en la Nube (Opcional: Google Sheets / SheetDB / Supabase / Make / Webhook)
  cloudSync: {
    enabled: false,
    endpointUrl: "", // URL opcional para recibir confirmaciones directamente en una hoja de Google Sheets o base de datos
  },
};
