import { Card, CardContent } from '@/components/ui/card'
import { useSolidity } from '@/context/solidityContext'
import { decodeMetadata } from './utils'

export default function AbiDisplay() {
  const { compilerOutput } = useSolidity()
  console.log(compilerOutput)

  if (!compilerOutput) {
    return <></>
  }

  return (
    <div className="flex flex-col space-y-2">
      <Card>
        <CardContent>
          <div className="flex flex-row">
            <div>
              <label>Your abi is:</label>
              <pre className="max-h-96 overflow-scroll">
                {JSON.stringify(
                  compilerOutput?.contracts['contract.sol']?.['MyToken']?.abi,
                  null,
                  2,
                )}
              </pre>
            </div>
            <div>
              <label>Your bytecode is:</label>
              <p className="max-h-96 overflow-scroll break-all">
                {
                  compilerOutput?.contracts['contract.sol']?.['MyToken']?.evm
                    .bytecode.object
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <div>
            <label>Your metadata is:</label>
            <pre className="max-h-96 overflow-scroll">
              {decodeMetadata(
                compilerOutput?.contracts['contract.sol']?.['MyToken']?.evm
                  .bytecode.object,
              )}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
