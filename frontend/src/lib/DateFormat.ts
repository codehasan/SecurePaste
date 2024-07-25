const dateFormat = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
});

export const getTimePassed = (date: string | undefined) => {
  if (!date) {
    return 'No data';
  }
  return getTimePassedFromDate(new Date(date));
};

export const getTimePassedFromDate = (past: Date) => {
  const now = new Date();
  const diffInMilliseconds = now.getTime() - past.getTime();
  const diffInMinutes = Math.floor(diffInMilliseconds / 60000);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInYears > 0) {
    return `${diffInYears}y`;
  }
  if (diffInDays > 0) {
    return `${diffInDays}d`;
  }
  if (diffInHours > 0) {
    return `${diffInHours}h`;
  }
  if (diffInMinutes > 0) {
    return `${diffInMinutes}m`;
  }
  return '0m';
};

export const getFormattedDate = (date: string | undefined) => {
  if (!date) return 'No data';
  return dateFormat.format(new Date(date));
};
