// CSS
import "./App.css";

//React
import { useCallback, useEffect, useState } from "react";

//data
import { wordsList } from "./data/words";

//components
import StartScreen from "./components/StartScreen";
import Game from "./components/Game";
import GameOver from "./components/GameOver";

const stages = [
  { id: 1, name: "start" },
  { id: 2, name: "game" },
  { id: 3, name: "end" },
];

const guessesQtd = 5;

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);

  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(guessesQtd);
  const [score, setScore] = useState(0);

  const pickWordAndCategory = useCallback(() => {
    const categories = Object.keys(words);
    const category =
      categories[Math.floor(Math.random() * Object.keys(categories).length)];

    // console.log(category);

    const word =
      words[category][Math.floor(Math.random() * words[category].length)];
    // console.log(word);

    return { word, category };
  },[words]);

  //Iniciar
  const startGame = useCallback(() => {
    clearLetterStates();

    const { word, category } = pickWordAndCategory();
    let wordLetters = word.split("");

    wordLetters = wordLetters.map((l) => l.toLowerCase());

    // console.log(word, category);
    // console.log(wordLetters);

    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters);

    setGameStage(stages[1].name);
  },[pickWordAndCategory]);
  //processar letras
  const verifyLetter = (letter) => {

    const normalizedLetter = letter.toLowerCase();

    //checar as letras ja ultilizadas
    if(guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)){
      // alert("A letra já Utilizada")
      return;
    }

    if(letters.includes(normalizedLetter)){ 
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter,
      ])
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter,
      ])
    } else{
      
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter,
      ])
      setGuesses((actualGueses) => actualGueses -1);

    }
  
  };

  const clearLetterStates = () =>{
    setGuessedLetters([]);
    setWrongLetters([]);
  }

  useEffect(() => {
    if(guesses <= 0 ){
      //resetar o letras
      clearLetterStates()

    setGameStage(stages[2].name);
  }
  }, [guesses])

  useEffect(()=>{
    const uniqueLetters = [...new Set(letters)];

    if(guessedLetters.length === uniqueLetters.length && gameStage === "game"){
      setScore((actualScore) =>( actualScore += 100));

      startGame();
    }
   

  },[guessedLetters, letters, startGame, gameStage])



  //restart
  const retry = () => {

    setScore(0);
    setGuesses(guessesQtd);
    setGameStage(stages[0].name);
  };

  return (
    <div className="App efeito_vidro">
      {gameStage === "start" && <StartScreen startGame={startGame} />}
      {gameStage === "game" && (
        <Game
          verifyLetter={verifyLetter}
          pickedWord={pickedWord}
          pickedCategory={pickedCategory}
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
        />
      )}
      {gameStage === "end" && <GameOver retry={retry} score={score}/>}
    </div>
  );
}

export default App;
