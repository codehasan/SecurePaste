const dateFormat = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
});

export const getTimePassed = (date: string | undefined) => {
  if (!date) {
    return 'No data';
  }

  const now = new Date();
  const past = new Date(date);

  const diffInMilliseconds = now.getTime() - past.getTime();
  const diffInMinutes = Math.floor(diffInMilliseconds / 60000);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInYears > 0) {
    return diffInYears === 1 ? '1 year' : `${diffInYears} years`;
  } else if (diffInDays > 0) {
    return diffInDays === 1 ? '1 day' : `${diffInDays} days`;
  } else if (diffInHours > 0) {
    return diffInHours === 1 ? '1 hour' : `${diffInHours} hours`;
  } else if (diffInMinutes > 0) {
    return diffInMinutes === 1 ? '1 minute' : `${diffInMinutes} minutes`;
  } else {
    return '0 minute';
  }
};

export const getTime = (date: string | undefined) => {
  if (!date) return 'No data';
  return dateFormat.format(new Date(date));
};
