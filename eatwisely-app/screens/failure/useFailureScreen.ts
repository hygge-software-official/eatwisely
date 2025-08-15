import { useAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

export const useFailureScreen = () => {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [errorVisible, setErrorVisible] = useState(true);
  const [hasRefreshed, setHasRefreshed] = useState(false);

  const closeError = () => {
    setErrorVisible(false);
  };

  const refreshAuthStatus = () => {
    if (!hasRefreshed) {
      setHasRefreshed(true);
    }
  };

  useEffect(() => {
    if (isSignedIn) {
      router.replace('/home');
    } else {
      refreshAuthStatus();
    }
  }, [isSignedIn, hasRefreshed]);

  return {
    errorVisible,
    closeError,
  };
};
