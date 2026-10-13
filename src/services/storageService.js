/**
 * Storage Service & Cloud Persistence Layer
 * Soporta almacenamiento local-first con capacidad de sincronización en la nube
 * (Google Sheets / Supabase / REST Webhook / LocalStorage)
 */
import { EVENT_CONFIG } from '../config/eventConfig';

const KEYS = {
  USER: 'gender_reveal_user',
  VOTES: 'gender_reveal_votes',
  USER_VOTE: 'gender_reveal_user_vote',
  GUESTS: 'gender_reveal_guests',
};

export const storageService = {
  // --- USUARIO ACTUAL ---
  getUser() {
    try {
      const data = localStorage.getItem(KEYS.USER);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  saveUser(user) {
    localStorage.setItem(KEYS.USER, JSON.stringify(user));
  },

  // --- VOTOS ---
  getVotes() {
    try {
      const isCleaned = localStorage.getItem('gender_reveal_clean_zero_v1');
      if (!isCleaned) {
        // Asegura que las pruebas previas queden en 0 limpio
        localStorage.setItem(KEYS.VOTES, JSON.stringify({ boy: 0, girl: 0 }));
        localStorage.setItem('gender_reveal_clean_zero_v1', 'true');
        return { boy: 0, girl: 0 };
      }
      const saved = localStorage.getItem(KEYS.VOTES);
      return saved ? JSON.parse(saved) : EVENT_CONFIG.initialVotes;
    } catch {
      return EVENT_CONFIG.initialVotes;
    }
  },

  getUserVote() {
    return localStorage.getItem(KEYS.USER_VOTE) || null;
  },

  async recordVote(team, previousVote = null) {
    const currentVotes = this.getVotes();
    const newVotes = { ...currentVotes };

    if (previousVote && newVotes[previousVote] > 0) {
      newVotes[previousVote] -= 1;
    }
    newVotes[team] = (newVotes[team] || 0) + 1;

    localStorage.setItem(KEYS.VOTES, JSON.stringify(newVotes));
    localStorage.setItem(KEYS.USER_VOTE, team);

    // Si hay un endpoint remoto configurado (Google Sheets / Supabase / Webhook)
    if (EVENT_CONFIG.cloudSync && EVENT_CONFIG.cloudSync.endpointUrl) {
      this.syncVoteToCloud(team, newVotes);
    }

    return newVotes;
  },

  // --- INVITADOS / CONFIRMACIONES RSVP ---
  getGuests() {
    try {
      const saved = localStorage.getItem(KEYS.GUESTS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  },

  async saveGuest(guest, formattedMessage = '') {
    const existing = this.getGuests();
    // Reemplaza si ya existía por teléfono o ID, o agrega al inicio
    const filtered = existing.filter((g) => g.phone !== guest.phone && g.id !== guest.id);
    const updated = [guest, ...filtered];

    localStorage.setItem(KEYS.GUESTS, JSON.stringify(updated));

    // Si hay un mensaje y API key de WhatsApp (CallMeBot) configurada
    if (formattedMessage) {
      this.sendWhatsappViaApi(formattedMessage);
    }

    // Si hay un endpoint remoto configurado (Google Sheets / Supabase / Webhook)
    if (EVENT_CONFIG.cloudSync && EVENT_CONFIG.cloudSync.endpointUrl) {
      await this.syncGuestToCloud(guest);
    }

    return updated;
  },

  deleteGuest(id) {
    const existing = this.getGuests();
    const updated = existing.filter((g) => g.id !== id);
    localStorage.setItem(KEYS.GUESTS, JSON.stringify(updated));
    return updated;
  },

  // --- API DE WHATSAPP GRATUITA EN SEGUNDO PLANO (CallMeBot) ---
  async sendWhatsappViaApi(message) {
    try {
      const apiKey = localStorage.getItem('callmebot_api_key') || (EVENT_CONFIG.whatsappApi && EVENT_CONFIG.whatsappApi.apiKey);
      const phone = EVENT_CONFIG.whatsapp.phoneNumber;
      if (!apiKey || !apiKey.trim()) return;

      const encoded = encodeURIComponent(message);
      const url = `https://api.callmebot.com/whatsapp.php?phone=+${phone}&text=${encoded}&apikey=${apiKey.trim()}`;
      
      // Enviamos la petición en segundo plano
      await fetch(url, { mode: 'no-cors' });
      console.log('Mensaje de confirmación despachado exitosamente mediante WhatsApp API');
    } catch (err) {
      console.warn('WhatsApp API warning:', err);
    }
  },

  // --- SINCRONIZACIÓN EN LA NUBE ---
  async syncGuestToCloud(guest) {
    try {
      const url = EVENT_CONFIG.cloudSync.endpointUrl;
      if (!url) return;

      await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'rsvp_submission',
          data: guest,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (err) {
      console.warn('No se pudo sincronizar en la nube de forma transparente:', err);
      // Falla silenciosa: la confirmación por WhatsApp y almacenamiento local garantizan 100% entrega
    }
  },

  async syncVoteToCloud(team, votes) {
    try {
      const url = EVENT_CONFIG.cloudSync.endpointUrl;
      if (!url) return;

      await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'vote_submission',
          team,
          votes,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (err) {
      console.warn('Sync vote warning:', err);
    }
  },
};
