export const getCommentsLabel = (count: number) => {
  const lastTwo = count % 100;
  const last = count % 10;

  if (lastTwo >= 11 && lastTwo <= 14) {
    return `${count} комментариев`;
  }

  if (last === 1) {
    return `${count} комментарий`;
  }

  if (last >= 2 && last <= 4) {
    return `${count} комментария`;
  }

  return `${count} комментариев`;
};
