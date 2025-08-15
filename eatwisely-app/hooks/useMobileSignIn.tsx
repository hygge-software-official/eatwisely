import { useState } from 'react';
import { useSignIn, isClerkAPIResponseError } from '@clerk/clerk-expo';
import { PhoneCodeFactor, SignInFirstFactor } from '@clerk/types';
import { useRouter } from 'expo-router';
import { mixpanel } from '@/app/_layout';
import { useAppContext } from '@/providers/AppContext';
import * as Sentry from '@sentry/react-native';

export const useMobileSignIn = (withRedirect?: string) => {
  const router = useRouter();
  const { isLoaded, signIn, setActive } = useSignIn();
  const { setRequestState } = useAppContext();

  const [loading, setLoading] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSignIn = async (phoneNumber: string) => {
    if (!isLoaded && !signIn) return null;

    try {
      setLoading(true);
      const { supportedFirstFactors } = await signIn.create({
        identifier: phoneNumber,
      });

      const isPhoneCodeFactor = (
        factor: SignInFirstFactor,
      ): factor is PhoneCodeFactor => {
        return factor.strategy === 'phone_code';
      };

      const phoneCodeFactor = supportedFirstFactors?.find(isPhoneCodeFactor);

      if (phoneCodeFactor) {
        const { phoneNumberId } = phoneCodeFactor;

        await signIn.prepareFirstFactor({
          strategy: 'phone_code',
          phoneNumberId,
        });

        setPendingVerification(true);
      }
    } catch (err: any) {
      Sentry.captureException(err, {
        extra: {
          message: err?.message || 'Unknown error during sign-in',
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

  const verifySignIn = async (code: string) => {
    if (!isLoaded && !signIn) return null;

    try {
      setLoading(true);

      const signInAttempt = await signIn.attemptFirstFactor({
        strategy: 'phone_code',
        code,
      });

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });
        mixpanel.track('SIGN_IN', {
          timestamp: new Date().toISOString(),
          signin_method: 'Phone',
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
          message: err?.message || 'Unknown error during verification',
          code,
        },
      });

      setLoading(false);
      if (err.errors[0].message.includes('is incorrect')) {
        setError('Code is incorrect');
      } else {
        setError(err.errors[0].message);
      }
    }
  };

  const resendVerificationCode = async () => {
    if (!isLoaded && !signIn) return null;
    console.log('resend');
    try {
      const firstFactor = signIn?.supportedFirstFactors.find(
        (f) => f.strategy === 'phone_code',
      ) as { phoneNumberId: string } | undefined;
      if (!firstFactor) {
        return null;
      }

      await signIn?.prepareFirstFactor({
        strategy: 'phone_code',
        phoneNumberId: firstFactor.phoneNumberId,
        primary: false,
      });
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
    onSignIn,
    verifySignIn,
    resendVerificationCode,
    error,
    closeErrorModal,
  };
};
