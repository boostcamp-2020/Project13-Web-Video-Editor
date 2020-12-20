export const parseTime = (origin: number): string => {
  const time: number = Math.round(origin);
  const minute: number = Math.floor(time / 60);
  const sec: number = time % 60;

  return [
    minute.toString().padStart(2, '0'),
    sec.toString().padStart(2, '0'),
  ].join(':');
};

const SECOND = 1e3;
const MINUTE = 6e4;
const HOUR = 36e5;
const DAY = 864e5; // miliseconds

export const parseDateString = (now, created) => {
  const diff = now - created;
  let amount;
  if (diff < HOUR) {
    if (diff < MINUTE) {
      amount = Math.floor(diff / SECOND);
      return `${amount} 초 전`;
    }
    amount = Math.floor(diff / MINUTE);
    return `${amount} 분 전`;
  }
  if (diff < DAY) {
    amount = Math.floor(diff / HOUR);
    return `${amount} 시간 전`;
  }
  amount = Math.floor(diff / DAY);
  return `${amount} 일 전`;
};
