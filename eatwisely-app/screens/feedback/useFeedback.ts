import { setConnects } from '@/api/paymentService';
import { sendFeedback } from '@/api/userService';
import { mixpanel } from '@/app/_layout';
import { useAppContext } from '@/providers/AppContext';
import { useAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { Keyboard, Platform } from 'react-native';

const useFeedback = () => {
  const { userId, isSignedIn } = useAuth();
  const router = useRouter();
  const { setRequestState } = useAppContext();
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [feedbackText, setFeedbackText] = useState<string>('');
  const [paddingBottom, setPaddingBottom] = useState(12);
  const [ratingError, setRatingError] = useState<string | null>(null);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  const emojis = ['😠', '😟', '🙂', '😌', '🤩'];

  const handleRatingPress = (index: number) => {
    setSelectedRating(index + 1);
    setRatingError(null);
  };

  const handleSendPress = async () => {
    let hasError = false;

    if (!selectedRating) {
      setRatingError('Please select a rating.');
      hasError = true;
    }

    if (!feedbackText) {
      setFeedbackError('Please enter your feedback.');
      hasError = true;
    }

    if (hasError || !userId) {
      return;
    }

    try {
      const response = await sendFeedback(userId, selectedRating, feedbackText);
      if (
        response.message ===
        'Feedback successfully saved and user settings updated'
      ) {
        mixpanel.track('SEND_FEEDBACK', {
          timestamp: new Date().toISOString(),
          smiles: selectedRating,
          content: feedbackText,
        });

        router.replace({
          pathname: '/home/profile',
          params: {
            successMessage: 'Thank you! We’ve added 5 credits.',
          },
        });

        setRequestState({ feedbackSubmitted: true });
        const connectsResponse = await setConnects(userId, 5);

        setRequestState({
          connects: connectsResponse.connects,
          initialConnects: connectsResponse.initialConnects,
        });
      } else {
        router.replace({
          pathname: '/home/profile',
          params: {
            successMessage: 'Something went wrong. Please try again.',
          },
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleFeedbackTextChange = (text: string) => {
    setFeedbackText(text);
    setFeedbackError(null);
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        if (Platform.OS === 'android') {
          setPaddingBottom(12);
        }
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        if (Platform.OS === 'android') {
          setPaddingBottom(12);
        }
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  useEffect(() => {
    if (!isSignedIn) {
      router.replace('/home');
    }
  }, []);

  return {
    selectedRating,
    feedbackText,
    paddingBottom,
    emojis,
    setFeedbackText: handleFeedbackTextChange,
    handleRatingPress,
    handleSendPress,
    ratingError,
    feedbackError,
  };
};

export default useFeedback;
