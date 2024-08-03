import { AxiosError } from 'axios';

export const getErrorMessage = (error: unknown) => {
  if (error instanceof AxiosError) {
    const data = error.response?.data as {
      error: string;
    };
    if (data?.error) return data.error;
  }
  return 'An unexpected error occured.';
};
