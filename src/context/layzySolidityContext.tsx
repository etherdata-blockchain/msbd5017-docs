import dynamic from 'next/dynamic'

const SolidityContextProvider = dynamic(
  () =>
    import('@/context/solidityContext').then(
      (mod) => mod.SolidityContextProvider,
    ),
  { ssr: false },
)

export default SolidityContextProvider
