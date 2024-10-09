import Editor from '@/components/solc/Editor'
import { SolidityContextProvider } from '@/context/solidityContext'
import { source } from '../source-code/fill-bottle.solc'
import { WaterFillingGameComponent } from '@/components/water-filling-game'

export default function FillBottleExample() {
  return (
    // <SolidityContextProvider>
    <div className="grid h-96 grid-cols-1 lg:grid-cols-3">
      1<div className="col-span-2">{/* <Editor sourceCode={source} />1 */}</div>
      <div className="col-span-1">{/* <WaterFillingGameComponent /> */}</div>
    </div>
    // </SolidityContextProvider>
  )
}
