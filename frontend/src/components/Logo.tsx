type LogoProps = {
  size?: number
}

/** The app mark: a navy badge with an ivory "V" and a gold accent dot, matching
 * the design tokens in docs/technical/13-frontend-architecture.md. Kept as a
 * component (not a flattened image) so it stays crisp at any size and the name
 * stays a one-line config change if it ever needs to (D-17). */
export function LogoMark({ size = 32 }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="7" fill="#102744" />
      <text
        x="16"
        y="23"
        textAnchor="middle"
        fontFamily="'Noto Sans', Arial, sans-serif"
        fontWeight={700}
        fontSize={18}
        fill="#F8F7F3"
      >
        V
      </text>
      <circle cx="25" cy="8" r="3" fill="#C6A15B" />
    </svg>
  )
}

export function Logo({ name }: { name: string }) {
  const [first, ...rest] = name.split(' ')
  return (
    <span className="logo">
      <LogoMark />
      <span className="logo-wordmark">
        {first}
        {rest.length > 0 && <span className="logo-wordmark-accent"> {rest.join(' ')}</span>}
      </span>
    </span>
  )
}
