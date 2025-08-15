export const generateRecipePrompt = (parameters, excludeTitles) => {
    return `Given the following parameters, generate a healthy recipe. Ensure that the recipe respects a meal type and all dietary restrictions, dislikes, and allergies provided. The recipe should be feasible within the specified cooking time and suitable for the number of servings indicated.

Parameters:
- meal type: ${parameters.mealType}
- cuisine: ${parameters.cuisine}
- ingredients: ${parameters.ingredients.join(', ')}
- time to cook: ${parameters.timeToCook}
- servings: ${parameters.servings}
- diet: ${parameters.diet}
- goal: ${parameters.goal}
- dislikes: ${parameters.dislikes.join(', ')}
- allergies: ${parameters.allergies.join(', ')}

Ensure that:
1. The recipe does not include any ingredients listed in the dislikes or allergies.
2. The recipe aligns with the specified diet.
3. The total cooking time does not exceed the specified time to cook.
4. The recipe is appropriate for the number of servings.
5. The recipe supports the specified goal (e.g., low calorie for weight loss).
6. The recipe instructions include the stove heat level (1-10) where applicable.

The response should be in JSON format with the following structure:
{
  "title": "Recipe Name",
  "ingredients": [
    {
      "ingredient_name": "ingredient1",
      "quantity": "quantity1",
      "unit": "unit1"
    },
    {
      "ingredient_name": "ingredient2",
      "quantity": "quantity2",
      "unit": "unit2"
    }
  ],
  "instructions": {
    "prep": [
      "Step1",
      "Step2"
    ],
    "cook": [
      "Step1",
      "Step2"
    ],
    "serving": [
      "Step1",
      "Step2"
    ]
  },
  "cuisine": string,
  "servings": int,
  "prep_time": int,
  "cook_time": int,
  "macronutrients_per_serving": {
    "calories": int,
    "protein": int,
    "fat": int,
    "carbs": {
      "total": int,
      "dietary fiber": int,
      "total sugars": {
        "total": int,
        "includes added sugars": int
      }
    }
  }
}

Do not return the previously returned recipes: ${JSON.stringify(excludeTitles)}`;
};
