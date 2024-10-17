import * as cbor from 'cbor'

function bufferToString(buffer: Uint8Array): string {
  // Try to convert to UTF-8 string first
  const utf8String = Buffer.from(buffer).toString('utf8')

  // If it's a valid UTF-8 string and not the solc version, return it
  if (
    utf8String.length > 0 &&
    Buffer.from(utf8String, 'utf8').equals(Buffer.from(buffer)) &&
    !utf8String.startsWith('\u0000')
  ) {
    return utf8String
  }

  // If it's likely the solc version, convert to version string
  if (buffer.length === 3) {
    return `${buffer[0]}.${buffer[1]}.${buffer[2]}`
  }

  // If not a valid UTF-8 string or solc version, return hex representation
  return '0x' + Buffer.from(buffer).toString('hex')
}
function reviverFunction(key: string, value: any): any {
  if (value && value.type === 'Buffer' && Array.isArray(value.data)) {
    return bufferToString(new Uint8Array(value.data))
  }
  return value
}

export function decodeMetadata(bytecodeHex: string): string {
  // Remove '0x' prefix if present
  const cleanHex = bytecodeHex.startsWith('0x')
    ? bytecodeHex.slice(2)
    : bytecodeHex

  // Convert hex string to Buffer
  const bytecode = Buffer.from(cleanHex, 'hex')

  // Extract metadata (last two bytes are the length)
  const metadataLength = bytecode.readUInt16BE(bytecode.length - 2)
  const metadataBuffer = bytecode.slice(
    bytecode.length - 2 - metadataLength,
    bytecode.length - 2,
  )

  try {
    // Decode CBOR data
    const metadata = cbor.decodeFirstSync(metadataBuffer)

    // Use JSON.stringify with the reviver function to convert UintArray to string
    return JSON.stringify(metadata, reviverFunction, 2)
  } catch (error) {
    console.error('Error decoding CBOR:', error)
    return `Raw metadata (hex): ${metadataBuffer.toString('hex')}`
  }
}
