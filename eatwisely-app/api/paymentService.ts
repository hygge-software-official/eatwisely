import { BASE_URL } from '@/constants/baseUrl';
import axios from 'axios';

export type PaymentData = {
  userId: string;
  createdAt: number;
  paymentId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  paymentToken: string;
  productId: string;
  creditsAdded: number;
  status: string;
  deviceInfo: {
    type: string;
    model: string;
    osVersion: string;
  };
  metadata: {
    appVersion: string;
  };
};

export const setConnects = async (userId: string, connects?: number) => {
  try {
    const queryParams = `userId=${userId}${
      connects ? `&connects=${connects}` : ''
    }`;
    const response = await axios.put(
      `${BASE_URL}settings/set-connects?${queryParams}`,
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error setting connects', error);
    throw error;
  }
};

export const subtractConnects = async (
  userId: string,
  subtractCount: number,
) => {
  try {
    const response = await axios.put(
      `${BASE_URL}settings/connects?userId=${userId}&subtractCount=${subtractCount}`,
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error subtracting connects', error);
    throw error;
  }
};

export const processPayment = async (paymentData: PaymentData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}payments/process`,
      paymentData,
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error processing payment', error);
    throw error;
  }
};

export const validateReceipt = async (
  receipt: string,
  platform: string,
  productId: string,
) => {
  try {
    const response = await axios.post(
      `${BASE_URL}iap/validate-receipt`,
      {
        receipt,
        platform,
        productId,
      },
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );

    return response.data;
  } catch (error) {
    console.error('Error validating receipt', error);
    throw error;
  }
};
