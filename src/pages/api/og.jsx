/* eslint-disable @next/next/no-img-element, jsx-a11y/alt-text */
import { ImageResponse } from '@vercel/og'

// Product colors matching the site theme
const productColors = {
  core: { bg: '#22c55e', text: '#000000' },
  'candy-machine': { bg: '#ec4899', text: '#FFFFFF' },
  'core-candy-machine': { bg: '#ec4899', text: '#FFFFFF' },
  bubblegum: { bg: '#0ea5e9', text: '#000000' },
  'bubblegum-v2': { bg: '#0ea5e9', text: '#000000' },
  umi: { bg: '#8b5cf6', text: '#FFFFFF' },
  'token-metadata': { bg: '#f59e0b', text: '#000000' },
  'mpl-hybrid': { bg: '#ef4444', text: '#FFFFFF' },
  'das-api': { bg: '#14b8a6', text: '#000000' },
  cli: { bg: '#10b981', text: '#000000' },
  guides: { bg: '#22c55e', text: '#000000' },
  default: { bg: '#FFFFFF', text: '#000000' },
}

export default async function handler(req) {
  console.log('OG handler started')
  try {
    // Get params from query (Node.js runtime uses req.query)
    const { title = 'Metaplex Developer Hub', description = 'Build the future of digital assets on Solana', product = '' } = req.query
    console.log('Params:', { title, description, product })

    // Get product color scheme
    const colors = productColors[product.toLowerCase()] || productColors.default

    // Format product name for display
    const productDisplay = product
      ? product
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      : ''

    // Fetch logo image
    console.log('Fetching logo...')
    const logoUrl = 'https://developers.metaplex.com/metaplex-logo-white.png'
    const logoData = await fetch(logoUrl).then((res) => res.arrayBuffer())
    console.log('Logo fetched, size:', logoData.byteLength)

    console.log('Creating ImageResponse...')
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#171717',
            padding: 60,
            fontFamily: 'Inter, system-ui, sans-serif',
            position: 'relative',
          }}
        >
          {/* Gradient accent line at top */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              background: 'linear-gradient(90deg, #cf4fb4, #6186b1, #39ce95)',
            }}
          />

          {/* Subtle gradient glow in background */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(ellipse at 0% 0%, rgba(207, 79, 180, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 100% 100%, rgba(57, 206, 149, 0.08) 0%, transparent 50%)',
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
            {/* Metaplex Logo */}
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
                  color: '#a3a3a3',
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
              borderTop: '1px solid #525252',
            }}
          >
            {/* Product badge */}
            {productDisplay ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: colors.bg,
                  color: colors.text,
                  padding: '10px 20px',
                  borderRadius: 6,
                  fontSize: 18,
                  fontWeight: 600,
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
                color: '#737373',
              }}
            >
              developers.metaplex.com
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e) {
    console.error('OG Image generation error:', e)
    return new Response('Failed to generate image', { status: 500 })
  }
}
