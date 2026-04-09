/* eslint-disable @next/next/no-img-element, jsx-a11y/alt-text */
import { ImageResponse } from '@vercel/og'

export default async function handler(req, res) {
  try {
    // Get params from query (Node.js runtime)
    const title = req.query.title || 'Metaplex Developer Hub'
    const description = req.query.description || 'Build the future of digital assets on Solana'
    const product = req.query.product || ''

    // Format product name for display
    const productDisplay = product
      ? product
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      : ''

    // Fetch logo image - use request host for self-referencing URL
    const protocol = req.headers['x-forwarded-proto'] || 'http'
    const host = req.headers.host
    const logoUrl = `${protocol}://${host}/docs/metaplex-logo-white.png`
    const logoData = await fetch(logoUrl).then((r) => r.arrayBuffer())

    // Site design tokens (dark mode)
    const blue = '#52acff'       // hsl(212 100% 66%) — primary
    const bg = '#111111'         // hsl(0 0% 6.5%)   — background
    const border = '#1f1f1f'     // hsl(0 0% 12%)    — border
    const mutedFg = '#9ea2af'    // hsl(240 5% 64.9%) — muted-foreground

    // Create ImageResponse
    const imageResponse = new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: bg,
            padding: 60,
            fontFamily: 'Inter, system-ui, sans-serif',
            position: 'relative',
          }}
        >
          {/* Blue accent bar at top */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 3,
              background: blue,
            }}
          />

          {/* Subtle blue ambient glow */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `radial-gradient(ellipse at 20% 30%, rgba(82, 172, 255, 0.07) 0%, transparent 55%)`,
            }}
          />

          {/* Top section with logo */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: 48,
            }}
          >
            <img
              src={logoData}
              width={180}
              height={44}
              style={{ objectFit: 'contain' }}
            />
          </div>

          {/* Main content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              justifyContent: 'center',
            }}
          >
            {/* Blue accent rule above title */}
            <div
              style={{
                width: 36,
                height: 3,
                background: blue,
                marginBottom: 24,
              }}
            />

            {/* Title */}
            <div
              style={{
                fontSize: title.length > 50 ? 48 : title.length > 35 ? 56 : 64,
                fontWeight: 700,
                color: '#FFFFFF',
                lineHeight: 1.15,
                marginBottom: 20,
                letterSpacing: '-0.02em',
                maxWidth: 1000,
              }}
            >
              {title}
            </div>

            {/* Description */}
            {description && (
              <div
                style={{
                  fontSize: 24,
                  color: mutedFg,
                  lineHeight: 1.5,
                  maxWidth: 900,
                }}
              >
                {description.length > 140 ? description.slice(0, 140) + '...' : description}
              </div>
            )}
          </div>

          {/* Bottom section */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 32,
              paddingTop: 24,
              borderTop: `1px solid ${border}`,
            }}
          >
            {/* Product name in blue */}
            {productDisplay ? (
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 500,
                  color: blue,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
              >
                {productDisplay}
              </div>
            ) : (
              <div style={{ display: 'flex' }} />
            )}

            {/* Domain */}
            <div
              style={{
                fontSize: 18,
                color: mutedFg,
              }}
            >
              metaplex.com/docs
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )

    // Convert to buffer and send via res (Pages Router Node.js pattern)
    const buffer = await imageResponse.arrayBuffer()
    res.setHeader('Content-Type', 'image/png')
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
    res.status(200).send(Buffer.from(buffer))
  } catch (e) {
    console.error('OG Image generation error:', e)
    res.status(500).send('Failed to generate image')
  }
}
