import {
  changelogSection,
  documentationSection,
  recipesSection,
  referencesSection,
} from '@/shared/sections'
import { Hero } from './Hero'
import { Logo } from './Logo'

export const legacyDocumentation = {
  name: 'Legacy',
  headline: 'Products from our old docs',
  description: 'A collection of documentation of older Programs and Tools which might not be used anymore or deprecated. Migrated from our old docs for documentation for completeness.',
  path: 'legacy-documentation',
  logo: Logo,
  github: '',
  className: 'accent-green',
  sections: [
    {
      ...documentationSection('legacy-documentation'),
      navigation: [
        {
          title: 'Auction House',
          links: [
            { title: 'Overview', href: '/legacy-documentation/auction-house' },
            { title: 'Getting Started', href: '/legacy-documentation/auction-house/getting-started' },
            { title: 'Auction House Settings', href: '/legacy-documentation/auction-house/settings' },
            { title: 'Managing Auction Houses', href: '/legacy-documentation/auction-house/managing' },
            { title: 'Trading Assets', href: '/legacy-documentation/auction-house/trading-assets' },
            { title: 'Managing Buyer Escrow Account', href: '/legacy-documentation/auction-house/buyer-escrow' },
            { title: 'Auction House Receipts', href: '/legacy-documentation/auction-house/receipts' },
            { title: 'Finding Bids, listings, sales', href: '/legacy-documentation/auction-house/find' },
            { title: 'Timed Auctions with Auctioneers', href: '/legacy-documentation/auction-house/auctioneer' },
            { title: 'FAQ', href: '/legacy-documentation/auction-house/faq' },
          ],
        },
        {
          title: 'Developer Tools',
          links: [
            {
              title: 'Solita',
              href: '/legacy-documentation/solita',
            },
            {
              title: 'Shank',
              href: '/legacy-documentation/shank',
            },
            {
              title: 'Beet',
              href: '/legacy-documentation/beet',
            },
            {
              title: 'Cusper',
              href: '/legacy-documentation/cusper',
            },
            {
              title: 'Rust Bin',
              href: '/legacy-documentation/rust-bin',
            },
          ],
        },
        {
          title: 'Fixed Price Sale',
          links: [
            {
              title: 'Overview',
              href: '/legacy-documentation/fixed-price',
            },
            {
              title: 'Overview',
              href: '/legacy-documentation/fixed-price/tech-description',
            },
          ],
        },
        {
          title: 'Gumdrop',
          links: [
            {
              title: 'Overview',
              href: '/legacy-documentation/gumdrop',
            },
          ],
        },
        {
          title: 'SDKs',
          links: [
            {
              title: 'Android SDK',
              href: '/legacy-documentation/sdks/android',
            },
            {
              title: 'iOS SDK',
              href: '/legacy-documentation/ios',
            },
          ],
        },
        {
          title: 'Token Entangler',
          links: [
            {
              title: 'Overview',
              href: '/legacy-documentation/token-entangler',
            },
          ],
        },       
      ],
    },
  ],
}
