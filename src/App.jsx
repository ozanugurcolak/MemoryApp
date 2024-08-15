import { useEffect, useState } from "react"
import Card from "./components/Card"

function App() {

  const defaultCards = [
    { path: "/img/apple.png", matched: false },
    { path: "/img/banana.png", matched: false },
    { path: "/img/çilek.png", matched: false },
    { path: "/img/grape.png", matched: false },
    { path: "/img/pineapple.png", matched: false },
    { path: "/img/watermelon.png", matched: false }
  ]

  const [cards, setCards] = useState([])
  const [selectedOne, setSelectedOne] = useState(null)
  const [selectedTwo, setSelectedTwo] = useState(null)
  const [disabled, setDisabled] = useState(false)
  
  const [time, setTime] = useState(0)
  const [bestTime, setBestTime] = useState(() => {
    const savedBestTime = localStorage.getItem('bestTime')
    return savedBestTime ? parseInt(savedBestTime) : null
  })
  const [timerActive, setTimerActive] = useState(false)

  const prepareCards = () => {
    const sortedCards = [...defaultCards, ...defaultCards].sort(() => 0.5 - Math.random())
      .map((card) => ({ ...card, id: Math.random() }))

    setCards(sortedCards)
    resetState()
  }

  const startGame = () => {
    setTime(0)
    setTimerActive(true)
    prepareCards() // Oyun başlatıldığında kartları karıştır
  }

  const handleSelected = (card) => {
    if (disabled) return true
    selectedOne ? setSelectedTwo(card) : setSelectedOne(card)
  }

  useEffect(() => {
    prepareCards() // Sayfa yüklendiğinde kartları göster
  }, [])

  useEffect(() => {
    if (selectedOne && selectedTwo) {
      setDisabled(true)

      if (selectedOne.path === selectedTwo.path) {
        setCards(prev => {
          return prev.map(card => {
            if (card.path === selectedOne.path) {
              return { ...card, matched: true }
            } else {
              return card
            }
          })
        })
        resetState()
      } else {
        setTimeout(() => {
          resetState()
        }, 1000)
      }
    }
  }, [selectedOne, selectedTwo])

  useEffect(() => {
    if (timerActive) {
      const interval = setInterval(() => {
        setTime(prevTime => prevTime + 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [timerActive])

  useEffect(() => {
    if (cards.length && cards.every(card => card.matched)) {
      setTimerActive(false)
      if (!bestTime || time < bestTime) {
        setBestTime(time)
        localStorage.setItem('bestTime', time)
      }
    }
  }, [cards, time, bestTime])

  const resetState = () => {
    setSelectedOne(null)
    setSelectedTwo(null)
    setDisabled(false)
  }

  return (
    <section className="flex flex-col items-center justify-center gap-6 mt-10">
      <h1 className="text-3xl font-semibold text-center">
        Tahmin Oyunu
      </h1>
      <button className="bg-[#6EACDA] px-3 py-2 rounded hover:-translate-y-1 transition-all" onClick={startGame}>
        Oyunu Başlat
      </button>
      <div className="text-center mt-4">
        <p>Süre: {time} saniye</p>
        {bestTime !== null && <p>En İyi Zaman: {bestTime} saniye</p>}
      </div>
      <div className="grid grid-cols-4 gap-2 mt-10">
        {cards.map((card, ind) => (
          <Card card={card} key={card.id} handleSelected={handleSelected} disabled={disabled}
            rotated={card === selectedOne || card === selectedTwo || card.matched} />
        ))}
      </div>
    </section>
  )
}

export default App
