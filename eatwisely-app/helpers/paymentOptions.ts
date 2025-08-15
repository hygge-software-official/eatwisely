type PaymentOption = {
  id: number;
  title: string;
  pricePerRecipe: string;
  totalPrice: string;
  originalPrice?: string;
  perRecipeText: string;
  bestValue?: boolean;
  discountText?: string;
  bestValueText?: string;
  productId: string;
  creditsAdded: number;
};

export const paymentOptions: PaymentOption[] = [
  {
    id: 1,
    title: '10 credits',
    pricePerRecipe: '$0.20',
    totalPrice: '$2',
    perRecipeText: 'per recipe',
    productId: '10_credits',
    creditsAdded: 10,
  },
  {
    id: 2,
    title: '25 credits',
    originalPrice: '$5',
    pricePerRecipe: '$0.16',
    totalPrice: '$4',
    perRecipeText: 'per recipe',
    productId: '25_credits',
    creditsAdded: 25,
  },
  {
    id: 3,
    title: '50 credits',
    originalPrice: '$10',
    pricePerRecipe: '$0.12',
    totalPrice: '$6',
    perRecipeText: 'per recipe',
    bestValue: true,
    discountText: '40% off',
    bestValueText: 'Best value',
    productId: '50_credits',
    creditsAdded: 50,
  },
];
