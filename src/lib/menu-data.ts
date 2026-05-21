// Menu structure — labels are translated via i18n keys (menu.categories.* / menu.items.*.name|desc).
export type MenuItem = { id: string; price: string };
export type MenuCategory = { id: string; items: MenuItem[] };

export const menu: MenuCategory[] = [
  {
    id: "starters",
    items: [
      { id: "pkhali", price: "11.50" },
      { id: "badrijani", price: "12.50" },
      { id: "georgian-salad", price: "10.00" },
      { id: "lobio-starter", price: "12.00" },
    ],
  },
  {
    id: "khachapuri",
    items: [
      { id: "adjaruli", price: "14.50" },
      { id: "imeruli", price: "12.50" },
      { id: "megruli", price: "15.00" },
    ],
  },
  {
    id: "khinkali",
    items: [
      { id: "khinkali-beef", price: "2.20" },
      { id: "khinkali-lamb", price: "2.50" },
      { id: "khinkali-mushroom", price: "2.00" },
    ],
  },
  {
    id: "mains",
    items: [
      { id: "mtsvadi", price: "22.00" },
      { id: "chakapuli", price: "24.00" },
      { id: "ojakhuri", price: "19.50" },
      { id: "shkmeruli", price: "21.00" },
    ],
  },
  {
    id: "vegetarian",
    items: [
      { id: "ajapsandali", price: "15.00" },
      { id: "lobio-v", price: "13.50" },
      { id: "khinkali-mushroom-v", price: "2.00" },
    ],
  },
  {
    id: "wine",
    items: [
      { id: "saperavi", price: "8.50" },
      { id: "mukuzani", price: "11.00" },
      { id: "rkatsiteli", price: "9.50" },
      { id: "kindzmarauli", price: "8.50" },
      { id: "bottle-kakheti", price: "38.00" },
    ],
  },
  {
    id: "desserts",
    items: [
      { id: "churchkhela", price: "6.50" },
      { id: "pelamushi", price: "7.00" },
      { id: "honey-cake", price: "7.50" },
    ],
  },
  {
    id: "drinks",
    items: [
      { id: "borjomi", price: "4.50" },
      { id: "tarkhuna", price: "4.00" },
      { id: "chacha", price: "5.50" },
      { id: "georgian-tea", price: "3.50" },
    ],
  },
];
