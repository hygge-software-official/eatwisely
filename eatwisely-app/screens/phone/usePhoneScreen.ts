import { useState, useRef, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';

//api
import { checkIsPhoneNumberExist } from '@/api/userService';

//hooks
import { useMobileSignIn } from '@/hooks/useMobileSignIn';
import { useMobileSignUp } from '@/hooks/useMobileSignUp';

const formatPhoneNumber = (value: string) => {
  if (!value) return value;

  const phoneNumber = value.replace(/[^\d]/g, '');
  const phoneNumberLength = phoneNumber.length;

  if (phoneNumberLength < 4) return phoneNumber;
  if (phoneNumberLength < 7) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  }
  return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
    3,
    6,
  )}-${phoneNumber.slice(6, 10)}`;
};

export const usePhoneScreen = () => {
  const { withRedirect } = useLocalSearchParams<{
    withRedirect?: string;
  }>();

  const {
    onSignIn,
    loading: signInLoading,
    error: signInError,
    closeErrorModal: closeSignInErrorModal,
  } = useMobileSignIn();
  const {
    onSignUp,
    loading: signUpLoading,
    error: signUpError,
    closeErrorModal: closeSignUpErrorModal,
  } = useMobileSignUp();
  const phoneInput = useRef(null);
  const router = useRouter();

  const [countryCode, setCountryCode] = useState('+1');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [isPhoneNumberExist, setIsPhoneNumberExist] = useState(false);

  const handleSignIn = async () => {
    setIsButtonDisabled(true);
    setPendingVerification(false);
    if (isValid) {
      const fullPhoneNumber = `${countryCode}${phoneNumber.replace(
        /[^\d]/g,
        '',
      )}`;
      const isPhoneNumberAlreadyExist = await checkIsPhoneNumberExist(
        fullPhoneNumber,
      );
      setIsPhoneNumberExist(isPhoneNumberAlreadyExist.exists);

      if (isPhoneNumberAlreadyExist.exists) {
        await onSignIn(fullPhoneNumber);
      } else {
        await onSignUp(fullPhoneNumber);
      }
      setPendingVerification(true);
    }
    setIsButtonDisabled(false);
  };

  const handlePhoneChange = (number: string) => {
    setPhoneNumber(formatPhoneNumber(number));
    validatePhoneNumber(number);
  };

  const handleCountryCodeChange = (code: string) => {
    setCountryCode(code);
  };

  const validatePhoneNumber = (number: string) => {
    const cleanNumber = number.replace(/[^\d]/g, '');
    const isValid = /^\d{10}$/.test(cleanNumber);
    setIsValid(isValid);
  };

  useEffect(() => {
    validatePhoneNumber(phoneNumber);
  }, [phoneNumber]);

  useEffect(() => {
    if (pendingVerification && !signInError && !signUpError) {
      router.push({
        pathname: '/auth/verification',
        params: {
          isSignIn: isPhoneNumberExist.toString(),
          phoneNumber: phoneNumber,
          withRedirect: withRedirect,
        },
      });
    }
  }, [pendingVerification, isPhoneNumberExist]);

  return {
    phoneInput,
    countryCode,
    phoneNumber,
    isValid,
    handleSignIn,
    handlePhoneChange,
    handleCountryCodeChange,
    signInLoading,
    signUpLoading,
    signInError,
    signUpError,
    closeSignInErrorModal,
    closeSignUpErrorModal,
    isButtonDisabled,
  };
};
