import { BASE_URL } from '@/constants/baseUrl';
import axios from 'axios';

interface RecipeParameters {
  mealType: string;
  cuisine: string;
  timeToCook: string;
  servings: number;
  diet: string;
  goal: string;
  ingredients: string[];
  dislikes: string[];
  allergies: string[];
}

interface RecipeRequestBody {
  parameters: RecipeParameters;
}

interface AllergiesData {
  [key: string]: string[];
}

export const getRecipe = async (
  requestBody: RecipeRequestBody,
  token: string,
  userId: string,
) => {
  try {
    const response = await axios.post(
      `${BASE_URL}ai/recipe?max_gen_len=1000&userId=${userId}`,
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching recipe', error);
    throw error;
  }
};

export const likeRecipe = async (userId: string, recipeId: string) => {
  try {
    const response = await axios.put(
      `${BASE_URL}user/recipe/like?userId=${userId}&recipeId=${recipeId}`,
    );
    return response.data;
  } catch (error) {
    console.error('Error liking recipe', error);
    throw error;
  }
};

export const saveRecipe = async (userId: string, recipeId: string) => {
  try {
    const response = await axios.put(
      `${BASE_URL}user/recipe/save?userId=${userId}&recipeId=${recipeId}`,
    );
    return response.data;
  } catch (error) {
    console.error('Error saving recipe', error);
    throw error;
  }
};

export const fetchPreferencesSettings = async (userId: string) => {
  try {
    const response = await axios.get(`${BASE_URL}settings?userId=${userId}`);

    return response.data || null;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      return null;
    }
    throw error;
  }
};

export const savePreferencesSettings = async (
  userId: string,
  settings: any,
) => {
  try {
    const response = await axios.post(
      `${BASE_URL}settings/save?userId=${userId}`,
      settings,
    );

    return response.data;
  } catch (error) {
    console.error('Error saving preferences settings', error);
    throw error;
  }
};

export const updatePreferencesSettings = async (
  userId: string,
  settings: any,
) => {
  try {
    const response = await axios.put(
      `${BASE_URL}settings/update?userId=${userId}`,
      settings,
    );
    return response.data;
  } catch (error) {
    console.error('Error updating preferences settings', error);
    throw error;
  }
};

export const deletePreferencesSettings = async (userId: string) => {
  try {
    await axios.delete(`${BASE_URL}settings?userId=${userId}`);
  } catch (error) {
    console.error('Error deleting preferences settings', error);
    throw error;
  }
};

export const getAllergiesData = async (): Promise<AllergiesData> => {
  try {
    const response = await axios.get<AllergiesData>(
      `${BASE_URL}data/allergies`,
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching allergies data', error);
    throw error;
  }
};

export const getIngredientsData = async () => {
  try {
    const response = await axios.get(`${BASE_URL}data/ingredients`, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching ingredients data', error);
    throw error;
  }
};

export const getCuisineData = async () => {
  try {
    const response = await axios.get(`${BASE_URL}data/cuisine`, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching cuisine data', error);
    throw error;
  }
};

export const getDietsData = async () => {
  try {
    const response = await axios.get(`${BASE_URL}data/diets`, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching diets', error);
    throw error;
  }
};
