// Wording shared by the Learn page and the process popups on the public page.
export const PROCESS_INFO = {
  washed:    { text: "The fruit is washed off the bean before it dries. Clean, crisp and bright, letting the origin and variety show.", tastes: "Citrus, florals, tea" },
  natural:   { text: "The whole cherry is dried with the seed inside. Sweeter and fruitier, with a heavier body.", tastes: "Berries, jam, chocolate" },
  honey:     { text: "The skin comes off but some sticky fruit stays on while drying. It sits between washed and natural.", tastes: "Stone fruit, caramel, a round sweetness" },
  anaerobic: { text: "Fermented in sealed tanks without oxygen before drying. Intense and unusual.", tastes: "Tropical fruit, wine, spice" },
  coferment: { text: "Fermented together with fruit, yeast or other ingredients. Bold, and it divides opinion.", tastes: "Whatever was added: candy, fruit, dessert" },
  carbonic:  { text: "Whole cherries ferment in a tank filled with carbon dioxide, a method borrowed from winemaking.", tastes: "Red fruit, wine, a silky feel" },
};

export const PROCESS_ORDER = ["washed", "natural", "honey", "anaerobic", "coferment", "carbonic"];

// Process tiles dark enough to need light text on top.
export const DARK_TILES = ["natural", "carbonic"];
