'use client'

import { Button } from '@/components/shared/Button'
import { useSolidity } from '@/context/solidityContext'
import { deployContract } from '@/context/solidityContext.utils'
import { Address, hexToBytes } from '@ethereumjs/util'
import { VM } from '@ethereumjs/vm'
import { defaultAbiCoder as AbiCoder, Interface } from '@ethersproject/abi'
import { Transition } from '@headlessui/react'
import { Loader2 } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

// call hello function
async function callHello(vm: VM, contractAddress: Address, caller: Address) {
  const sigHash = new Interface(['function hello()']).getSighash('hello')
  const result = await vm.evm.runCall({
    caller,
    to: contractAddress,
    origin: caller,
    data: hexToBytes(sigHash),
  })

  if (result.execResult.exceptionError) {
    throw result.execResult.exceptionError
  }

  const resultData = AbiCoder.decode(['string'], result.execResult.returnValue)
  return resultData[0]
}

export default function Example1Executor() {
  const { compilerOutput, account, vm, isCompiling } = useSolidity()
  const [result, setResult] = useState<string | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [showResult, setShowResult] = useState(false)

  useEffect(() => {
    if (result) {
      const timer = setTimeout(() => setShowResult(true), 300) // Delay showing result
      return () => clearTimeout(timer)
    }
  }, [result])

  const deployAndRun = useCallback(async () => {
    setIsRunning(true)
    setShowResult(false)
    setResult(null)

    try {
      if (compilerOutput === null || !account || !vm) {
        return
      }

      const contract = compilerOutput.contracts['contract.sol']['HelloWorld']
      const deploymentBytecode = contract.evm.bytecode.object

      const contractAddress = await deployContract(
        vm,
        hexToBytes(account.privateKey),
        deploymentBytecode,
      )
      const newResult = await callHello(
        vm,
        contractAddress,
        Address.fromPrivateKey(hexToBytes(account.privateKey)),
      )
      setResult(newResult)
    } catch (e: any) {
      alert(e.message)
    } finally {
      setIsRunning(false)
    }
  }, [compilerOutput, account, vm])

  if (compilerOutput === null) {
    return null
  }

  return (
    <div className="font-md mt-2 flex h-20 flex-row items-center justify-between rounded-2xl border p-5 text-lg">
      <div className="flex-1">
        <Transition
          show={isRunning}
          enter="transition-opacity duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div>
            <Loader2 className="animate-spin" size={24} />
          </div>
        </Transition>

        <Transition
          show={showResult && !!result}
          enter="transition-opacity duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <span>
            <span className="font-bold">Smart contract says</span>: {result}
          </span>
        </Transition>

        <Transition
          show={!isRunning && !result}
          enter="transition-opacity duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <span>Click the button to deploy and run the contract</span>
        </Transition>
      </div>

      <div>
        <Button onClick={deployAndRun} disabled={isCompiling || isRunning}>
          Say Hello
        </Button>
      </div>
    </div>
  )
}
