import { Button } from '@/components/ui/button'
import { useSolidity } from '@/context/solidityContext'
import {
  buildTransaction,
  common,
  decodeRevertMessage,
  deployContract,
  encodeFunction,
  getAccountNonce,
} from '@/context/solidityContext.utils'
import { CompilerOutput } from '@/lib/interfaces'
import { LegacyTransaction } from '@ethereumjs/tx'
import { Address, hexToBytes } from '@ethereumjs/util'
import { VM } from '@ethereumjs/vm'
import { defaultAbiCoder as AbiCoder, Interface } from '@ethersproject/abi'
import { HDNodeWallet } from 'ethers'
import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

const MAX_VALUE = 100
const INCREMENT = 10
const ANIMATION_DURATION = 1500 // ms

function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4)
}

async function deployFGTContract(
  vm: VM,
  compilerOutput: CompilerOutput,
  privateKey: Uint8Array,
) {
  const fgtContract = compilerOutput.contracts['contract.sol']['FGT']
  const deploymentBytecode = fgtContract.evm.bytecode.object
  return await deployContract(vm, privateKey, deploymentBytecode, {
    types: [],
    values: [],
  })
}

async function deployLockContract(
  vm: VM,
  compilerOutput: CompilerOutput,
  privateKey: Uint8Array,
  fgtAddress: Address,
) {
  const lockContract = compilerOutput.contracts['contract.sol']['Lock']
  const deploymentBytecode = lockContract.evm.bytecode.object
  return await deployContract(vm, privateKey, deploymentBytecode, {
    types: ['address'],
    values: [fgtAddress.toString()],
  })
}

async function setLockContractInFGT(
  vm: VM,
  privateKey: Uint8Array,
  fgtAddress: Address,
  lockAddress: Address,
) {
  const data = encodeFunction('setLockContract', {
    types: ['address'],
    values: [lockAddress.toString()],
  })
  const txData = {
    to: fgtAddress,
    data,
    nonce: await getAccountNonce(vm, privateKey),
  }
  const tx = LegacyTransaction.fromTxData(
    buildTransaction(txData as any) as any,
    { common },
  ).sign(privateKey)
  const result = await vm.runTx({ tx })
  if (result.execResult.exceptionError) {
    const message = decodeRevertMessage(result.execResult.returnValue)
    throw new Error(message)
  }
}

async function lockAXC(vm: VM, privateKey: Uint8Array, lockAddress: Address) {
  const data = encodeFunction('lockAXC', { types: [], values: [] })
  const txData = {
    to: lockAddress,
    data,
    value: BigInt(10) * BigInt(10) ** BigInt(18), // 10 AXC in wei
    nonce: await getAccountNonce(vm, privateKey),
  }
  const tx = LegacyTransaction.fromTxData(
    buildTransaction(txData as any) as any,
    { common },
  ).sign(privateKey)
  const result = await vm.runTx({ tx })
  if (result.execResult.exceptionError) {
    const message = decodeRevertMessage(result.execResult.returnValue)
    throw new Error(message)
  }
}

async function getTotalDeposits(vm: VM, lockAddress: Address) {
  const sigHash = new Interface(['function totalDeposits()']).getSighash(
    'totalDeposits',
  )
  const result = await vm.evm.runCall({
    to: lockAddress,
    data: hexToBytes(sigHash),
  })
  if (result.execResult.exceptionError) {
    const message = decodeRevertMessage(result.execResult.returnValue)
    throw new Error(message)
  }
  return BigInt(AbiCoder.decode(['uint256'], result.execResult.returnValue)[0])
}

async function getBalance(
  vm: VM,
  fgtAddress: Address,
  accountAddress: Address,
) {
  const sigHash = new Interface(['function balanceOf(address)']).getSighash(
    'balanceOf',
  )
  const data =
    sigHash + AbiCoder.encode(['address'], [accountAddress.toString()]).slice(2)
  const result = await vm.evm.runCall({
    to: fgtAddress,
    data: hexToBytes(data),
  })
  if (result.execResult.exceptionError) {
    const message = decodeRevertMessage(result.execResult.returnValue)
    throw new Error(message)
  }
  return BigInt(AbiCoder.decode(['uint256'], result.execResult.returnValue)[0])
}

export default function DepositUi() {
  const { compilerOutput, isCompiling, vm, account } = useSolidity()
  const [value, setValue] = useState(0)
  const [displayValue, setDisplayValue] = useState(0)
  const [rewards, setRewards] = useState(0)
  const [displayRewards, setDisplayRewards] = useState(0)
  const [fillHeight, setFillHeight] = useState(0)
  const animationRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const startValueRef = useRef(0)
  const startRewardsRef = useRef(0)
  const targetValueRef = useRef(0)
  const targetRewardsRef = useRef(0)
  const [fgtAddress, setFgtAddress] = useState<Address | null>(null)
  const [lockAddress, setLockAddress] = useState<Address | null>(null)

  const deployContracts = async (
    account: HDNodeWallet,
    vm: VM,
    compilerOutput: CompilerOutput,
  ) => {
    try {
      const fgtAddr = await deployFGTContract(
        vm,
        compilerOutput,
        hexToBytes(account.privateKey),
      ).catch((error) => {
        alert(error.message)
        throw error
      })
      setFgtAddress(fgtAddr)

      const lockAddr = await deployLockContract(
        vm,
        compilerOutput,
        hexToBytes(account.privateKey),
        fgtAddr,
      ).catch((error) => {
        alert(error.message)
        throw error
      })
      setLockAddress(lockAddr)

      await setLockContractInFGT(
        vm,
        hexToBytes(account.privateKey),
        fgtAddr,
        lockAddr,
      ).catch((error) => {
        alert(error.message)
        throw error
      })

      console.log('Contracts deployed successfully')
    } catch (error) {
      console.error('Error deploying contracts:', error)
    }
  }

  useEffect(() => {
    if (!compilerOutput || !account || !vm) return

    deployContracts(account, vm, compilerOutput)
  }, [compilerOutput, account, vm])

  const deposit = async () => {
    if (!vm || !account || !lockAddress || !fgtAddress) return
    if (value < MAX_VALUE) {
      try {
        await lockAXC(vm, hexToBytes(account.privateKey), lockAddress).catch(
          (error) => {
            alert(error.message)
            throw error
          },
        )
        const newTotalDeposits = await getTotalDeposits(vm, lockAddress)
        const newValue = Number(newTotalDeposits / BigInt(10) ** BigInt(18))
        setValue(newValue)
        targetValueRef.current = newValue

        const newRewards = Number(
          await getBalance(
            vm,
            fgtAddress,
            new Address(hexToBytes(account.address)),
          ).catch((error) => {
            alert(error.message)
            throw error
          }),
        )
        setRewards(newRewards)
        targetRewardsRef.current = newRewards

        startAnimation()
      } catch (error) {
        console.error('Error during deposit:', error)
      }
    }
  }

  const reset = async () => {
    setValue(0)
    setDisplayValue(0)
    setRewards(0)
    setDisplayRewards(0)
    setFillHeight(0)
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }

    if (!vm || !account || !compilerOutput) return

    await deployContracts(account, vm, compilerOutput)
  }

  const startAnimation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
    startTimeRef.current = null
    startValueRef.current = displayValue
    startRewardsRef.current = displayRewards
    animationRef.current = requestAnimationFrame(animateStep)
  }

  const animateStep = (timestamp: number) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp
    }

    const elapsed = timestamp - startTimeRef.current
    const progress = Math.min(elapsed / ANIMATION_DURATION, 1)
    const easedProgress = easeOutQuart(progress)

    const newDisplayValue = Math.round(
      startValueRef.current +
        (targetValueRef.current - startValueRef.current) * easedProgress,
    )
    setDisplayValue(newDisplayValue)

    const newDisplayRewards = Math.round(
      startRewardsRef.current +
        (targetRewardsRef.current - startRewardsRef.current) * easedProgress,
    )
    setDisplayRewards(newDisplayRewards)

    const newFillHeight = (targetValueRef.current / MAX_VALUE) * 100
    setFillHeight(
      (startValueRef.current / MAX_VALUE) * 100 +
        (newFillHeight - (startValueRef.current / MAX_VALUE) * 100) *
          easedProgress,
    )

    if (progress < 1) {
      animationRef.current = requestAnimationFrame(animateStep)
    } else {
      animationRef.current = null
    }
  }

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <div className="flex h-full flex-col items-center justify-center rounded-2xl border p-4">
      <div className="w-full max-w-sm rounded-lg bg-white p-8">
        <motion.div
          className="mb-2 text-center text-2xl font-bold text-green-600"
          key={`rewards-${displayRewards}`}
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 0.3 }}
        >
          FGT Tokens: {(displayRewards / 10 ** 18).toFixed(0)}
        </motion.div>
        <motion.div
          className="mb-6 text-center text-4xl font-bold"
          key={`value-${displayValue}`}
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 0.3 }}
        >
          {displayValue} AXC
        </motion.div>

        <div className="relative mx-auto mb-6 h-32 w-32">
          <svg
            viewBox="0 0 100 100"
            className="h-full w-full"
            aria-label={`Money bag filled to ${Math.round(fillHeight)}%`}
          >
            <defs>
              <clipPath id="bagClip">
                <path d="M50 10 C20 10 10 30 10 50 C10 80 30 90 50 90 C70 90 90 80 90 50 C90 30 80 10 50 10 Z" />
              </clipPath>
            </defs>
            <path
              d="M50 10 C20 10 10 30 10 50 C10 80 30 90 50 90 C70 90 90 80 90 50 C90 30 80 10 50 10 Z"
              fill="none"
              stroke="#8B4513"
              strokeWidth="2"
              opacity="0.3"
            />
            <path
              d="M40 10 Q50 0 60 10"
              fill="none"
              stroke="#8B4513"
              strokeWidth="2"
              opacity="0.3"
            />
            <rect
              x="0"
              y={100 - fillHeight}
              width="100"
              height={fillHeight}
              fill="#8B4513"
              clipPath="url(#bagClip)"
            />
            <text
              x="50"
              y="60"
              fontSize="40"
              fontWeight="bold"
              fill="#FFD700"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              $
            </text>
          </svg>
        </div>

        <div className="flex flex-col gap-4">
          <Button
            onClick={deposit}
            disabled={
              value >= MAX_VALUE || isCompiling || !fgtAddress || !lockAddress
            }
            className="w-full py-6 text-lg"
          >
            Deposit 10 AXC
          </Button>
          <Button
            onClick={reset}
            disabled={value === 0}
            variant="outline"
            className="w-full py-6 text-lg"
          >
            Reset
          </Button>
        </div>

        {value >= MAX_VALUE && (
          <p className="mt-4 text-center font-semibold text-green-600">
            Maximum deposit reached!
          </p>
        )}
      </div>
    </div>
  )
}
