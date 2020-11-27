const parseTime = (origin: number): string => {
  const time: number = Math.round(origin);
  const minute: number = Math.floor(time / 60);
  const sec: number = time % 60;

  return [
    minute.toString().padStart(2, '0'),
    sec.toString().padStart(2, '0'),
  ].join(':');
};

export default parseTime;
