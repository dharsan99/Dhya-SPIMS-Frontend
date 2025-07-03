import { toast } from 'sonner';

export const useToastErrorHandler = () => {
  return (error: unknown) => {
    let message = 'Something went wrong. Please try again.';

    if (
      error &&
      typeof error === 'object' &&
      'response' in error &&
      (error as any).response?.data
    ) {
      const responseData = (error as any).response.data;

      // Custom server error message
      if (responseData.message) {
        message = responseData.message;
      } else if (typeof responseData === 'string') {
        message = responseData;
      }
    } else if (
      error &&
      typeof error === 'object' &&
      'message' in error &&
      typeof (error as any).message === 'string'
    ) {
      message = (error as any).message;
    }

    toast.error(message);
  };
};