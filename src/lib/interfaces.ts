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

export type Checker = (output: CompilerOutput) => Promise<[boolean, string]>
