import confetti from 'canvas-confetti';

export const triggerBoyConfetti = () => {
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#38bdf8', '#0284c7', '#93c5fd', '#fef08a', '#ffffff'],
  });
};

export const triggerGirlConfetti = () => {
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#f472b6', '#db2777', '#fbcfe8', '#fef08a', '#ffffff'],
  });
};

export const triggerCelebrationConfetti = () => {
  const duration = 2.5 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

  const interval = setInterval(function() {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 40 * (timeLeft / duration);
    // Boy confetti on the left
    confetti({
      ...defaults,
      particleCount,
      origin: { x: 0.2, y: 0.7 },
      colors: ['#38bdf8', '#0284c7', '#bae6fd'],
    });
    // Girl confetti on the right
    confetti({
      ...defaults,
      particleCount,
      origin: { x: 0.8, y: 0.7 },
      colors: ['#f472b6', '#db2777', '#fbcfe8'],
    });
  }, 250);
};
