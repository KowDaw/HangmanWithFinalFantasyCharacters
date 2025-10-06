import { finalFantasyGames } from "./data/final-fantasy-games.js";
import { InputTypes } from "./data/enums.js";
import { FinalFantasy } from "./data/types.js";
import { hangmanDraws } from "./data/hangman-draws.js";
import { hangmanGameRules } from "./data/hangman-game-rules.js";
import readlineSync from "readline-sync";

// Global Variables

const alphabet: string[] = "abcdefghijklmnopqrstuvwxyz".split("");
const menuOptions: string[] = [
    "1 - Rules",
    "2 - Play",
    "3 - Quit"
];

// Functions

const generateRandomNumber = (number: number): number => {
    return Math.floor(Math.random() * number);
}

const clearConsole = (): void => {
    console.clear();
}

const displayMessage = (message: string): void => {
    console.log(message);
}

const getInputFromUser = (message: string, inputType?: InputTypes): string => {
    let input: string = readlineSync.question(message);

    while (!validateInput(input, inputType)) {
        input = readlineSync.question("Invalid input! Try again:\n");
    }

    return input;
}

const validateInput = (input: string, inputType?: InputTypes): boolean => {
    switch (inputType) {
        case InputTypes.YesOrNo:
            return input.toUpperCase() === "Y" || input.toUpperCase() === "N";
        case InputTypes.Letter:
            return input.length === 1 && alphabet.includes(input.toLowerCase());
        case InputTypes.MenuOption:
            const parsedInput: number = parseInt(input);
            return !isNaN(parsedInput) && parsedInput > 0 && parsedInput < menuOptions.length + 1;
        default:
            return true;
    }
}

const pickRandomWord = (finalFantasyGames: FinalFantasy[]): string => {
    let randomIndex: number = generateRandomNumber(finalFantasyGames.length);
    const randomFinalFantasy: FinalFantasy = finalFantasyGames[randomIndex];
    randomIndex = generateRandomNumber(randomFinalFantasy.characters.length);

    return randomFinalFantasy.characters[randomIndex];
}

const convertLettersToUnderscores = (word: string): string => {
    let wordWithUnderscores: string = "";

    for (let letter of word) {
        if (letter === " ") {
            wordWithUnderscores += " ";
        } else {
            wordWithUnderscores += "_ ";
        }
    }

    return wordWithUnderscores;
}

const showGameHud = (hangmanDraw: string, wordWithUnderscores: string, numberOfChances: number, alreadyGuessedLetters: string[]): void => {
    clearConsole();
    displayMessage(hangmanDraw);
    displayMessage(wordWithUnderscores + "\n");
    displayMessage("Already guessed letters: " + alreadyGuessedLetters.join(", "));
    displayMessage("Number of chances: " + numberOfChances.toString());
}

const showRules = (): void => {
    clearConsole();
    displayMessage(hangmanGameRules);
    getInputFromUser("Press any key to go back to the main menu.\n");
    runApp();
}

const showMenuOptions = (menuOptions: string[]): void => {
    menuOptions.forEach(option => {
        displayMessage(option);
    })
}

const showEndMessageOfTheGame = (endMessage: string, characterName: string, finalFantasyGames: FinalFantasy[]): void => {
    let fianlFantasy: FinalFantasy = finalFantasyGames[0];
    
    for (let currentFinalFantasy of finalFantasyGames) {
        if (currentFinalFantasy.characters.includes(characterName)) {
            fianlFantasy = currentFinalFantasy
        }
    }

    displayMessage(endMessage);
    displayMessage(`${characterName} is from ${fianlFantasy.title}, which was released in ${fianlFantasy.year}.`);
}

const playGame = (): void => {
    clearConsole();
    getInputFromUser("Let's play! Press Enter!\n");

    let indexOfHangmanDraws: number = 0;
    let numberOfChances: number = 6;
    let word: string = pickRandomWord(finalFantasyGames);
    let wordWithUnderscores: string = convertLettersToUnderscores(word);
    let wordArrayWithUnderscores = wordWithUnderscores.split(" ");
    let endMessage: string = "\nCongratulations!\nThe name was: " + word;
    let alreadyGuessedLetters: string[] = [];

    while (wordWithUnderscores.includes("_")) {
        showGameHud(hangmanDraws[indexOfHangmanDraws], wordWithUnderscores, numberOfChances, alreadyGuessedLetters);

        let guess: string = getInputFromUser("Type a letter:\n");
        let isGuessValid: boolean = validateInput(guess, InputTypes.Letter);
        let invalidGuessMessage: string = "Only one letter is acceptable! Try again! Type a letter:\n";

        while (!isGuessValid || alreadyGuessedLetters.includes(guess.toUpperCase())) {
            if (alreadyGuessedLetters.includes(guess.toUpperCase())) {
                invalidGuessMessage = "This letter was already! Try again! Type a letter:\n";
            }

            guess = getInputFromUser(invalidGuessMessage);
            isGuessValid = validateInput(guess, InputTypes.Letter);
        }

        alreadyGuessedLetters.push(guess.toUpperCase());

        if (word.includes(guess.toLowerCase()) || word.includes(guess.toUpperCase())) {
            for (let i = 0; i < word.length; i++) {
                if (word[i].toLowerCase() === guess || word[i].toUpperCase() === guess) {
                    wordArrayWithUnderscores[i] = word[i];
                    wordWithUnderscores = wordArrayWithUnderscores.join(" ");
                }
            }
        } else {
            indexOfHangmanDraws++;
            numberOfChances--;
        }

        if (numberOfChances === 0) {
            endMessage = "\nGame over!\nThe name was: " + word;
            break;
        }
    }

    showGameHud(hangmanDraws[indexOfHangmanDraws], wordWithUnderscores, numberOfChances, alreadyGuessedLetters);
    showEndMessageOfTheGame(endMessage, word, finalFantasyGames);

    let input: string = getInputFromUser("\nWould you like to play one more time?\n['Y' / 'N']\n");
    let isInputValid: boolean = validateInput(input, InputTypes.YesOrNo);

    while (!isInputValid) {
        input = getInputFromUser("Invalid input! Try again!");
        isInputValid = validateInput(input, InputTypes.YesOrNo);
    }

    if (input.toUpperCase() === "Y") {
        playGame();
    } else {
        runApp();
    }
}

const quitGame = (): void => {
    clearConsole();
    displayMessage("Bye-bye!");
}

// App

const runApp = (): void => {
    clearConsole();
    displayMessage("Welcome to Final Fantasy Hangman Game!\n\nChoose an option:");
    showMenuOptions(menuOptions);
    const choosenMenuOption: string = getInputFromUser("", InputTypes.MenuOption);

    switch (choosenMenuOption) {
        case "1":
            showRules()
            break;
        case "2":
            playGame();
            break;
        case "3":
            quitGame();
            break;
    }
}

runApp();