import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

//components
import WarningBlock from '@/components/WarningBlock';
import LoadingOverlay from '@/components/LoadingOverlay';

//hooks
import { useAddCredits } from './useAddCredits';

//styles
import styles from './addCredits.styles';
import { useAppContext } from '@/providers/AppContext';

export default function AddCreditsScreen() {
  const { requestState, setNotificationMessage } = useAppContext();
  const {
    paymentOptions,
    handlePurchase,
    error,
    errorVisible,
    closeError,
    successMessage,
  } = useAddCredits();

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Add credits</Text>
        <Text style={styles.text}>
          Looks like there are no credits left! Add more credits and continue
          creating delicious recipes.
        </Text>
      </View>

      <View style={styles.optionsContainer}>
        {paymentOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[styles.option, option.bestValue && styles.optionLabel]}
            activeOpacity={option.bestValue ? 1 : 0.8}
            onPress={() => handlePurchase(option.productId)}
          >
            {option.bestValue && (
              <View style={styles.bestValueHeader}>
                <Text style={styles.discountText}>{option.discountText}</Text>
                <Text style={styles.bestValueText}>{option.bestValueText}</Text>
              </View>
            )}
            <View
              style={[
                styles.optionContainer,
                option.bestValue && styles.optionShadow,
              ]}
            >
              <View style={styles.optionLeftSideContainer}>
                <Text style={styles.optionTitle}>{option.title}</Text>
                <View style={styles.pricesContainer}>
                  {option.originalPrice && (
                    <Text style={styles.originalPrice}>
                      {option.originalPrice}
                    </Text>
                  )}
                  <Text style={styles.totalPrice}>{option.totalPrice}</Text>
                </View>
              </View>
              <View style={styles.optionRightSideContainer}>
                <Text style={styles.optionTitle}>{option.pricePerRecipe}</Text>
                <Text style={styles.optionSubText}>{option.perRecipeText}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      {error && (
        <WarningBlock
          visible={errorVisible}
          errorMessage={error}
          onClose={closeError}
          top={4}
        />
      )}
      {successMessage && (
        <WarningBlock
          visible={!!successMessage}
          errorMessage={successMessage}
          onClose={closeError}
          top={4}
          type="success"
        />
      )}
      {requestState.notificationMessage && (
        <WarningBlock
          visible={!!requestState.notificationMessage}
          errorMessage={requestState.notificationMessage}
          onClose={() => setNotificationMessage('')}
          top={4}
          type="success"
        />
      )}
      <LoadingOverlay />
    </View>
  );
}
