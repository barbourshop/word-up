# Word Up

A modern, open-source Wordle clone built with a focus on clean design, accessibility, and no limits on number of guesses

## Features
- Classic Wordle gameplay: guess the 5-letter word in 6 attempts
- Responsive and mobile-friendly UI
- Keyboard and mouse input support
- Visual feedback for correct, present, and absent letters
- Daily challenge mode (optional)
- Clean, accessible design
- Fast and lightweight

## Technologies Used
- React (with Vite)
- TypeScript
- Tailwind CSS
- Cypress & Playwright for testing

## Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the app locally:
   ```bash
   npm run dev
   ```
3. Build for production:
   ```bash
   npm run build
   ```

## How to Play
- Enter a valid 5-letter word and press Enter.
- The color of the tiles will change to show how close your guess was to the word.
  - Green: Correct letter, correct spot
  - Yellow: Correct letter, wrong spot
  - Gray: Letter not in the word
- You have 6 tries to guess the word!

## Contributing
Contributions are welcome! To contribute:
1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Push to your fork and submit a pull request

## License
This project is open source and available under the MIT License.
