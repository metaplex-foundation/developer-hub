import { documentationSection } from '@/shared/sections'
import { BookOpenIcon } from '@heroicons/react/24/outline'

export const guides = {
  name: 'Guides',
  headline: 'Guides for the Solana Blockchain',
  description: 'Guides for the Solana Blockchain.',
  path: 'guides',
  navigationMenuCatergory: 'Guides',
  icon: <BookOpenIcon className="text-green-500" />,
  github: 'https://github.com/metaplex-foundation/mpl-core',
  className: 'accent-green',
  heroes: null,
  sections: [
    {
      ...documentationSection('guides'),
      navigation: [
        {
          title: 'Solana Newcomers',
          links: [
            {
              title: 'What is Solana?',
              href: '/guides/what-is-solana',
              created: '2021-10-01',
              updated: null, // null means it's never been updated
            },
            {
              title: 'Validators and Staking',
              href: '/guides/validators',
              created: '2021-10-01',
              updated: null, // null means it's never been updated
            },
            {
              title: 'RPCs and DAS',
              href: '/guides/rpcs-and-das',
              created: '2021-10-01',
              updated: null, // null means it's never been updated
            },
            {
              title: 'Solana Programs',
              href: '/guides/solana-programs',
              created: '2021-10-01',
              updated: null, // null means it's never been updated
            },
            {
              title: 'Understanding PDAs',
              href: '/guides/understanding-pdas',
              created: '2021-10-01',
              updated: null, // null means it's never been updated
            },
            // {
            //   title: 'Where do I start?',
            //   href: '/guides/where-do-i-start-on-solana',
            //   created: '2021-10-01',
            //   updated: null, // null means it's never been updated
            // },
          ],
        },
        {
          title: 'Javascript',
          links: [
            // {
            //   title: 'Working with Javascript',
            //   href: '/guides/javascript/working-with-javascript',
            //   created: '2021-10-01',
            //   updated: null, // null means it's never been updated
            // },
            {
              title: 'Creating an NFT',
              href: '/guides/javascript/how-to-create-an-nft-on-solana',
              created: '06-24-2024',
              updated: null, // null means it's never been updated
            },
            // {
            //   title: 'Freezing an Nft',
            //   href: '/guides/javascript/how-to-freeze-an-nft-on-solana',
            //   created: '2021-10-01',
            //   updated: null, // null means it's never been updated
            // },
            {
              title: 'Creating an SPL Token',
              href: '/guides/javascript/how-to-create-an-spl-token-on-solana',
              created: '2024-06-16',
              updated: null, // null means it's never been updated
            },
            // {
            //   title: 'Updating an SPL Token',
            //   href: '/guides/javascript/how-to-update-an-spl-token-on-solana',
            //   created: '2024-06-16',
            //   updated: null, // null means it's never been updated
            // },
            {
              title: 'Transferring Tokens',
              href: '/guides/javascript/how-to-transfer-spl-tokens-on-solana',
              created: '2024-06-16',
              updated: '06-22-2024', // null means it's never been updated
            },
            {
              title: 'Transferring SOL',
              href: '/guides/javascript/how-to-transfer-sol-on-solana',
              created: '2024-06-16',
              updated: null, // null means it's never been updated
            },
          ],
        },
        {
          title: 'Rust',
          links: [
            {
              title: 'Getting Started with Rust',
              href: '/guides/rust/getting-started-with-rust',
              created: '2021-10-01',
              updated: null, // null means it's never been updated
            },
            {
              title: 'Metaplex Rust SDKs',
              href: '/guides/rust/metaplex-rust-sdks',
              created: '07-01-2024',
              updated: null, // null means it's never been updated
            },
            // {
            //   title: 'Using Anchor',
            //   href: '/guides/rust/anchor-programs',
            //   created: '2021-10-01',
            //   updated: null, // null means it's never been updated
            // },
            {
              title: 'CPI into a Metaplex Program',
              href: '/guides/rust/how-to-cpi-into-a-metaplex-program',
              created: '07-01-2024',
              updated: null, // null means it's never been updated
            },
            // {
            //   title: 'Solana Rust Client',
            //   href: '/guides/rust/solana-rust-client',
            //   created: '07-01-2024',
            //   updated: null, // null means it's never been updated
            // },

            // {
            //   title: 'How to Deserialize an Account',
            //   href: '/guides/rust/how-to-deserialize-an-account',
            //   created: '2021-10-01',
            //   updated: null, // null means it's never been updated
            // },
            // {
            //   title: 'Create a Staking Program',
            //   href: '/guides/rust/create-a-staking-program',
            //   created: '2021-10-01',
            //   updated: null, // null means it's never been updated
            // },
            // {
            //   title: 'Program Optimization',
            //   href: '/guides/rust/program-optimization',
            //   created: '2021-10-01',
            //   updated: null, // null means it's never been updated
            // },
          ],
        },
        // {
        //   title: 'React/Nextjs',
        //   links: [
        //     {
        //       title: 'Connecting to a Wallet',
        //       href: '/guides/react-nextjs/plugins',
        //       created: '2021-10-01',
        //       updated: null, // null means it's never been updated
        //     },
        //   ],
        // },
        {
          title: 'Metaplex Program Guides',
          links: [
            {
              title: 'Core',
              href: '/core/guides/',
              created: '2021-10-01',
              updated: null, // null means it's never been updated
            },
            // {
            //   title: 'Candy Machine',
            //   href: '/candy-machine/guides/',
            //   created: '2021-10-01',
            //   updated: null, // null means it's never been updated
            // },
            // {
            //   title: 'Core Candy Machine',
            //   href: '/core-candy-machine/guides/',
            //   created: '2021-10-01',
            //   updated: null, // null means it's never been updated
            // },
            // {
            //   title: 'Token Metadata',
            //   href: '/guides/react-nextjs/plugins',
            //   created: '2021-10-01',
            //   updated: null, // null means it's never been updated
            // },
            // {
            //   title: 'Bubblegum',
            //   href: '/guides/react-nextjs/plugins',
            //   created: '2021-10-01',
            //   updated: null, // null means it's never been updated
            // },
          ],
        },
      ],
    },
    // { ...changelogSection('core') },
  ],
}
