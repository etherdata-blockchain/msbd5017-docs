'use server'
import { CompilerOutput } from '@/lib/interfaces'
//@ts-expect-error
import solc from 'solc'

export async function compile(sourceCode: string): Promise<CompilerOutput> {
  const input = {
    language: 'Solidity',
    sources: {
      'contract.sol': {
        content: sourceCode,
      },
    },
    settings: {
      outputSelection: {
        '*': {
          '*': ['abi', 'evm.bytecode'],
        },
      },
    },
  }

  const output = solc.compile(JSON.stringify(input))

  return JSON.parse(output)
}
