import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import styles from './feedback.styles';
import VariedButton from '@/components/VariedButton';
import useFeedback from './useFeedback';
import DeviceInfo from 'react-native-device-info';
import WarningBlock from '@/components/WarningBlock';
import { useAppContext } from '@/providers/AppContext';

export default function Feedback() {
  const { requestState, setNotificationMessage } = useAppContext();

  const {
    selectedRating,
    feedbackText,
    paddingBottom,
    emojis,
    setFeedbackText,
    handleRatingPress,
    handleSendPress,
    ratingError,
    feedbackError,
  } = useFeedback();

  const model = DeviceInfo.getModel();

  const keyboardVerticalOffset =
    Platform.OS === 'ios' && model.includes('iPhone 12') ? 66 : 74;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      <ScrollView>
        <View style={styles.innerContainer}>
          <Text style={styles.title}>Share your thoughts</Text>
          <Text style={styles.subtitle}>How do you like the app?</Text>

          <View style={styles.emojiContainer}>
            {emojis.map((emoji, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleRatingPress(index)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.emoji,
                    selectedRating === index + 1 && styles.selectedEmoji,
                  ]}
                >
                  {emoji}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {ratingError ? (
            <Text style={styles.errorText}>{ratingError}</Text>
          ) : null}

          <Text style={styles.subtitle}>
            What can we do to make it even better?
          </Text>
          <TextInput
            style={styles.textInput}
            value={feedbackText}
            onChangeText={setFeedbackText}
            multiline
          />
          {feedbackError ? (
            <Text style={styles.errorText}>{feedbackError}</Text>
          ) : null}
        </View>
      </ScrollView>
      <View
        style={[
          styles.saveButtonContainer,
          {
            paddingBottom: Platform.select({
              ios: 60,
              android: paddingBottom,
            }),
          },
        ]}
      >
        <VariedButton
          variant="red"
          title="Send"
          onClick={handleSendPress}
          disabled={!selectedRating || !feedbackText}
        />
      </View>
      {requestState.notificationMessage && (
        <WarningBlock
          visible={!!requestState.notificationMessage}
          errorMessage={requestState.notificationMessage}
          onClose={() => setNotificationMessage('')}
          top={4}
          type="success"
        />
      )}
    </KeyboardAvoidingView>
  );
}
