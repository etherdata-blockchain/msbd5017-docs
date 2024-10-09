'use client'

import React, { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { useSolidity } from '@/context/solidityContext'
import { deployContract } from '@/context/solidityContext.utils'
import { hexToBytes } from '@ethereumjs/util'

export default function WaterFillingGameComponent() {
  const [waterLevel, setWaterLevel] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const { compilerOutput, account, vm, isCompiling } = useSolidity()

  const maxLevel = 95 // Maximum safe water level

  const startFilling = useCallback(async () => {
    if (gameOver) return
    if (isCompiling) return
    if (!account || !vm || !compilerOutput) return

    // deploy the contract
    const contract = compilerOutput.contracts['contract.sol']['FillBotGame']
    const deploymentBytecode = contract.evm.bytecode.object

    const contractAddress = await deployContract(
      vm,
      hexToBytes(account.privateKey),
      deploymentBytecode,
    )

    console.log('contractAddress', contractAddress)

    const fillInterval = setInterval(() => {
      console.log('filling')
      const newWaterLevel = 100
      setWaterLevel(newWaterLevel)

      if (newWaterLevel > 100) {
        clearInterval(fillInterval)
        setGameOver(true)
        setScore(0)
      }
    }, 32)

    const stopFilling = () => {
      clearInterval(fillInterval)
      setGameOver(true)
      if (waterLevel <= maxLevel) {
        setScore(Math.floor(waterLevel))
      } else {
        setScore(0)
      }
    }

    document.addEventListener('mouseup', stopFilling, { once: true })
    document.addEventListener('touchend', stopFilling, { once: true })

    return () => {
      document.removeEventListener('mouseup', stopFilling)
      document.removeEventListener('touchend', stopFilling)
    }
  }, [gameOver, waterLevel, maxLevel, isCompiling, compilerOutput, account, vm])

  const handleReset = () => {
    setWaterLevel(0)
    setGameOver(false)
    setScore(0)
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center rounded-xl border p-4">
      <h1 className="mb-4 text-3xl font-bold">Water Filling Game</h1>
      <div className="relative mb-4 h-64 w-32">
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
            className={`transition-all duration-100 ease-linear ${waterLevel > 100 ? 'animate-overflow' : ''}`}
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
        onTouchStart={startFilling}
        disabled={gameOver || isCompiling || compilerOutput === null}
        className="mb-2"
      >
        {gameOver ? 'Game Over' : 'Hold to Fill'}
      </Button>
      <Button onClick={handleReset} variant="outline">
        Reset Game
      </Button>
      {gameOver && waterLevel > maxLevel && (
        <div className="mt-4 text-2xl font-bold text-red-500">
          You overfilled the bottle!
        </div>
      )}
      {gameOver && waterLevel <= maxLevel && (
        <div className="mt-4 text-2xl font-bold text-green-500">
          Great job! You filled it to {Math.floor(waterLevel)}%
        </div>
      )}
      <div className="mt-4 text-center text-sm text-gray-600">
        Hold the button to fill the bottle. Release to end the game.
        <br />
        Try to fill as much as possible without going over the red line!
      </div>
    </div>
  )
}
