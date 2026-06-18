// ============================================================
//  VELVET TABLE — Menu Data
// ============================================================

const MENU_DATA = {
  starters: {
    label: 'Starters',
    icon: '🥗',
    items: [
      {
        id: 's1', name: 'Burrata & Heirloom Tomato',
        desc: 'Creamy burrata with heirloom tomatoes, fresh basil oil, and aged balsamic reduction.',
        price: 1499, image: 'assets/food-spread.png', badges: ['veg', 'popular'], allergens: ['dairy']
      },
      {
        id: 's2', name: 'Seared Scallops',
        desc: 'Pan-seared scallops on cauliflower purée with crispy capers and herb oil.',
        price: 1999, image: 'assets/steak.png', badges: ['popular'], allergens: ['shellfish']
      },
      {
        id: 's3', name: 'Spicy Tuna Tartare',
        desc: 'Fresh tuna, avocado, yuzu ponzu, sesame, crispy wontons.',
        price: 1849, image: 'assets/food-spread.png', badges: ['spicy'], allergens: ['fish', 'soy']
      },
      {
        id: 's4', name: 'Wild Mushroom Arancini',
        desc: 'Risotto balls with truffle, fontina, mushroom ragù, and parmesan foam.',
        price: 1349, image: 'assets/pasta.png', badges: ['veg'], allergens: ['dairy', 'gluten']
      }
    ]
  },
  mains: {
    label: 'Mains',
    icon: '🥩',
    items: [
      {
        id: 'm1', name: 'Prime Ribeye Steak',
        desc: 'USDA Prime 300g ribeye, herb butter, roasted bone marrow, truffle pomme purée.',
        price: 5699, image: 'assets/steak.png', badges: ['popular'], allergens: ['dairy']
      },
      {
        id: 'm2', name: 'Black Truffle Tagliatelle',
        desc: 'House-made pasta with black truffle, aged parmesan, brown butter, and fresh herbs.',
        price: 3199, image: 'assets/pasta.png', badges: ['veg', 'popular'], allergens: ['gluten', 'dairy', 'eggs']
      },
      {
        id: 'm3', name: 'Pan-Seared Duck Breast',
        desc: 'Magret duck, cherry jus, roasted root vegetables, and wild rocket salad.',
        price: 3999, image: 'assets/steak.png', badges: [], allergens: []
      },
      {
        id: 'm4', name: 'Grilled Sea Bass',
        desc: 'Whole grilled European sea bass, lemon caper butter, haricot vert, and polenta.',
        price: 3699, image: 'assets/food-spread.png', badges: [], allergens: ['fish', 'dairy']
      },
      {
        id: 'm5', name: 'Wild Mushroom Wellington',
        desc: 'Mushroom, spinach & walnut duxelles in golden puff pastry, red wine jus.',
        price: 3049, image: 'assets/pasta.png', badges: ['veg'], allergens: ['gluten', 'dairy', 'nuts']
      },
      {
        id: 'm6', name: 'Lamb Rack — Herb Crust',
        desc: 'Frenched lamb rack, pistachio-herb crust, flageolet beans, and rosemary jus.',
        price: 4899, image: 'assets/steak.png', badges: ['spicy'], allergens: ['nuts']
      }
    ]
  },
  desserts: {
    label: 'Desserts',
    icon: '🍮',
    items: [
      {
        id: 'd1', name: 'Dark Chocolate Fondant',
        desc: 'Warm dark chocolate lava cake, Tahitian vanilla ice cream, gold-dusted berries.',
        price: 1349, image: 'assets/dessert.png', badges: ['popular'], allergens: ['dairy', 'eggs', 'gluten']
      },
      {
        id: 'd2', name: 'Crème Brûlée',
        desc: 'Classic vanilla bean custard with caramelised sugar crust and candied citrus.',
        price: 1179, image: 'assets/dessert.png', badges: ['veg'], allergens: ['dairy', 'eggs']
      },
      {
        id: 'd3', name: 'Tiramisu Royale',
        desc: 'Espresso-soaked ladyfingers, mascarpone cream, dark cocoa, Kahlúa.',
        price: 1249, image: 'assets/dessert.png', badges: [], allergens: ['dairy', 'eggs', 'gluten', 'alcohol']
      }
    ]
  },
  drinks: {
    label: 'Drinks',
    icon: '🥂',
    items: [
      {
        id: 'r1', name: 'Velvet Negroni',
        desc: 'Aged gin, Campari, sweet vermouth, orange peel, smoked rosemary.',
        price: 1499, image: 'assets/cocktail.png', badges: ['popular'], allergens: ['alcohol']
      },
      {
        id: 'r2', name: 'Golden Passion Sour',
        desc: 'Bourbon, passion fruit, lemon, honey syrup, egg white foam.',
        price: 1429, image: 'assets/cocktail.png', badges: [], allergens: ['alcohol', 'eggs']
      },
      {
        id: 'r3', name: 'Sparkling Water',
        desc: 'San Pellegrino still or sparkling mineral water.',
        price: 499, image: 'assets/cocktail.png', badges: ['veg'], allergens: []
      },
      {
        id: 'r4', name: 'House Mocktail',
        desc: 'Seasonal fruits, botanical syrups, sparkling water, fresh herbs.',
        price: 849, image: 'assets/cocktail.png', badges: ['veg', 'popular'], allergens: []
      },
      {
        id: 'r5', name: 'Single Origin Espresso',
        desc: 'Ethiopian Yirgacheffe double shot, served with sparkling water.',
        price: 679, image: 'assets/cocktail.png', badges: ['veg'], allergens: []
      }
    ]
  }
};

// Badge definitions
const BADGE_DEFS = {
  popular: { label: '⭐ Popular', class: 'popular-badge' },
  spicy:   { label: '🌶 Spicy',   class: 'spicy-badge' },
  veg:     { label: '🌿 Veg',     class: 'veg-badge' }
};

if (typeof module !== 'undefined') module.exports = { MENU_DATA, BADGE_DEFS };
