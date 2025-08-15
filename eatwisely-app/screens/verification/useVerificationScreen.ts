import { useState, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { useMobileSignIn } from '@/hooks/useMobileSignIn';
import { useMobileSignUp } from '@/hooks/useMobileSignUp';

export const useVerificationScreen = () => {
  const { isSignIn, phoneNumber, withRedirect } = useLocalSearchParams<{
    isSignIn: string;
    phoneNumber: string;
    withRedirect?: string;
  }>();

  const {
    verifySignIn,
    resendVerificationCode: resendSignInCode,
    pendingVerification: signInPendingVerification,
    error: signInError,
    closeErrorModal: closeSignInErrorModal,
  } = useMobileSignIn(withRedirect);
  const {
    verifySignUp,
    resendVerificationCode: resendSignUpCode,
    pendingVerification: signUpPendingVerification,
    error: signUpError,
    closeErrorModal: closeSignUpErrorModal,
  } = useMobileSignUp(withRedirect);

  const [code, setCode] = useState('');
  const [timer, setTimer] = useState(0);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [isResendLoading, setIsResendLoading] = useState(false);

  useEffect(() => {
    if (code.length === 6) {
      verifyAndRedirect();
    }
  }, [code]);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0 && isResendDisabled) {
      setIsResendDisabled(false);
      if (interval) {
        clearInterval(interval);
      }
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [timer, isResendDisabled]);

  const verifyAndRedirect = async () => {
    if (isSignIn === 'true') {
      await verifySignIn(code);
    } else {
      await verifySignUp(code);
    }
  };

  const handleResendCode = async () => {
    setIsResendDisabled(true);
    setIsResendLoading(true);
    setTimer(60);
    if (isSignIn === 'true') {
      await resendSignInCode();
    } else {
      await resendSignUpCode();
    }
    setIsResendLoading(false);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
      .toString()
      .padStart(2, '0')}`;
  };

  return {
    code,
    setCode,
    timer,
    isResendDisabled,
    isResendLoading,
    handleResendCode,
    signInPendingVerification,
    signUpPendingVerification,
    signInError,
    signUpError,
    closeSignInErrorModal,
    closeSignUpErrorModal,
    formatTime,
  };
};
