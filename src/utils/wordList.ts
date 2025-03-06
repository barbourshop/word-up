
// A list of 5-letter words for our Wordle game
export const WORDS = [
  "APPLE", "ALERT", "BEACH", "BREAD", "CHALK", "CLOUD", "DANCE", "DREAM", 
  "EARTH", "EARLY", "FIRST", "FLAME", "GHOST", "GRAPE", "HOUSE", "HEART", 
  "IMAGE", "INPUT", "JUICE", "JOKER", "KNIFE", "KNOCK", "LIGHT", "LEMON", 
  "MAGIC", "MONEY", "NIGHT", "NORTH", "OCEAN", "OLIVE", "PAPER", "PLANT", 
  "QUEEN", "QUIET", "RIVER", "RADIO", "STONE", "SMILE", "TABLE", "TIGER", 
  "UNCLE", "UNDER", "VIDEO", "VOICE", "WATER", "WORLD", "XEROX", "YOUTH", 
  "ZEBRA", "ZESTY"
];

// Get a random word from the list
export const getRandomWord = (): string => {
  const randomIndex = Math.floor(Math.random() * WORDS.length);
  return WORDS[randomIndex];
};

// Get a daily word based on the current date
export const getDailyWord = (): string => {
  const today = new Date();
  const dateString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  
  // Use the date to select a word (ensures same word for everyone on the same day)
  let hash = 0;
  for (let i = 0; i < dateString.length; i++) {
    hash = ((hash << 5) - hash) + dateString.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }
  
  const index = Math.abs(hash) % WORDS.length;
  return WORDS[index];
};

// Check if a word is in our list (for validating guesses)
export const isValidWord = (word: string): boolean => {
  return WORDS.includes(word.toUpperCase());
};
