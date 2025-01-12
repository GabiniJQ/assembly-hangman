import { languages } from '../languages'
import { useState, useRef, useEffect } from 'react'
import clsx from 'clsx'
import { getFarewellText, getRandomWord } from '../utils'
import Confetti from 'react-confetti'

export default function App() {
  // Create State values
  const [currentWord, setCurrentWord] = useState(() => getRandomWord())
  const [guesses, setGuesses] = useState([])

  // Derived values
  const wrongGuessCount = guesses.filter(
    (guess) => !currentWord.includes(guess)
  ).length
  const isGameWon = currentWord
    .split('')
    .every((letter) => guesses.includes(letter))
  const isGameLost = wrongGuessCount >= languages.length - 1
  const isGameOver = isGameWon || isGameLost
  const lastGuess = guesses[guesses.length - 1]
  const isLastGuessWrong = lastGuess && !currentWord.includes(lastGuess)
  const missingLetters = () =>
    currentWord
      .split('')
      .map((letter) => (!guesses.includes(letter) ? letter : null))
      .filter((item) => item !== null)
  const attemptsLeft = languages.length - 1 - wrongGuessCount

  // Static values
  const alphabet = 'abcdefghijklmnopqrstuvwyxz'
  const newGameRef = useRef(null)

  // Display languages from imported array
  const displayLanguages = languages.map((language, index) => {
    const styles = {
      backgroundColor: language.backgroundColor,
      color: language.color,
    }
    return (
      <span
        key={language.name}
        style={styles}
        className={clsx('p-1 rounded-md m-[1px] font-bold relative', {
          // Add ::before classes when wrong guesses goes up
          ['before:content-["💀"] before:absolute before:flex before:items-center before:justify-center before:h-full before:w-full before:text-sm before:top-0 before:left-0 before:bg-black/50 before:rounded-md line-through']:
            index < wrongGuessCount,
        })}
      >
        {language.name}
      </span>
    )
  })

  // Convert word to array of letters

  const displayLetters = currentWord.split('').map((letter, index) => {
    const isGuessed = guesses.includes(letter)
    const isRight = isGuessed && currentWord.includes(letter)
    const isMissing = missingLetters().includes(letter)
    function generateLetters() {
      if (isGameLost) {
        if (isMissing || isRight) {
          return letter.toUpperCase()
        }
      } else {
        if (isRight) {
          return letter.toUpperCase()
        }
      }
    }

    return (
      <span
        key={index}
        className={clsx(
          'bg-[#323232] w-12 h-12 border-b-[1px] border-white font-semibold text-2xl flex justify-center items-center',
          {
            ['text-[#EC5D49]']: isMissing,
          }
        )}
      >
        {generateLetters()}
      </span>
    )
  })

  function handleGuess(letterGuess) {
    // Insert guess if is different from previous guesses
    !isGameOver &&
      setGuesses((prevGuesses) =>
        prevGuesses.includes(letterGuess)
          ? prevGuesses
          : [...prevGuesses, letterGuess]
      )
  }

  // Display keyboard with specific grid
  const displayKeyboard = alphabet.split('').map((letter, index) => {
    const isGuessed = guesses.includes(letter)
    const isRight = isGuessed && currentWord.includes(letter)
    const isWrong = isGuessed && !currentWord.includes(letter)

    const lastButtons = {
      20: 'col-start-3',
      21: 'col-start-4',
      22: 'col-start-5',
      23: 'col-start-6',
      24: 'col-start-7',
      25: 'col-start-8',
    }

    return (
      <button
        key={letter}
        className={clsx(
          'text-black border rounded border-white font-bold h-12 w-12',
          {
            [lastButtons[index]]: index >= 20,
            ['bg-[#FCBA29] transition']: !isGuessed,
            ['bg-[#10A95B] transition']: isRight,
            ['bg-[#EC5D49] transition']: isWrong,
            ['opacity-30 transiton-none']: isGameOver,
          }
        )}
        aria-disabled={guesses.includes(letter)}
        aria-label={`Letter ${letter}`}
        onClick={() => handleGuess(letter)}
      >
        {letter.toUpperCase()}
      </button>
    )
  })

  // Generate status messages conditionally
  function generateStatus() {
    if (!isGameOver && isLastGuessWrong) {
      return (
        <>
          <p className='text-xl italic font-normal'>
            {getFarewellText(languages[wrongGuessCount - 1].name)}
          </p>
          <p className='text-lg italic font-normal text-purple-900'>
            You have <em className='text-purple-200'>{attemptsLeft}</em> attempt
            {attemptsLeft > 1 ? 's' : ''} left{attemptsLeft === 1 ? '!' : ''}
          </p>
        </>
      )
    }
    if (isGameWon) {
      return (
        <>
          <p className='text-2xl italic'>You win!</p>
          <p className='text-xl italic'>Well done! 🎉</p>
        </>
      )
    } else {
      if (isGameLost) {
        return (
          <>
            <p className='text-xl italic'>Game Over!</p>
            <p className='text-l italic'>
              You lose! Better start learning Assembly 😭
            </p>
          </>
        )
      }
    }
    return null
  }

  // Reset values for New Game
  function startNewGame() {
    setCurrentWord(getRandomWord())
    setGuesses([])
  }

  // Accessibility for New Game button focus
  useEffect(() => {
    if (isGameOver) {
      newGameRef.current?.focus()
    }
  }, [isGameOver])

  return (
    <main>
      {isGameWon && <Confetti recycle={false} numberOfPieces={1000} />}
      <header className='text-center '>
        <h1 className='text-2xl'>Assembly: Endgame</h1>
        <p className='text-[#8E8E8E] font-semibold text-base max-w-[400px] pt-1 mx-auto'>
          Guess the word in under 8 attempts to keep the programming world safe
          from Assembly!
        </p>
      </header>

      <section
        className={clsx(
          'opacity-100 rounded text-center flex flex-col my-5 items-center max-w-[400px] mx-auto h-20 justify-center ',
          {
            ['bg-[#10A95B]']: isGameWon,
            ['bg-[#BA2A2A]']: isGameLost,
            ['bg-[#7A5EA7] border border-dashed border-[#282726]']:
              !isGameOver && isLastGuessWrong,
          }
        )}
        aria-live='polite'
        role='status'
      >
        {generateStatus()}
      </section>

      <section className='flex flex-wrap justify-center  gap-[0.2px] py-2 max-w-[350px] mx-auto '>
        {displayLanguages}
      </section>

      <section className='flex justify-center gap-0.5 mt-10'>
        {displayLetters}
      </section>

      {/* Visually-hidden aria-live section for status updates */}
      <section
        className='absolute w-1 h-1 p-0 m-[-1px] hidden'
        aria-live='polite'
        role='status'
      >
        <p>
          {currentWord.includes(lastGuess)
            ? `Correct! ${lastGuess} is in the word`
            : `Sorry, ${lastGuess} is not in the word`}
          You have {attemptsLeft} attempt{attemptsLeft > 1 ? 's' : ''} left
        </p>
        <p>
          Current word:{' '}
          {currentWord
            .split('')
            .map((letter) =>
              guesses.includes(letter) ? letter + '.' : 'blank.'
            )
            .join(' ')}
        </p>
      </section>

      <section className='grid grid-cols-10 grid-rows-3 mt-20 gap-2'>
        {displayKeyboard}
      </section>

      {isGameOver && (
        <button
          className='w-56 h-10 bg-[#11B5E5]  rounded font-semibold text-black mt-10
            block mx-auto hover:bg-cyan-600 hover:text-cyan-200 hover:ring-4 hover:ring-cyan-200
          active:ring-cyan-200 transition active:-translate-y-2'
          onClick={startNewGame}
          ref={newGameRef}
        >
          New Game
        </button>
      )}
    </main>
  )
}
