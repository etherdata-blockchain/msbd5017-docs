import { Button } from '@/components/shared/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Trash } from 'lucide-react'
import { useState } from 'react'
import { InteractArea } from './interact-area'

export default function InteractWithRemixAbi() {
  const [abi, setAbi] = useState<any>()
  const [contractAddress, setContractAddress] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState<boolean>(false)

  const deleteContract = () => {
    setContractAddress(null)
    setAbi(null)
    setIsLoaded(false)
  }

  const deployContract = async () => {
    if (!abi) {
      return
    }

    if (!contractAddress) {
      alert('Contract address is required')
      return
    }

    setIsLoaded(true)
  }

  return (
    <Card className="px-2">
      <CardHeader>
        <CardTitle className="flex w-full flex-row flex-wrap justify-between text-2xl font-bold">
          <span>Interact with Contract</span>
          <Button
            variant={'outline'}
            onClick={deleteContract}
            disabled={!isLoaded}
          >
            <Trash />
          </Button>
        </CardTitle>
      </CardHeader>
      {!isLoaded && (
        <CardContent className="space-y-2">
          <Label>Contract Address</Label>
          <Input onChange={(e) => setContractAddress(e.target.value)} />

          <Label>ABI</Label>
          <Textarea
            onChange={(e) => setAbi(JSON.parse(e.target.value))}
            placeholder="Paste the ABI here"
            rows={10}
          />
          <Button onClick={deployContract} disabled={!contractAddress || !abi}>
            Use this contract
          </Button>
        </CardContent>
      )}

      {isLoaded && (
        <InteractArea contractAddress={contractAddress!} abi={abi} />
      )}
    </Card>
  )
}
