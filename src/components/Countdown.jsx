import { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';

export default function Countdown({ targetDateIso }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isCompleted: false,
  });

  useEffect(() => {
    const calculateTime = () => {
      const difference = new Date(targetDateIso) - new Date();

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isCompleted: true,
        });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds, isCompleted: false });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [targetDateIso]);

  const timeUnits = [
    { label: 'Días', value: timeLeft.days, color: 'from-rose-100 to-pink-50 text-rose-700' },
    { label: 'Horas', value: timeLeft.hours, color: 'from-purple-100 to-indigo-50 text-purple-700' },
    { label: 'Minutos', value: timeLeft.minutes, color: 'from-sky-100 to-blue-50 text-sky-700' },
    { label: 'Segundos', value: timeLeft.seconds, color: 'from-amber-100 to-yellow-50 text-amber-700' },
  ];

  if (timeLeft.isCompleted) {
    return (
      <div className="py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-400 via-purple-400 to-sky-400 text-white font-medium shadow-md text-center">
        ¡Hoy es el gran día! 🎉 ¿Listos para la revelación?
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto my-6">
      <div className="flex items-center justify-center gap-2 mb-3 text-xs uppercase tracking-widest font-semibold text-slate-500">
        <Clock className="w-4 h-4 text-purple-500" />
        <span>Faltan muy pocos momentos</span>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:gap-4">
        {timeUnits.map((unit) => (
          <div
            key={unit.label}
            className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl glass-card bg-gradient-to-b shadow-sm hover:shadow-md transition-shadow duration-200 border border-white"
          >
            <span className={`text-2xl sm:text-4xl font-extrabold tracking-tight ${unit.color}`}>
              {String(unit.value).padStart(2, '0')}
            </span>
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
