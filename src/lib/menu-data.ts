// Menu data — structured for future CMS / admin replacement.
// Each item has stable id so a backend can later upsert against it.

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: string; // e.g. "14.50"
  tags?: string[];
};

export type MenuCategory = {
  id: string;
  name: string;
  items: MenuItem[];
};

export const menu: MenuCategory[] = [
  {
    id: "starters",
    name: "Starters",
    items: [
      { id: "pkhali", name: "Pkhali Trio", description: "Spinach, beet and carrot walnut pâtés with pomegranate.", price: "11.50" },
      { id: "badrijani", name: "Badrijani Nigvzit", description: "Eggplant rolls with walnut paste, garlic and pomegranate.", price: "12.50" },
      { id: "georgian-salad", name: "Georgian Salad", description: "Tomato, cucumber, red onion and herbs in walnut dressing.", price: "10.00" },
      { id: "lobio-starter", name: "Lobio in Clay Pot", description: "Slow-cooked red beans with mountain herbs and mchadi bread.", price: "12.00" },
    ],
  },
  {
    id: "khachapuri",
    name: "Khachapuri",
    items: [
      { id: "adjaruli", name: "Adjaruli", description: "Boat-shaped bread with sulguni cheese, butter and farm egg.", price: "14.50" },
      { id: "imeruli", name: "Imeruli", description: "Round flatbread filled with melted sulguni.", price: "12.50" },
      { id: "megruli", name: "Megruli", description: "Double-cheese khachapuri, baked golden inside and out.", price: "15.00" },
    ],
  },
  {
    id: "khinkali",
    name: "Khinkali",
    items: [
      { id: "khinkali-beef", name: "Beef & Pork Khinkali", description: "Hand-pleated dumplings with spiced broth (per piece).", price: "2.20" },
      { id: "khinkali-lamb", name: "Lamb Khinkali", description: "Highland lamb, cilantro and black pepper (per piece).", price: "2.50" },
      { id: "khinkali-mushroom", name: "Mushroom Khinkali", description: "Forest mushrooms and herbs, vegetarian (per piece).", price: "2.00" },
    ],
  },
  {
    id: "mains",
    name: "Main Dishes",
    items: [
      { id: "mtsvadi", name: "Mtsvadi", description: "Vine-wood grilled pork skewers, smoky with pomegranate jus.", price: "22.00" },
      { id: "chakapuli", name: "Chakapuli", description: "Lamb stewed with tarragon, plums and white wine.", price: "24.00" },
      { id: "ojakhuri", name: "Ojakhuri", description: "Family-style pork and potatoes from the iron pan.", price: "19.50" },
      { id: "shkmeruli", name: "Shkmeruli", description: "Roasted chicken in garlic cream, served sizzling.", price: "21.00" },
    ],
  },
  {
    id: "vegetarian",
    name: "Vegetarian",
    items: [
      { id: "ajapsandali", name: "Ajapsandali", description: "Eggplant, peppers and tomato stew with basil.", price: "15.00" },
      { id: "lobio-v", name: "Lobio Nigvziani", description: "Red beans with walnuts, coriander and mchadi.", price: "13.50" },
      { id: "khinkali-mushroom-v", name: "Mushroom Khinkali", description: "Vegetarian dumplings (per piece).", price: "2.00" },
    ],
  },
  {
    id: "wine",
    name: "Georgian Wine",
    items: [
      { id: "saperavi", name: "Saperavi, Kakheti", description: "Bold dry red — dark cherry, smoke, mountain earth. (Glass)", price: "8.50" },
      { id: "mukuzani", name: "Mukuzani Reserve", description: "Aged Saperavi, deep and structured. (Glass)", price: "11.00" },
      { id: "rkatsiteli", name: "Rkatsiteli Qvevri", description: "Amber wine fermented in clay. Floral, tannic. (Glass)", price: "9.50" },
      { id: "kindzmarauli", name: "Kindzmarauli", description: "Semi-sweet red — plum, blackberry, soft finish. (Glass)", price: "8.50" },
      { id: "bottle-kakheti", name: "Bottle — House Kakheti", description: "Daily selection from our cellar.", price: "38.00" },
    ],
  },
  {
    id: "desserts",
    name: "Desserts",
    items: [
      { id: "churchkhela", name: "Churchkhela", description: "Walnuts strung and dipped in concentrated grape must.", price: "6.50" },
      { id: "pelamushi", name: "Pelamushi", description: "Silky grape pudding, served chilled with walnuts.", price: "7.00" },
      { id: "honey-cake", name: "Georgian Honey Cake", description: "Layered honey sponge with sour cream.", price: "7.50" },
    ],
  },
  {
    id: "drinks",
    name: "Drinks",
    items: [
      { id: "borjomi", name: "Borjomi Mineral Water", description: "Naturally carbonated, from the Caucasus.", price: "4.50" },
      { id: "tarkhuna", name: "Tarkhuna", description: "Classic Georgian tarragon lemonade.", price: "4.00" },
      { id: "chacha", name: "Chacha", description: "Georgian grape brandy. (Shot)", price: "5.50" },
      { id: "georgian-tea", name: "Georgian Tea", description: "Black tea from the hills of Guria.", price: "3.50" },
    ],
  },
];
