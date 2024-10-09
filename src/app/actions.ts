'use server'
//@ts-expect-error
import solc from 'solc'

interface CompilerOutput {
  errors: {
    component: string
    formattedMessage: string
    message: string
    severity: string
    sourceLocation?: {
      end: number
      file: string
      start: number
    }
    type: string
  }[]
}

export async function compile(sourceCode: string): Promise<CompilerOutput> {
  const input = {
    language: 'Solidity',
    sources: {
      'contract.sol': {
        content: sourceCode,
      },
    },
  }

  const output = solc.compile(JSON.stringify(input))
  return JSON.parse(output)
}
