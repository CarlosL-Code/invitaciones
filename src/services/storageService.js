/**
 * Storage Service & Cloud Persistence Layer
 * Soporta almacenamiento local-first con sincronización automática en la nube
 * Compatible con Google Sheets (Google Apps Script), Supabase y REST APIs.
 */
import { EVENT_CONFIG } from '../config/eventConfig';

const KEYS = {
  USER: 'gender_reveal_user',
  VOTES: 'gender_reveal_votes',
  USER_VOTE: 'gender_reveal_user_vote',
  GUESTS: 'gender_reveal_guests',
  CLOUD_URL: 'cloud_sync_url',
};

export const storageService = {
  // --- ENDPOINT EN LA NUBE ---
  getCloudUrl() {
    return localStorage.getItem(KEYS.CLOUD_URL) || EVENT_CONFIG.cloudSync?.endpointUrl || '';
  },

  setCloudUrl(url) {
    if (url && url.trim()) {
      localStorage.setItem(KEYS.CLOUD_URL, url.trim());
    } else {
      localStorage.removeItem(KEYS.CLOUD_URL);
    }
  },

  // --- OBTENER DATOS COMPARTIDOS DESDE LA NUBE ---
  async fetchCloudData() {
    const url = this.getCloudUrl();
    if (!url) return null;

    try {
      const response = await fetch(url, { redirect: 'follow' });
      if (!response.ok) return null;
      const data = await response.json();

      if (data && data.status === 'success') {
        if (data.votes) {
          localStorage.setItem(KEYS.VOTES, JSON.stringify(data.votes));
        }
        if (Array.isArray(data.guests)) {
          localStorage.setItem(KEYS.GUESTS, JSON.stringify(data.guests));
        }
        return data;
      }
      return null;
    } catch (err) {
      console.warn('Aviso sincronización en la nube:', err);
      return null;
    }
  },

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

    // Sincronizar voto a la nube inmediatamente
    this.syncVoteToCloud(team, previousVote);

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

    // Sincronizar invitado a la base de datos en la nube
    await this.syncGuestToCloud(guest);

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
      
      await fetch(url, { mode: 'no-cors' });
      console.log('Mensaje de confirmación despachado mediante WhatsApp API');
    } catch (err) {
      console.warn('WhatsApp API warning:', err);
    }
  },

  // --- SINCRONIZACIÓN EN LA NUBE (Google Sheets / REST) ---
  async syncGuestToCloud(guest) {
    const url = this.getCloudUrl();
    if (!url) return;

    try {
      await fetch(url, {
        method: 'POST',
        redirect: 'follow',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'rsvp',
          guest: guest,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (err) {
      console.warn('Aviso guardando invitado en la nube:', err);
    }
  },

  async syncVoteToCloud(team, previousVote) {
    const url = this.getCloudUrl();
    if (!url) return;

    try {
      await fetch(url, {
        method: 'POST',
        redirect: 'follow',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'vote',
          team,
          previousVote,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (err) {
      console.warn('Aviso guardando voto en la nube:', err);
    }
  },

  async resetCloudData() {
    const url = this.getCloudUrl();
    if (!url) return;

    try {
      await fetch(url, {
        method: 'POST',
        redirect: 'follow',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'reset_all',
        }),
      });
    } catch (err) {
      console.warn('Aviso reiniciando nube:', err);
    }
  },
};
