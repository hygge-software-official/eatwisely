import { useOAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import * as Linking from 'expo-linking';
import { mixpanel } from '@/app/_layout';
import { useAppContext } from '@/providers/AppContext';
import * as Sentry from '@sentry/react-native';

interface OAuthProps {
  onClose?: () => void;
}

export const useGoogleOAuth = (onClose?: OAuthProps['onClose']) => {
  const router = useRouter();
  const { setRequestState } = useAppContext();
  const redirectUrl = Linking.createURL('home');

  const { startOAuthFlow } = useOAuth({
    strategy: 'oauth_google',
    redirectUrl,
  });

  const handleGoogleAuth = async () => {
    try {
      const { createdSessionId, setActive, signIn, signUp } =
        await startOAuthFlow();

      if (onClose) {
        onClose();
      }

      if (createdSessionId) {
        await setActive!({ session: createdSessionId });

        if (signUp && signUp.createdUserId) {
          mixpanel.track('SIGN_UP', {
            timestamp: new Date().toISOString(),
            auth_method: 'Google',
          });
          Sentry.captureMessage('User signed up with Google', {
            level: 'info',
            extra: {
              auth_method: 'Google',
              timestamp: new Date().toISOString(),
            },
          });
        } else if (signIn) {
          mixpanel.track('SIGN_IN', {
            timestamp: new Date().toISOString(),
            auth_method: 'Google',
          });
          Sentry.captureMessage('User signed in with Google', {
            level: 'info',
            extra: {
              auth_method: 'Google',
              timestamp: new Date().toISOString(),
            },
          });
        }

        setRequestState({ lastAuthMethod: 'Google' });

        if (onClose) {
          setTimeout(() => {
            router.replace('/recipe/loading');
          }, 200);
        } else {
          router.replace('/home');
        }
      }
    } catch (err: any) {
      Sentry.captureException(err, {
        extra: {
          message: err?.message || 'Error during Google OAuth',
        },
      });

      router.replace('/auth/failure');
    }
  };

  return { handleGoogleAuth };
};
