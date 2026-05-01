export const categories = [
  { id: 'all', name: 'Signature Menu', icon: '🍽️' },
  { id: 'appetizers', name: 'Appetizers', icon: '🥗' },
  { id: 'mains', name: 'Mains', icon: '🥩' },
  { id: 'drinks', name: 'Drinks', icon: '🍸' },
  { id: 'desserts', name: 'Desserts', icon: '🍰' },
];

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  description: string;
  isPopular?: boolean;
  ingredients: string[];
  tag?: string;
  calories?: string;
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Royal Lamb Shank',
    category: 'mains',
    price: 285,
    rating: 4.9,
    reviews: 156,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=1200',
    description: 'Slow-braised for twelve hours in a rich cardamom and saffron broth, served over smoked freekeh.',
    isPopular: true,
    ingredients: ['Australian Lamb', 'Iranian Saffron', 'Green Freekeh', 'Toasted Pine Nuts', 'Minted Yogurt'],
    tag: 'Signature',
    calories: '650 kcal'
  },
  {
    id: '2',
    name: 'Zaffron Sea Bass',
    category: 'mains',
    price: 240,
    rating: 4.8,
    reviews: 92,
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=800',
    description: 'Pan-seared wild sea bass with a delicate citrus-saffron emulsion and charred asparagus spears.',
    isPopular: true,
    ingredients: ['Wild Sea Bass', 'Saffron Emulsion', 'Asparagus', 'Meyer Lemon', 'Heirloom Carrots'],
    tag: 'Fresh Catch',
    calories: '420 kcal'
  },
  {
    id: '3',
    name: 'Wagyu Ribeye Tajine',
    category: 'mains',
    price: 450,
    rating: 5.0,
    reviews: 42,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800',
    description: 'A masterpiece Grade A5 Wagyu prepared with Moroccan spices, dried apricots, and honey essence.',
    isPopular: true,
    ingredients: ['A5 Wagyu Beef', 'Dried Apricots', 'Honey', 'Cumin', 'Cinnamon', 'Toasted Almonds'],
    tag: 'Royal Elite',
    calories: '820 kcal'
  },
  {
    id: '4',
    name: 'Truffle Moutabel Pasta',
    category: 'mains',
    price: 195,
    rating: 4.7,
    reviews: 78,
    image: 'https://images.unsplash.com/photo-1595295333158-4742f28fbd37?auto=format&fit=crop&q=80&w=800',
    description: 'Handmade tagliatelle tossed in a creamy roasted eggplant and black truffle sauce.',
    isPopular: false,
    ingredients: ['Durum Wheat Tagliatelle', 'Roasted Eggplant', 'Black Truffle', 'Parmigiano Reggiano'],
    tag: 'Vegetarian',
    calories: '540 kcal'
  },
  {
    id: '5',
    name: 'Golden Saffron Hummus',
    category: 'appetizers',
    price: 65,
    rating: 4.9,
    reviews: 210,
    image: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&q=80&w=800',
    description: 'Silky smooth hummus infused with premium saffron and topped with warm lamb confit.',
    isPopular: true,
    ingredients: ['Chickpeas', 'Tahini', 'Iranian Saffron', 'Lamb Confit', 'Warm Pita'],
    tag: 'Classic',
    calories: '310 kcal'
  },
  {
    id: '6',
    name: 'Velvet Date Pudding',
    category: 'desserts',
    price: 85,
    rating: 4.9,
    reviews: 145,
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&q=80&w=800',
    description: 'Warm medjool date sponge with salted butterscotch sauce and clotted cream ice cream.',
    isPopular: true,
    ingredients: ['Medjool Dates', 'Butterscotch', 'Clotted Cream', 'Sea Salt'],
    tag: 'Bestseller',
    calories: '480 kcal'
  }
];
