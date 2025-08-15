import { BASE_URL } from '@/constants/baseUrl';
import axios from 'axios';

export const getAuthToken = async (phoneNumber?: string, email?: string) => {
  try {
    const body = phoneNumber ? { phoneNumber } : email ? { email } : {};
    const response = await axios.post(`${BASE_URL}auth/auth`, body);
    return response.data;
  } catch (error) {
    console.error('Error getting token', error);
    throw error;
  }
};

export const checkIsPhoneNumberExist = async (phoneNumber: string) => {
  try {
    const response = await axios.post(
      `${BASE_URL}auth/check-phone`,
      { phoneNumber },
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error checking if phone number exists', error);
    throw error;
  }
};

export const deleteUserSettings = async (userId: string) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}settings/delete-user-settings?userId=${userId}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response?.data || error.message);
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
};

export const getFeedback = async (userId: string) => {
  try {
    const response = await axios.get(`${BASE_URL}feedback?userId=${userId}`, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching diets', error);
    throw error;
  }
};

export const sendFeedback = async (
  userId: string,
  rating: number | null,
  message: string,
) => {
  try {
    const response = await axios.post(
      `${BASE_URL}feedback/submit`,
      {
        userId,
        rating,
        message,
      },
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error submitting feedback', error);
    throw error;
  }
};
