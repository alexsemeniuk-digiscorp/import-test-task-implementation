export const getTotalTime = (data: any[]) => {
  const totalSeconds = data.reduce((acc, item) => {
    if (!item || !item.shiftTime) return acc;
    const parts = item?.shiftTime
      ? (item?.shiftTime as string)?.split(':')
      : [];
    if (parts.length !== 3) return acc;

    const [h, m, sRaw] = parts;
    const s = Math.floor(Number(sRaw));
    return acc + Number(h) * 3600 + Number(m) * 60 + s;
  }, 0);

  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
    2,
    '0',
  );
  const seconds = String(totalSeconds % 60).padStart(2, '0');

  const totalTime = `${hours}:${minutes}:${seconds}`;

  return totalTime;
};
