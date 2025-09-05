export const DATASET_TAGS = [
  // Business & Economics
  "Business",
  "Economics", 
  "Finance",
  "Marketing",
  "Real Estate",
  "Retail",
  "Supply Chain",
  
  // Science & Technology
  "Computer Science",
  "Data Science",
  "Machine Learning",
  "Artificial Intelligence",
  "Deep Learning",
  "Natural Language Processing",
  "Computer Vision",
  "Cybersecurity",
  "Software Engineering",
  "Bioinformatics",
  "Physics",
  "Chemistry",
  "Biology",
  "Mathematics",
  "Statistics",
  
  // Health & Medicine
  "Healthcare",
  "Medicine",
  "Mental Health",
  "Public Health",
  "Nutrition",
  "Fitness",
  "Pharmaceuticals",
  
  // Social Sciences
  "Psychology",
  "Sociology",
  "Education",
  "Politics",
  "Law",
  "History",
  "Demographics",
  "Survey Data",
  
  // Entertainment & Media
  "Movies",
  "Television",
  "Music",
  "Games",
  "Books",
  "Art",
  "Photography",
  "Social Media",
  
  // Environment & Climate
  "Climate",
  "Environment",
  "Weather",
  "Energy",
  "Sustainability",
  "Agriculture",
  "Geology",
  
  // Transportation & Geography
  "Transportation",
  "Geography",
  "Maps",
  "Travel",
  "Urban Planning",
  
  // Sports & Recreation
  "Sports",
  "Recreation",
  "Fitness Tracking",
  
  // Government & Public Data
  "Government",
  "Census",
  "Crime",
  "Elections",
  "Public Policy",
  
  // Internet & Technology
  "Internet",
  "Web Scraping",
  "APIs",
  "Mobile Apps",
  "E-commerce",
  
  // Miscellaneous
  "News",
  "Text Mining",
  "Image Processing",
  "Time Series",
  "Geospatial",
  "Sensor Data",
  "IoT",
  "Crowdsourcing"
] as const;

export type DatasetTag = typeof DATASET_TAGS[number];

// Category groupings for better organization
export const TAG_CATEGORIES = {
  "Business & Economics": [
    "Business", "Economics", "Finance", "Marketing", "Real Estate", "Retail", "Supply Chain"
  ],
  "Science & Technology": [
    "Computer Science", "Data Science", "Machine Learning", "Artificial Intelligence",
    "Deep Learning", "Natural Language Processing", "Computer Vision", "Cybersecurity",
    "Software Engineering", "Bioinformatics", "Physics", "Chemistry", "Biology",
    "Mathematics", "Statistics"
  ],
  "Health & Medicine": [
    "Healthcare", "Medicine", "Mental Health", "Public Health", "Nutrition",
    "Fitness", "Pharmaceuticals"
  ],
  "Social Sciences": [
    "Psychology", "Sociology", "Education", "Politics", "Law", "History",
    "Demographics", "Survey Data"
  ],
  "Entertainment & Media": [
    "Movies", "Television", "Music", "Games", "Books", "Art", "Photography", "Social Media"
  ],
  "Environment & Climate": [
    "Climate", "Environment", "Weather", "Energy", "Sustainability", "Agriculture", "Geology"
  ],
  "Other": [
    "Transportation", "Geography", "Maps", "Travel", "Urban Planning", "Sports",
    "Recreation", "Fitness Tracking", "Government", "Census", "Crime", "Elections",
    "Public Policy", "Internet", "Web Scraping", "APIs", "Mobile Apps", "E-commerce",
    "News", "Text Mining", "Image Processing", "Time Series", "Geospatial",
    "Sensor Data", "IoT", "Crowdsourcing"
  ]
} as const;