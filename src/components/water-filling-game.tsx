'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'

export function WaterFillingGameComponent() {
  const [waterLevel, setWaterLevel] = useState(0)
  const [isFilling, setIsFilling] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)

  const maxLevel = 95 // Maximum safe water level
  const fillRate = 2 // How fast the water fills

  const startFilling = useCallback(() => {
    if (!gameOver) {
      setIsFilling(true)
    }
  }, [gameOver])

  const stopFilling = useCallback(() => {
    setIsFilling(false)
    if (!gameOver && waterLevel <= maxLevel) {
      setScore((prevScore) => prevScore + Math.floor(waterLevel))
    }
  }, [gameOver, waterLevel, maxLevel])

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isFilling && !gameOver) {
      interval = setInterval(() => {
        setWaterLevel((prevLevel) => {
          const newLevel = prevLevel + fillRate
          if (newLevel > 100) {
            setGameOver(true)
            setIsFilling(false)
            return 100
          }
          return newLevel
        })
      }, 100)
    }

    return () => clearInterval(interval)
  }, [isFilling, gameOver])

  const handleReset = () => {
    setWaterLevel(0)
    setIsFilling(false)
    setGameOver(false)
    setScore(0)
  }

  return (
    <div className="flex w-full flex-col items-center justify-center bg-red-50 p-4">
      <h1 className="mb-4 text-3xl font-bold">Water Filling Game</h1>
      <div className="relative mb-4 h-full">
        <svg viewBox="0 0 100 200" className="h-full w-full">
          {/* Bottle outline */}
          <path
            d="M20 40 Q20 20 30 10 L70 10 Q80 20 80 40 L80 180 Q80 190 70 195 L30 195 Q20 190 20 180 Z"
            fill="none"
            stroke="#2563eb"
            strokeWidth="4"
          />
          {/* Bottle neck */}
          <path
            d="M35 10 L65 10 Q70 15 70 25 L70 40 L30 40 L30 25 Q30 15 35 10"
            fill="#bfdbfe"
            stroke="#2563eb"
            strokeWidth="2"
          />
          {/* Water */}
          <path
            d={`M22 ${195 - waterLevel * 1.55} Q22 ${190 - waterLevel * 1.55} 30 ${188 - waterLevel * 1.55} L70 ${188 - waterLevel * 1.55} Q78 ${190 - waterLevel * 1.55} 78 ${195 - waterLevel * 1.55} L78 193 Q78 198 70 198 L30 198 Q22 198 22 193 Z`}
            fill="#3b82f6"
            className={`transition-all duration-100 ease-linear ${gameOver ? 'animate-overflow' : ''}`}
          />
          {/* Max fill line */}
          <line
            x1="22"
            y1="47"
            x2="78"
            y2="47"
            stroke="#ef4444"
            strokeWidth="2"
          />
        </svg>
      </div>
      <div className="mb-2 text-xl font-semibold">
        Water Level: {Math.min(Math.floor(waterLevel), 100)}%
      </div>
      <div className="mb-4 text-xl font-semibold">Score: {score}</div>
      <Button
        onMouseDown={startFilling}
        onMouseUp={stopFilling}
        onMouseLeave={stopFilling}
        onTouchStart={startFilling}
        onTouchEnd={stopFilling}
        disabled={gameOver}
        className="mb-2"
      >
        Fill Bottle
      </Button>
      <Button onClick={handleReset} variant="outline">
        Reset Game
      </Button>
      {gameOver && (
        <div className="mt-4 text-2xl font-bold text-red-500">
          Game Over! You overfilled the bottle!
        </div>
      )}
      <div className="mt-4 text-center text-sm text-gray-600">
        Hold the button to fill the bottle. Release to stop.
        <br />
        Try to fill as much as possible without going over the red line!
      </div>
    </div>
  )
}
