const dateFormat = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
});

export const getTimePassed = (date: string | undefined | Date) => {
  if (!date) {
    return 'No data';
  }

  if (date instanceof Date) {
    getTimePassedFromDate(date);
  }
  return getTimePassedFromDate(new Date(date));
};

const getTimePassedFromDate = (past: Date) => {
  const now = new Date();
  const diffInMilliseconds = now.getTime() - past.getTime();
  const diffInMinutes = Math.floor(diffInMilliseconds / 60000);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInYears > 0) {
    return `${diffInYears} years ago`;
  }
  if (diffInMonths > 0) {
    return `${diffInMonths} months ago`;
  }
  if (diffInDays > 0) {
    return `${diffInDays} days ago`;
  }
  if (diffInHours > 0) {
    return `${diffInHours} hours ago`;
  }
  if (diffInMinutes > 0) {
    return `${diffInMinutes} minutes ago`;
  }
  return '0 minutes ago';
};

export const getFormattedDate = (date: string | Date | undefined) => {
  if (!date) return 'No data';

  if (date instanceof Date) {
    return dateFormat.format(date);
  }
  return dateFormat.format(new Date(date));
};
