import {useState} from "react"
import { languages } from "./languages"
import { clsx } from "clsx"
import { getFarewellText, getRandomWord } from "./utils"
import Confetti from "react-confetti"

export default function AssemblyEndgame(){

  const [currentWorld, setCurrentWorld] = useState(getRandomWord())
  const [guessedLetters, setGuessedLetters] = useState([])

  const numGuessesLeft = languages.length - 1
  const wrongGuessCount = guessedLetters.filter(letter => !currentWorld.includes(letter)).length
  const isGameWon = currentWorld.split("").every(letter => guessedLetters.includes(letter))
  const isGameLost = wrongGuessCount >= numGuessesLeft
  const isGameOver = isGameWon || isGameLost
  const lastGuessedLetter = guessedLetters[guessedLetters.length -1]
  const isLastGuessIncorrect = lastGuessedLetter && !currentWorld.includes(lastGuessedLetter)


  console.log(isGameWon)
  
  const alphabet = "abcdefghijklmnopqrstuvwxyz"

  function addGuessedLetter(letter){
    setGuessedLetters(prevLetters => 
      prevLetters.includes(letter) ?
      prevLetters :
      [...prevLetters, letter]      
    )
  }

  function startNewGame(){
    setCurrentWorld(getRandomWord())
    setGuessedLetters([])
  }

  const languageElements = languages.map((lang, index) => {
    const isLanguageLost = index < wrongGuessCount
    const styles = {
      backgroundColor: lang.backgroundColor,
      color:lang.color
    }
    const className = clsx("chip", isLanguageLost && "lost")
    return (
      <span 
      className={className}
      style={styles}
      key={lang.name}
      >
      {lang.name}
      </span>
    )
  }) 

   const letterElements = currentWorld.split("").map((letter, index) => {
    const shouldRevealLetter = isGameLost || guessedLetters.includes(letter)
    const letterClassName = clsx(
      isGameLost && !guessedLetters.includes(letter) && "missed-letter"
    )
    return(
    <span key={index} className={letterClassName}> 
    {shouldRevealLetter ? letter.toUpperCase() : ""}
    </span>
    )
   })

   const keyboardElements = alphabet.split("").map(letter => {
    const isGuessed = guessedLetters.includes(letter)
    const isCorrect = isGuessed && currentWorld.includes(letter)
    const isWrong = isGuessed && !currentWorld.includes(letter)
    const className = clsx({
      correct: isCorrect,
      wrong: isWrong
    })
   

    return (
    <button
    className={className} 
    key={letter}
    disabled={isGameOver}
    onClick={() => addGuessedLetter(letter)}
    >
      {letter.toUpperCase()}
    </button>
    )
    })


    const gameStatusClass = clsx("game-status",{
      won: isGameWon,
      lost: isGameLost,
      farewell: !isGameOver && isLastGuessIncorrect
})

function renderGameStatus(){
  if(!isGameOver && isLastGuessIncorrect){
    return (
    <p className="farewell-message">
      {getFarewellText(languages[wrongGuessCount - 1].name)}
      </p>)
  }

  if(isGameWon){
    return (
      <>
       <h2>You win!</h2>
              <p>Well done!🎉</p>
      </>
    )
  }
  if(isGameLost){
    return(
      <>
      <h2> Game Over! </h2>
      <p>You lose! Better start learning Assembly 😭</p>
      </>
    )
  }
}

   

  return(


    <main>
      {
        isGameWon && 
        <Confetti
        recycle={false}
        numberOfPieces={1000}
        />
      }
      <header>
        <h1> Assembly: Endgame </h1>
        <p>Guess the word within 8 attempts to keep the 
          programming world safe from Assembly!
        </p>
      </header>

           <section
                aria-live="polite"
                role="status"
                className={gameStatusClass}
            >
        {renderGameStatus()}

        
      </section>

      <section className="language-chips">
        {languageElements}
      </section>

      <section className="word">
        {letterElements}
      </section>

      <section className="sr-only" 
      aria-live="polite" 
      role="status">

        <p>
          {currentWorld.includes(lastGuessedLetter)?
          `Correct! The letter ${lastGuessedLetter} is in the word`:
          `Sorry, the letter ${lastGuessedLetter} is not in the word.`
          }
          You have {numGuessesLeft} attempts left.
        </p>
        <p>Current World: {currentWorld.split("").map(letter =>
          guessedLetters.includes(letter) ? letter + "." : "blank.")
          .join(" ")}</p>
      </section>

      <section className="keyboard">
        {keyboardElements}
      </section>

    
        {isGameOver && 
        <button 
        className="new-game" 
        onClick={startNewGame}>
          New Game</button>}
   
    </main>
  )
}