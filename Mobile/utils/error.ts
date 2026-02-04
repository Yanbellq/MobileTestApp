import { TErrorResponse } from '@/shared/types/common.type'

export const getErrorMessage = (error: string | TErrorResponse | null): string => {
  if (!error) return 'An unknown error occurred';
  if (typeof error === 'string') return error;
  return error.message || 'Something went wrong';
};