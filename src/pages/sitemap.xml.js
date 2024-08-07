import fs from 'fs'
import path from 'path'

// export async function generateSitemap() {
//   let directoryPath = path.join(process.cwd(), 'src/pages').replace(/\\/g, '/')

//   let files = []

//   function throughDirectory(directory) {
//     fs.readdirSync(directory).forEach((file) => {
//       const Absolute = path.join(directory, file)
//       if (fs.statSync(Absolute).isDirectory()) return throughDirectory(Absolute)
//       else return files.push(Absolute)
//     })
//   }

//   throughDirectory(path.join(process.cwd(), 'src/pages'))

//   console.log(directoryPath)

//   const filter = [
//     '/api',
//     '_app.jsx',
//     '_document.jsx',
//     '_error.jsx',
//     'sitemap.xml.js',
//   ]

//   // List of all pages to be included in the sitemap
//   const staticPages = files
//     .filter((staticPage) => {
//       return !filter.some((f) => staticPage.includes(f))
//     })
//     .map((staticPagePath) => {
//       const path = staticPagePath
//         .replace(/\\/g, '/')
//         .replace(directoryPath, '')
//         .replace('.jsx', '')
//         .replace('.js', '')
//         .replace('.md', '')
//         .replace('//', '/')
//       return `${`https://developers.metaplex.com`}${path}`
//     })

//   // Include dynamic pages if you have any
//   // Example: Fetch dynamic routes from your CMS or database

//   // Combine static and dynamic pages
//   const allPages = [...staticPages]

//   // Generate the sitemap XML
//   const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
//       <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
//         ${allPages
//           .map((url) => {
//             return `
//               <url>
//                 <loc>${url}</loc>
//               </url>
//             `
//           })
//           .join('')}
//       </urlset>`

// //   fs.writeFileSync('public/sitemap.xml', sitemap)
// //   console.log('Sitemap generated!')
// }

export async function getServerSideProps({ res }) {
  console.log('running sitemap generation')

  // let directoryPath = path.join(process.cwd(), 'src/pages').replace(/\\/g, '/')

  let directoryPath = path
    .join(process.cwd(), '.next/routes-manifest.json')
    .replace(/\\/g, '/')

  const json = JSON.parse(fs.readFileSync(directoryPath, 'utf8'))

  console.log({ json })

  const staticRoutes = json.dataRoutes.map(route => {
    return route.page
  })

  console.log({ staticRoutes })

  // console.log({ directoryPath })

  // let files = []

  // function throughDirectory(directory) {
  //   const fileDirectory = fs.readdirSync(directory)

  //   console.log({ fileDirectory })
  //   fileDirectory.forEach((file) => {
  //     const Absolute = path.join(directory, file)
  //     console.log({ Absolute })
  //     if (fs.statSync(Absolute).isDirectory()) return throughDirectory(Absolute)
  //     else return files.push(Absolute)
  //   })
  // }

  // throughDirectory(path.join(directoryPath))

  // console.log(files)

  // const filter = ['.html']

  // // List of all pages to be included in the sitemap
  // const staticPages = files
  //   .filter((staticPage) => {
  //     return filter.some((f) => staticPage.includes(f))
  //   })
  //   .map((staticPagePath) => {
  //     const path = staticPagePath
  //       .replace(/\\/g, '/')
  //       .replace(directoryPath, '')
  //       .replace('.html', '')
  //       //   .replace('.js', '')
  //       //   .replace('.md', '')
  //       .replace('//', '/')
  //     return `${`https://developers.metaplex.com`}${path}`
  //   })

  // Include dynamic pages if you have any
  // Example: Fetch dynamic routes from your CMS or database

  // Combine static and dynamic pages
  // const allPages = [...staticPages]

  // console.log({ allPages })

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
