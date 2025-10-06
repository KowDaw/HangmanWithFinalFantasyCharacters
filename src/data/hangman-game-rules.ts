const hangmanGameRules: string = `
HANGMAN — RULES

Objective:
Guess the hidden word one letter at a time before the hangman is fully drawn.

How to play:
- A secret word is shown as underscores (_), one per letter.
- Guess a single letter (A-Z) each turn. Guesses are case-insensitive.
- Correct guesses reveal all occurrences of that letter.
- Incorrect guesses advance the hangman drawing by one stage.
- (Optional) Guess the whole word — correct = win, incorrect = counts as a wrong guess.

Win / Lose:
- Win: Reveal the entire word before reaching the last hangman stage.
- Lose: Reach the maximum number of wrong guesses before the word is revealed.

Input rules:
- Only accept single alphabetic characters for letter guesses.
- Ignore leading/trailing whitespace, convert input to lowercase.
- Inform the player if a letter was already guessed.

Display:
- Show the hangman ASCII art, current word with underscores, guessed letters, and remaining wrong guesses.

Example:
Word: _ _ _ _ _
Guessed: A, E
Wrong guesses left: 5
Enter a letter: a
Good — "a" is in the word!
Word: A _ _ _ _

Good luck!
`;

export { hangmanGameRules };