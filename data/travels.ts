export type Destination = {
  id: string;
  name: string;
  country: string;
  category: string;
  image: string;
  description: string;
  price: string;
  highlights: string[];
};

export type Journey = {
  id: string;
  title: string;
  region: string;
  duration: string;
  style: string;
  image: string;
  summary: string;
  description: string;
};

export const destinations: Destination[] = [
  {
    id: "the-wild-coast",
    name: "The wild coast",
    country: "Kenya · Indian Ocean",
    category: "Coastal",
    image: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1400&q=85",
    description: "Barefoot days, warm water and the luxury of having nowhere else to be.",
    price: "$1,450 per person",
    highlights: ["Private beach access", "Swahili coastal dining experience", "Dhow sunset cruise", "All-inclusive boutique stay"]
  },
  {
    id: "into-the-wild",
    name: "Into the wild",
    country: "Kenya · Safari country",
    category: "Safari",
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1400&q=85",
    description: "Wide-open landscapes, golden light and wildlife encounters that stay with you.",
    price: "$2,100 per person",
    highlights: ["Guided sunrise game drives", "Luxury tented camp accommodation", "Bush dinner under the stars", "Conservation fee included"]
  },
  {
    id: "island-time",
    name: "Island time",
    country: "Indian Ocean · Islands",
    category: "Island",
    image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1400&q=85",
    description: "Salt in your hair, slow afternoons and a horizon that seems to go on forever.",
    price: "$1,850 per person",
    highlights: ["Overwater villa stay", "Snorkeling & coral reef tours", "Private island transfers", "Daily spa credit"]
  },
  {
    id: "mountain-quiet",
    name: "Mountain quiet",
    country: "East Africa · Highlands",
    category: "Mountain",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=85",
    description: "Fresh air, winding trails and a different perspective with every step.",
    price: "$1,250 per person",
    highlights: ["Expert mountain guide", "Highland lodge fireplace suites", "Curated hiking trails", "Organic farm-to-table meals"]
  },
];

export const journeys: Journey[] = [
  {
    id: "coastline-slowdown",
    title: "The coastline slowdown",
    region: "Kenya · Coast",
    duration: "5–7 days",
    style: "Slow living",
    image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1800&q=90",
    summary: "A few days of sea air, long lunches and nowhere you need to be.",
    description: "Wake to the sound of the ocean, discover quiet coves with local guides, and leave room in the itinerary for the best kind of plan: no plan at all. This coastal escape balances beautiful stays with the freedom to follow your own rhythm.",
  },
  {
    id: "wild-at-heart",
    title: "Wild at heart",
    region: "Kenya · Safari",
    duration: "4–6 days",
    style: "Wildlife & wonder",
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1800&q=90",
    summary: "Golden-hour game drives and nights beneath an enormous sky.",
    description: "Head into the landscape at its most alive. Thoughtful guiding, unhurried game drives and stays that bring you close to nature make this a journey for curious minds and open horizons.",
  },
  {
    id: "highland-hideaway",
    title: "The highland hideaway",
    region: "East Africa · Highlands",
    duration: "3–5 days",
    style: "Nature & reset",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1800&q=90",
    summary: "Cool mornings, mountain paths and space to hear yourself think.",
    description: "Trade the rush for crisp air and wide-open views. Spend your days exploring on foot, finding little local places and returning to a welcoming hideaway as the light fades across the hills.",
  },
];