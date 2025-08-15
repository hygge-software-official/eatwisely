import { useEffect, useState, useCallback } from 'react';
import * as RNIap from 'react-native-iap';
import { Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { paymentOptions } from '@/helpers/paymentOptions';
import { useAuth } from '@clerk/clerk-expo';
import {
  PaymentData,
  processPayment,
  setConnects,
  validateReceipt,
} from '@/api/paymentService';
import * as Device from 'expo-device';
import * as Application from 'expo-application';
import { useAppContext } from '@/providers/AppContext';
import { mixpanel } from '@/app/_layout';
import * as Sentry from '@sentry/react-native';

export const useAddCredits = () => {
  const { withRedirect } = useLocalSearchParams<{
    withRedirect?: string;
  }>();
  const { startLoading, stopLoading } = useAppContext();

  const router = useRouter();
  const { userId } = useAuth();
  const [products, setProducts] = useState<RNIap.Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [errorVisible, setErrorVisible] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleError = (message: string, error: any) => {
    setError(message);
    setErrorVisible(true);
    setLoading(false);
    stopLoading();

    Sentry.captureException(new Error(message), {
      extra: {
        userId,
        device: Device.modelName,
        osVersion: Platform.Version,
        error,
      },
    });
  };

  const closeError = () => {
    setErrorVisible(false);
    setSuccessMessage(null);
    setError(null);
  };

  useEffect(() => {
    const initIAPConnection = async () => {
      try {
        await RNIap.initConnection();

        const availableProducts = await RNIap.getProducts({
          skus: paymentOptions.map((option) => option.productId),
        });

        setProducts(availableProducts);
      } catch (err) {
        stopLoading();
        handleError('Something went wrong. Please try again.', err);
      }
    };

    initIAPConnection();

    const purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(
      async (purchase: RNIap.Purchase) => {
        const receipt = purchase.transactionReceipt;
        if (receipt && userId && purchase.transactionId) {
          try {
            if (Platform.OS === 'ios') {
              await RNIap.finishTransaction({
                purchase,
                isConsumable: true,
              });
            } else if (Platform.OS === 'android') {
              if (purchase.purchaseToken) {
                await RNIap.acknowledgePurchaseAndroid({
                  token: purchase.purchaseToken,
                });
                await RNIap.finishTransaction({
                  purchase,
                  isConsumable: true,
                });
              } else {
                throw new Error('Something went wrong. Please try again.');
              }
            }

            const selectedProduct = paymentOptions.find(
              (option) => option.productId === purchase.productId,
            );

            if (!selectedProduct) {
              throw new Error('Something went wrong. Please try again.');
            }

            const deviceInfo = {
              type: Platform.OS,
              model: Device.modelName || 'Unknown model',
              osVersion: Platform.Version.toString(),
            };

            const metadata = {
              appVersion: Application.nativeApplicationVersion || '1.0.0',
            };

            const paymentData: PaymentData = {
              userId: userId,
              createdAt: Date.now(),
              paymentId: purchase.transactionId,
              amount: parseFloat(selectedProduct.totalPrice.replace('$', '')),
              currency: 'USD',
              paymentMethod: Platform.OS === 'ios' ? 'ApplePay' : 'GooglePay',
              paymentToken: receipt,
              productId: purchase.productId,
              creditsAdded: selectedProduct.creditsAdded,
              status: 'completed',
              deviceInfo,
              metadata,
            };

            if (Platform.OS === 'ios') {
              const validationResponse = await validateReceipt(
                receipt,
                Platform.OS,
                purchase.productId,
              );

              if (!validationResponse.success) {
                handleError(
                  'Something went wrong. Please try again.',
                  validationResponse.success,
                );
                Sentry.captureMessage(
                  'Іomething went wrong. Please try again',
                  {
                    level: 'info',
                    extra: {
                      validationStatus: validationResponse.success,
                      timestamp: new Date().toISOString(),
                    },
                  },
                );
                throw new Error('Receipt validation failed');
              }
            }

            await setConnects(userId, selectedProduct.creditsAdded);

            await processPayment(paymentData);

            mixpanel.track('PURCHASED', {
              timestamp: new Date().toISOString(),
              purchase_option: selectedProduct.creditsAdded,
              purchase_price: parseFloat(
                selectedProduct.totalPrice.replace('$', ''),
              ),
            });

            if (withRedirect) {
              router.push({
                pathname: '/recipe/loading',
                params: {
                  successMessage: `${selectedProduct.title} have been added.`,
                },
              });
            }
          } catch (ackErr) {
            console.info(ackErr);
          } finally {
            stopLoading();
          }
        }
      },
    );

    const purchaseErrorSubscription = RNIap.purchaseErrorListener(
      (err: RNIap.PurchaseError) => {
        if (err.code !== 'E_USER_CANCELLED') {
          handleError('Something went wrong. Please try again.', err);
        }
      },
    );

    return () => {
      purchaseUpdateSubscription.remove();
      purchaseErrorSubscription.remove();
      RNIap.endConnection();
    };
  }, [userId]);

  const handlePurchase = useCallback(
    async (productId: string) => {
      closeError();
      setLoading(true);
      setError(null);
      setErrorVisible(false);
      startLoading();

      try {
        let request: RNIap.RequestPurchase;

        if (Platform.OS === 'ios') {
          request = {
            sku: productId,
            andDangerouslyFinishTransactionAutomaticallyIOS: false,
          };
        } else if (Platform.OS === 'android') {
          request = {
            skus: [productId],
          };
        } else {
          throw new Error('Something went wrong. Please try again.');
        }

        const product = products.find((p) => p.productId === productId);
        if (!product) {
          throw new Error('Something went wrong. Please try again.');
        }

        await RNIap.requestPurchase(request);
      } catch (err) {
        console.info('Something went wrong. Please try again.');
      } finally {
        setLoading(false);
        stopLoading();
      }
    },
    [products],
  );

  return {
    paymentOptions,
    loading,
    error,
    errorVisible,
    successMessage,
    closeError,
    handlePurchase,
  };
};
