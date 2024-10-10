import React, { useMemo } from 'react'
import { generateFromString } from 'generate-avatar'

interface Props {
  walletAddress: string
  size: number
  className?: string
  borderRadius?: string
}

/**
 * AvatarImage generates an random avatar image based on the wallet address
 */
export default function WalletAvatarImage({
  walletAddress,
  className,
  size,
  borderRadius = '50%',
}: Props) {
  const svgURI = useMemo(
    () => `data:image/svg+xml;utf8,${generateFromString(walletAddress)}`,
    [walletAddress],
  )

  return (
    <div className={`rounded-full bg-green-400 ${className}`}>
      <img
        style={{ borderRadius }}
        src={svgURI}
        height={size}
        width={size}
        alt="avatar"
        className="ui-my-0"
      />
    </div>
  )
}
