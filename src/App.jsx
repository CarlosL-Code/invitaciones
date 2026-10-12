import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import VoteSection from './components/VoteSection';
import EventDetails from './components/EventDetails';
import RsvpForm from './components/RsvpForm';
import WishesWall from './components/WishesWall';
import Footer from './components/Footer';
import AdminModal from './components/AdminModal';
import RegistrationModal from './components/RegistrationModal';
import { storageService } from './services/storageService';

export default function App() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  
  // Usuario registrado en la invitación (Nombre, WhatsApp, Correo)
  const [currentUser, setCurrentUser] = useState(() => storageService.getUser());

  // Si no hay usuario registrado, abrimos el modal de bienvenida al entrar al link
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(!currentUser);

  // Voto del usuario (Team Niño / Team Niña)
  const [userVote, setUserVote] = useState(() => storageService.getUserVote());

  // Lista de invitados que han confirmado RSVP
  const [guests, setGuests] = useState(() => storageService.getGuests());

  const handleRegister = (userRecord) => {
    setCurrentUser(userRecord);
    setIsRegistrationOpen(false);
  };

  const handleVoteChange = (team) => {
    setUserVote(team);
  };

  const handleGuestAdded = (newGuest) => {
    setGuests((prev) => [newGuest, ...prev.filter(g => g.phone !== newGuest.phone)]);
  };

  const handleGuestsUpdated = (updatedGuests) => {
    setGuests(updatedGuests);
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden selection:bg-rose-200 selection:text-rose-900">
      {/* Background ambient lighting effects */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-rose-200/40 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-[30rem] h-[30rem] bg-sky-200/40 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl" />
      </div>

      {/* Navigation bar */}
      <Navbar
        currentUser={currentUser}
        onOpenRegistration={() => setIsRegistrationOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Main Content */}
      <main className="relative">
        <Hero
          currentUser={currentUser}
          onOpenRegistration={() => setIsRegistrationOpen(true)}
        />
        
        <VoteSection
          currentUser={currentUser}
          userVote={userVote}
          onVoteChange={handleVoteChange}
          onRequireRegistration={() => setIsRegistrationOpen(true)}
        />

        <EventDetails />

        <RsvpForm
          currentUser={currentUser}
          userVote={userVote}
          onVoteChange={handleVoteChange}
          onGuestAdded={handleGuestAdded}
          onOpenRegistration={() => setIsRegistrationOpen(true)}
        />

        <WishesWall guests={guests} />
      </main>

      {/* Footer */}
      <Footer onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* Modal de Registro de Bienvenida inicial */}
      <RegistrationModal
        isOpen={isRegistrationOpen}
        onRegister={handleRegister}
      />

      {/* Panel de Administración para Estefanía y Carlos */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        guests={guests}
        onGuestsUpdated={handleGuestsUpdated}
      />
    </div>
  );
}
