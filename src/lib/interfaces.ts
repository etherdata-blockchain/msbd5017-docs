export interface CompilerOutput {
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
  abis?: any[]
  contracts: {
    [fileName: string]: {
      [contractName: string]: {
        abi: any[]
        evm: {
          bytecode: {
            object: string
          }
        }
      }
    }
  }
}

/**
 * Checker function to check if the output has any errors
 * @param output - The compiler output to check
 * @returns A tuple of [hasErrors, message]
 */
export type Checker = (output: CompilerOutput) => Promise<[boolean, string]>
