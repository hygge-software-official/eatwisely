import * as Sentry from "@sentry/aws-serverless";
import express from 'express';
import { errorHandlerSentry } from '../../utils/errorHandlerSentry.js';

const router = express.Router();

const groceryList = {
  produce: [
    "acorn squash", "apples", "arugula", "artichokes", "asparagus", "avocado",
    "bananas", "basil", "beets", "bell peppers", "blackberries", "blueberries",
    "broccoli", "brussels sprouts", "butternut squash", "cabbage", "carrots",
    "cauliflower", "celery", "cherry tomatoes", "cherries", "cilantro",
    "cucumber", "corn", "dill", "eggplant", "fennel", "garlic", "ginger",
    "grape tomatoes", "grapes", "green beans", "green onions", "jalapeno peppers",
    "kale", "kiwi", "lemongrass", "lemons", "lettuce", "limes", "mango",
    "mint", "mushrooms", "nectarines", "onions", "papaya", "parsley",
    "parsnips", "peaches", "peas", "pineapple", "plums", "potatoes", "pumpkin",
    "radishes", "raspberries", "red onions", "rosemary", "sage", "shallots",
    "spinach", "spaghetti squash", "strawberries", "sweet potatoes", "thyme",
    "tomatoes", "turmeric", "turnips", "yellow squash", "zucchini"
  ],
  meat: [
    "bacon", "beef brisket", "beef ribs", "beef roast", "beef steak", "burger patties",
    "chicken breast", "chicken drumsticks", "chicken tenders", "chicken thighs",
    "chicken wings", "duck breast", "goat meat", "ground beef", "ground chicken",
    "ground lamb", "ground pork", "ground turkey", "ham", "lamb chops",
    "lamb roast", "lamb shanks", "pork chops", "pork ribs", "pork tenderloin",
    "prosciutto", "quail", "rabbit", "sausage", "turkey breast", "turkey thighs",
    "venison", "whole chicken", "whole duck", "whole turkey"
  ],
  seafood: [
    "anchovies", "clams", "cod", "crab", "halibut", "haddock", "lobster", "mahi-mahi",
    "mussels", "octopus", "oysters", "prawns", "salmon", "sardines", "scallops",
    "shrimp", "squid", "tilapia", "trout", "tuna"
  ],
  dairy_and_eggs: [
    "almond milk", "buttermilk", "butter", "coconut milk", "condensed milk",
    "cream", "eggs", "Greek yogurt", "half-and-half", "heavy cream", "kefir",
    "milk", "oat milk", "sour cream", "soy milk", "whipping cream", "yogurt"
  ],
  cheese: [
    "brie", "burrata", "camembert", "cheddar cheese", "cottage cheese",
    "cream cheese", "feta cheese", "gorgonzola", "goat cheese", "gouda",
    "havarti", "monterey jack", "mozzarella cheese", "paneer", "Parmesan cheese",
    "pecorino romano", "queso fresco", "ricotta cheese", "Swiss cheese"
  ],
  bakery: [
    "bagels", "baguette", "brownies", "cakes", "cookies", "croissants", "donuts",
    "focaccia", "flatbread", "hamburger buns", "muffins", "naan bread", "pastries",
    "pie crusts", "pita bread", "pizza dough", "rolls", "rye bread",
    "sourdough bread", "tortillas", "white bread", "whole wheat bread"
  ],
  pantry: [
    "allspice", "allulose", "almonds", "almond flour", "apple cider vinegar", "baking powder", 
    "baking soda", "balsamic vinegar", "brazil nuts", "breadcrumbs", "brown rice", 
    "brown sugar", "buckwheat flour", "canned beans", "canned salmon", "canned sardines", 
    "canned soup", "canned tomatoes", "canned tuna", "cashews", "cayenne pepper", 
    "cavatappi", "chia seeds", "chickpeas", "chili powder", "cinnamon powder", 
    "cloves", "coconut flour", "coconut oil", "coconut sugar", "conchiglie", "corn flour", 
    "corn meal", "corn starch", "corn syrup", "couscous", "crushed red pepper", 
    "cumin", "dried basil", "dried fruit", "dried oregano", "dried rosemary", 
    "dried sage", "dried thyme", "farfalle", "fettuccine", "flax seeds", "flour", 
    "fusilli", "garlic powder", "ginger powder", "granola", "hazelnuts", "honey", 
    "hot sauce", "jam", "jasmine rice", "ketchup", "kidney beans", "lentils", 
    "linguine", "macadamia nuts", "macaroni", "maple syrup", "mayonnaise", 
    "mustard", "noodles", "nutmeg", "oat flour", "oats", "olive oil", "onion powder", 
    "orzo", "pasta", "pasta sauce", "peanut butter", "peanuts", "pecans", "penne", 
    "pinto beans", "pistachios", "popcorn", "powdered sugar", "pumpkin seeds", 
    "quinoa", "ramen", "red wine vinegar", "rice", "rice flour", "rice noodles", "rigatoni", 
    "rye flour", "salt", "seeds", "soba noodles", "soy sauce", "spaghetti", "spices", 
    "stock", "sugar", "sunflower seeds", "tapioca flour", "tomato paste", "tortellini", 
    "turmeric powder", "udon noodles", "vegetable oil", "vinegar", "walnuts", "white rice", 
    "white wine vinegar", "wild rice", "whole wheat flour", "Worcestershire sauce", "ziti"
],
  frozen: [
    "frozen blackberries", "frozen blueberries", "frozen bread", "frozen broccoli",
    "frozen carrots", "frozen cherries", "frozen corn", "frozen desserts",
    "frozen fish fillets", "frozen french fries", "frozen fruit", "frozen green beans",
    "frozen hash browns", "frozen mango", "frozen mixed vegetables",
    "frozen pancakes", "frozen pastries", "frozen peaches", "frozen peas",
    "frozen pizza", "frozen potatoes", "frozen raspberries", "frozen seafood",
    "frozen spinach", "frozen strawberries", "frozen waffles", "frozen yogurt",
    "ice cream", "sorbet"
  ],
  // beverages: [
  //   "coconut water", "coffee", "cranberry juice", "energy drinks", "flavored water",
  //   "grape juice", "green tea", "herbal tea", "iced tea", "kombucha", "lemonade",
  //   "orange juice", "protein shakes", "soda", "sparkling water", "tea", "water"
  // ],
  international: [
    "black bean paste", "bonito flakes", "cardamom", "caraway seeds", "cinnamon",
    "curry leaves", "curry paste", "curry powder", "dashi powder", "dashi stock",
    "dried mushrooms", "dumpling wrappers", "fenugreek", "fish sauce",
    "fennel seeds", "garam masala", "gochujang", "ghee", "harissa",
    "hoisin sauce", "kefir", "kimchi", "kombu", "lime leaves",
    "matcha powder", "mirin", "miso paste", "mochi", "monk fruit extract", "nori", 
    "ponzu sauce", "pocky sticks", "ramune soda", "sesame oil", "sesame seeds",
    "spring roll wrappers", "sriracha", "star anise", "sumac",
    "tabbouleh", "tamarind paste", "tandoori masala", "tom yum paste",
    "wasabi", "za'atar"
  ]
};


function flattenList(list) {
  return Object.values(list).flat().map(item => {
    return item.charAt(0).toUpperCase() + item.slice(1);
  });
}


const ingredients = flattenList(groceryList);

router.get('/', (req, res) => {
  try {
    if (!ingredients || ingredients.length === 0) {
      Sentry.captureException('No ingredients data available');
      throw new Error('No ingredients data available');
    }
    res.status(200).json(ingredients);
  } catch (error) {
    errorHandlerSentry(res, error, 'Failed to fetch ingredients data');
  }
});

export default router;
