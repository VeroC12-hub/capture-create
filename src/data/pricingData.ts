// Pricing data for Capture & Create Photography

export interface Package {
  name: string;
  type: 'photography' | 'videography';
  duration: 'one-day' | 'two-days';
  tier: 'gold' | 'diamond';
  price: string;
  priceNumeric: number;
  coverage: string[];
  includes: string[];
  highlights?: string[];
}

export interface Extra {
  category: string;
  items: {
    name: string;
    price: string;
    priceNumeric: number;
    description?: string;
  }[];
}

export const photographyPackages: Package[] = [
  {
    name: "One Day Gold",
    type: "photography",
    duration: "one-day",
    tier: "gold",
    price: "GH₵ 3,850",
    priceNumeric: 3850,
    coverage: [
      "Coverage of Ceremony & Exclusives",
      "Bridal Dress Up"
    ],
    includes: [
      "200 High Resolution Pictures (20 Retouched)",
      "Pendrive / Frame (16x20)",
      "2 photographers",
      "7 hours coverage",
      "Event activity capture (Only)"
    ],
    highlights: ["Most Popular", "Great Value"]
  },
  {
    name: "One Day Diamond",
    type: "photography",
    duration: "one-day",
    tier: "diamond",
    price: "GH₵ 4,950",
    priceNumeric: 4950,
    coverage: [
      "Coverage of Ceremony & Exclusives",
      "Bridal Dress Up"
    ],
    includes: [
      "200 High Resolution Pictures (20 Retouched)",
      "Pendrive & A4 sized photobook",
      "2 photographers",
      "Event activity capture (Only)"
    ]
  },
  {
    name: "Two Days Gold",
    type: "photography",
    duration: "two-days",
    tier: "gold",
    price: "GH₵ 6,750",
    priceNumeric: 6750,
    coverage: [
      "Coverage of Engagement & Wedding Ceremony",
      "Reception & Exclusives",
      "Bridal Dress Up + Groom Dress Up"
    ],
    includes: [
      "500 High Resolution Pictures (25 Retouched)",
      "Pendrive & Google Drive",
      "One A4 Photobook",
      "1 Frame 16x20",
      "2 photographers",
      "Event activity capture (Only)"
    ],
    highlights: ["Best for Full Wedding"]
  },
  {
    name: "Two Days Diamond",
    type: "photography",
    duration: "two-days",
    tier: "diamond",
    price: "GH₵ 7,000",
    priceNumeric: 7000,
    coverage: [
      "Coverage of Engagement & Wedding Ceremony",
      "Reception & Exclusives",
      "Bridal Dress Up + Groom Dress Up"
    ],
    includes: [
      "Unlimited High Resolution Pictures (15 Retouched)",
      "Pendrive & A3 photobook",
      "2 Frames 16x20",
      "2 photographers",
      "Event activity capture (Only)"
    ],
    highlights: ["Premium Package", "Unlimited Photos"]
  }
];

export const videographyPackages: Package[] = [
  {
    name: "One Day Gold",
    type: "videography",
    duration: "one-day",
    tier: "gold",
    price: "GH₵ 2,950",
    priceNumeric: 2950,
    coverage: [
      "Bridal Preparation",
      "Coverage of ceremony & exclusives"
    ],
    includes: [
      "Full video, 3 minute trailer",
      "1 Videographer",
      "Event activity capture"
    ],
    highlights: ["Great Value"]
  },
  {
    name: "One Day Diamond",
    type: "videography",
    duration: "one-day",
    tier: "diamond",
    price: "GH₵ 3,500",
    priceNumeric: 3500,
    coverage: [
      "Bridal Preparation",
      "Coverage of ceremony & exclusives"
    ],
    includes: [
      "Full video, 3 minute trailer",
      "2 Videographers",
      "Event activity capture (Only)"
    ],
    highlights: ["Most Popular"]
  },
  {
    name: "Two Days Gold",
    type: "videography",
    duration: "two-days",
    tier: "gold",
    price: "GH₵ 4,750",
    priceNumeric: 4750,
    coverage: [
      "Coverage of Engagement & Wedding Ceremony",
      "Reception & Exclusives",
      "Bridal Dress Up + Groom Dressup"
    ],
    includes: [
      "Full video, 3 minute trailer",
      "2 Videographers",
      "Event activity capture (Only)"
    ]
  },
  {
    name: "Two Days Diamond",
    type: "videography",
    duration: "two-days",
    tier: "diamond",
    price: "GH₵ 5,500",
    priceNumeric: 5500,
    coverage: [
      "Coverage of Engagement & Wedding Ceremony",
      "Reception & Exclusives",
      "Bridal Dress Up + Groom Dressup"
    ],
    includes: [
      "Full video, 3 minute trailer",
      "2 Videographers",
      "Event activity capture (Only)"
    ],
    highlights: ["Premium Package"]
  }
];

export const extras: Extra[] = [
  {
    category: "Pre-wedding & Print Products",
    items: [
      { name: "Pre-wedding (Extra Outfit)", price: "GH₵ 700", priceNumeric: 700 },
      { name: "Photobook A4", price: "GH₵ 300", priceNumeric: 300 },
      { name: "Photobook A3", price: "GH₵ 550", priceNumeric: 550 },
      { name: "Framing", price: "GH₵ 550", priceNumeric: 550, description: "Various sizes available" }
    ]
  },
  {
    category: "Frame Sizes",
    items: [
      { name: "12 x 16", price: "GH₵ 150", priceNumeric: 150 },
      { name: "16 x 20", price: "GH₵ 250", priceNumeric: 250 },
      { name: "20 x 24", price: "GH₵ 500", priceNumeric: 500 },
      { name: "20 x 30", price: "GH₵ 350", priceNumeric: 350 },
      { name: "24 x 36", price: "GH₵ 500", priceNumeric: 500 }
    ]
  },
  {
    category: "Additional Photography Services",
    items: [
      { name: "Additional Photographer", price: "GH₵ 700", priceNumeric: 700 },
      { name: "Bachelor Party", price: "GH₵ 600", priceNumeric: 600 },
      { name: "3 hours overtime", price: "GH₵ 300", priceNumeric: 300 },
      { name: "Retouching (per photo)", price: "GH₵ 50", priceNumeric: 50 }
    ]
  },
  {
    category: "Additional Videography Services",
    items: [
      { name: "Pre-wedding video", price: "GH₵ 1,000", priceNumeric: 1000 },
      { name: "Drone Coverage", price: "GH₵ 1,350", priceNumeric: 1350 },
      { name: "Pre-day overtime", price: "GH₵ 300", priceNumeric: 300 },
      { name: "Groom Dress up", price: "GH₵ 500", priceNumeric: 500 }
    ]
  },
  {
    category: "Other Events",
    items: [
      { name: "Birthday / Anniversary", price: "GH₵ 2,500", priceNumeric: 2500, description: "Event activity capture only" },
      { name: "Festives", price: "GH₵ 3,500", priceNumeric: 3500, description: "Event activity capture only" },
      { name: "Naming Ceremony", price: "GH₵ 2,000", priceNumeric: 2000, description: "Event activity capture only" },
      { name: "Corporate Shoot", price: "GH₵ 2,200", priceNumeric: 2200, description: "Event activity capture only" },
      { name: "Event Trailer (Only)", price: "GH₵ 1,200", priceNumeric: 1200 },
      { name: "Event Trailer and Full Video", price: "GH₵ 2,200", priceNumeric: 2200 }
    ]
  }
];

// Combined packages for easy access
export const allPackages = [...photographyPackages, ...videographyPackages];

// Helper functions
export const getPackagesByType = (type: 'photography' | 'videography') => {
  return allPackages.filter(pkg => pkg.type === type);
};

export const getPackagesByDuration = (duration: 'one-day' | 'two-days') => {
  return allPackages.filter(pkg => pkg.duration === duration);
};

export const getPackageByName = (name: string, type: 'photography' | 'videography') => {
  return allPackages.find(pkg => pkg.name === name && pkg.type === type);
};
