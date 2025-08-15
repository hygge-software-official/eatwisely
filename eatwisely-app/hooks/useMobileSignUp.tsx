import { useState } from 'react';
import { useSignUp, isClerkAPIResponseError } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { mixpanel } from '@/app/_layout';
import { useAppContext } from '@/providers/AppContext';
import * as Sentry from '@sentry/react-native';

export const useMobileSignUp = (withRedirect?: string) => {
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();
  const { setRequestState } = useAppContext();

  const [loading, setLoading] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSignUp = async (phoneNumber: string) => {
    if (!isLoaded && !signUp) return null;

    try {
      setLoading(true);
      await signUp!.create({ phoneNumber });
      await signUp!.preparePhoneNumberVerification({ strategy: 'phone_code' });
      setPendingVerification(true);
    } catch (err: any) {
      Sentry.captureException(err, {
        extra: {
          message: err?.message || 'Error during sign-up',
          phoneNumber,
        },
      });

      if (isClerkAPIResponseError(err)) {
        setError(err.errors[0].message);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  const verifySignUp = async (code: string) => {
    if (!isLoaded && !signUp) return null;

    try {
      setLoading(true);
      const signInAttempt = await signUp.attemptPhoneNumberVerification({
        code,
      });

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });

        mixpanel.track('SIGN_UP', {
          timestamp: new Date().toISOString(),
          signup_method: 'Phone',
        });
        setRequestState({ lastAuthMethod: 'Phone' });

        if (withRedirect) {
          router.replace('/recipe/loading');
        } else {
          router.replace('/home');
        }
      } else {
        router.replace('/auth/failure');
      }
    } catch (err: any) {
      Sentry.captureException(err, {
        extra: {
          message: err?.message || 'Error during verification',
          code,
        },
      });

      if (err.errors[0].message.includes('is incorrect')) {
        setError('Code is incorrect');
      } else {
        setError(err.errors[0].message);
      }
    } finally {
      setLoading(false);
    }
  };

  const resendVerificationCode = async () => {
    if (!isLoaded && !signUp) return null;

    try {
      await signUp?.preparePhoneNumberVerification({ strategy: 'phone_code' });
    } catch (error: any) {
      Sentry.captureException(error, {
        extra: {
          message: error?.message || 'Error during resending verification code',
        },
      });

      setLoading(false);
    }
  };

  const closeErrorModal = () => {
    setError(null);
  };

  return {
    loading,
    pendingVerification,
    onSignUp,
    verifySignUp,
    resendVerificationCode,
    error,
    closeErrorModal,
  };
};
