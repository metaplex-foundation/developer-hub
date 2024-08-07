import fs from 'fs'
import path from 'path'

// Turns out Vercel builds the site into a different directory and file structure than running `next build` locally
// So we need to read the routes-manifest.json file from a different location than the .next directory that is locally
// built. The /sitemap.xml route will not work on local development, but it will work on Vercel deployment.

export async function getServerSideProps({ res }) {
  console.log('running sitemap generation')

  let directoryPath = path
    .join(process.cwd(), '.next/routes-manifest.json')
    .replace(/\\/g, '/')

  const json = JSON.parse(fs.readFileSync(directoryPath, 'utf8'))

  const staticRoutes = json.dataRoutes.map((route) => {
    return route.page
  })

  // Generate the sitemap XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
          ${staticRoutes
            .map((route) => {
              return `
                <url>
                  <loc>${`https://developers.metaplex.com`}${route}</loc>
                </url>
              `
            })
            .join('')}
        </urlset>`

  res.setHeader('Cache-Control', 'no-store')
  res.setHeader('Content-Type', 'text/xml')
  // Send the XML to the browser
  res.write(sitemap)
  res.end()
  return {
    props: {},
  }
}
export default function SiteMap() {}
