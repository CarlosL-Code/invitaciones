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
    displayTime: "16:30 hrs",
    targetDateIso: "2026-11-07T16:30:00", // Para el contador regresivo
    dayOfWeek: "Sábado",
    day: "7",
    month: "Noviembre",
    year: "2026",
    time: "16:30 hrs",
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

  // Itinerario dinámico
  itinerary: [
    { 
      step: 1,
      time: "16:30 hrs", 
      title: "Bienvenida y Recepción", 
      desc: "Recepción de invitados, fotito de bienvenida y firma del libro de recuerdos.",
      icon: "bear" 
    },
    { 
      step: 2,
      time: "17:15 hrs", 
      title: "Juegos Dinámicos de Equipos", 
      desc: "Pruebas y desafíos divertidos entre el Team Niño y el Team Niña.",
      icon: "game" 
    },
    { 
      step: 3,
      time: "18:15 hrs", 
      title: "¡El Gran Momento: Revelación!", 
      desc: "La cuenta regresiva final para conocer si será príncipe o princesa.",
      icon: "sparkles" 
    },
    { 
      step: 4,
      time: "18:45 hrs", 
      title: "Mesa Dulce & Brindis", 
      desc: "Compartimos las delicias, queques, abrazos y fotografías familiares.",
      icon: "cake" 
    },
  ],

  // Contacto para WhatsApp (RSVP y consultas)
  whatsapp: {
    phoneNumber: "56937540250", // Número chileno 937540250 con código país 56
    contactName: "Estefanía y Carlos",
  },



  // Opciones de Votación Iniciales
  initialVotes: {
    boy: 28,
    girl: 32,
  },

  // Sincronización en la Nube (Opcional: Google Sheets / SheetDB / Supabase / Make / Webhook)
  cloudSync: {
    enabled: false,
    endpointUrl: "", // URL opcional para recibir confirmaciones directamente en una hoja de Google Sheets o base de datos
  },
};
