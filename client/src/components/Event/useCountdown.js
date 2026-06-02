import { useState, useEffect } from 'react';

export function useCountdown(eventDate) {
  const [timeLeft, setTimeLeft] = useState(calcTime(eventDate));

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(calcTime(eventDate)), 1000);
    return () => clearInterval(timer);
  }, [eventDate]);

  return timeLeft;
}

function calcTime(eventDate) {
  const diff = new Date(eventDate) - new Date();
  if (diff <= 0) return null;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds };
}
