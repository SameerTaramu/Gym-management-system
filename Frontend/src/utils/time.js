export const getTimeRemaining = (startTime) => {
  if (!startTime) {
    return {
      expired: true,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  const now = Date.now();
  const start = new Date(startTime).getTime();
  const diff = start - now;

  if (diff <= 0) {
    return {
      expired: true,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return {
    expired: false,
    hours,
    minutes,
    seconds,
  };
};
