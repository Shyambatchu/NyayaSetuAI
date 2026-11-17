type LogoMarkProps = {
  size?: number
}

/** The app mark: a speech bubble holding a balance scale — conversation plus law,
 * which is what this product actually is. Navy/gold per the design tokens in
 * docs/technical/13-frontend-architecture.md. Drawn as geometry rather than a
 * flattened image so it stays crisp at any size, and kept as a component so a
 * rename stays a config change (D-17). */
export function LogoMark({ size = 36 }: LogoMarkProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      {/* Gold outline so the same mark reads on both the navy header and a light page. */}
      <path
        d="M8 3H24A5 5 0 0 1 29 8V19A5 5 0 0 1 24 24H16.5L10.5 27.6V24H8A5 5 0 0 1 3 19V8A5 5 0 0 1 8 3Z"
        fill="#102744"
        stroke="#C6A15B"
        strokeWidth={1.4}
      />
      <g stroke="#C6A15B" strokeWidth={1.5} strokeLinecap="round">
        <line x1="16" y1="7.8" x2="16" y2="19.8" />
        <line x1="8.5" y1="9.8" x2="23.5" y2="9.8" />
        <line x1="8.5" y1="9.8" x2="8.5" y2="12.2" />
        <line x1="23.5" y1="9.8" x2="23.5" y2="12.2" />
        <line x1="12.2" y1="20.6" x2="19.8" y2="20.6" />
      </g>
      <circle cx="16" cy="6.7" r="1.15" fill="#C6A15B" />
      {/* Pans hang below the beam — that is what makes it read as a balance. */}
      <path d="M5.6 12.2H11.4L10.1 15H6.9Z" fill="#C6A15B" />
      <path d="M20.6 12.2H26.4L25.1 15H21.9Z" fill="#C6A15B" />
    </svg>
  )
}

/** Splits "VidhiVerse AI" into a lighter "Vidhi", a bold "Verse" and a gold "AI".
 * Falls back to a plain bold wordmark for any name that isn't camel-cased. */
export function Logo({ name }: { name: string }) {
  const [first, ...rest] = name.split(' ')
  const camelCase = first.match(/^([A-Z][a-z]+)([A-Z].*)$/)

  return (
    <span className="logo">
      <LogoMark />
      <span className="logo-wordmark">
        {camelCase ? (
          <>
            <span className="logo-wordmark-light">{camelCase[1]}</span>
            {camelCase[2]}
          </>
        ) : (
          first
        )}
        {rest.length > 0 && <span className="logo-wordmark-accent"> {rest.join(' ')}</span>}
      </span>
    </span>
  )
}
