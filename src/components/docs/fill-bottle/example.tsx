import Editor from '@/components/solc/Editor'
import { source } from '../source-code/fill-bottle.solc'
import WaterFillingGameComponent from './water-filling-game'
import dynamic from 'next/dynamic'

const SolidityContextProvider = dynamic(
  () =>
    import('@/context/solidityContext').then(
      (mod) => mod.SolidityContextProvider,
    ),
  { ssr: false },
)

export default function FillBottleExample() {
  return (
    <SolidityContextProvider>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <div className="col-span-2">
          <Editor sourceCode={source} height="900px" />
        </div>
        <div className="col-span-1">
          <WaterFillingGameComponent />
        </div>
      </div>
    </SolidityContextProvider>
  )
}
