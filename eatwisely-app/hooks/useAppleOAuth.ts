import { useOAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import * as Linking from 'expo-linking';
import { mixpanel } from '@/app/_layout';
import { useAppContext } from '@/providers/AppContext';
import * as Sentry from '@sentry/react-native';

interface OAuthProps {
  onClose?: () => void;
}

export const useAppleOAuth = (onClose?: OAuthProps['onClose']) => {
  const router = useRouter();
  const { setRequestState } = useAppContext();
  const redirectUrl = Linking.createURL('home');

  const { startOAuthFlow } = useOAuth({
    strategy: 'oauth_apple',
    redirectUrl,
  });

  const handleAppleOAuth = async () => {
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
            auth_method: 'Apple',
          });
          Sentry.captureMessage('User signed up with Apple', {
            level: 'info',
            extra: {
              auth_method: 'Apple',
              timestamp: new Date().toISOString(),
            },
          });
        } else if (signIn) {
          mixpanel.track('SIGN_IN', {
            timestamp: new Date().toISOString(),
            auth_method: 'Apple',
          });
          Sentry.captureMessage('User signed in with Apple', {
            level: 'info',
            extra: {
              auth_method: 'Apple',
              timestamp: new Date().toISOString(),
            },
          });
        }

        setRequestState({ lastAuthMethod: 'Apple' });

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
          message: err?.message || 'Error during Apple OAuth',
        },
      });

      console.error('OAuth Error:', err);
      router.replace('/auth/failure');
    }
  };

  return { handleAppleOAuth };
};
