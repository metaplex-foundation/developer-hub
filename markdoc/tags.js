import { Callout } from '@/components/Callout'
import {
  Dialect,
  DialectSwitcher,
  transformDialectSwitcherTag,
} from '@/components/DialectSwitcher'
import Image from '@/components/Image'
import { QuickLink, QuickLinks } from '@/components/QuickLinks'
import { Seperator } from '@/components/Seperator'
import { Totem, TotemAccordion, TotemProse } from '@/components/Totem'
import Video from '@/components/Video'
import ApiComponentWrapper from '@/components/apiComponents/apiComponentWrapper'
import {
  Diagram,
  transformDiagramTag,
  transformNodeTag,
} from '@/components/diagrams'
import { PackagesUsed } from '@/components/helperComponents/packagesUsed'
import { MarkdocGrid as ProductGrid } from '@/components/products/Grid'
import { MarkdocGrid as AllProductsGrid } from '@/components/products/GridAllProducts'

const tags = {
  callout: {
    attributes: {
      title: { type: String },
      type: {
        type: String,
        default: 'note',
        matches: ['note', 'warning'],
        errorLevel: 'critical',
      },
    },
    render: Callout,
  },
  figure: {
    selfClosing: true,
    attributes: {
      src: { type: String },
      alt: { type: String },
      caption: { type: String },
      notRounded: { type: Boolean },
    },
    render: ({ src, alt = '', caption, notRounded = false }) => (
      <figure>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className={notRounded ? '' : 'rounded-lg'} />
        <figcaption>{caption}</figcaption>
      </figure>
    ),
  },
  'quick-links': {
    render: QuickLinks,
  },
  'quick-link': {
    selfClosing: true,
    render: QuickLink,
    attributes: {
      title: { type: String },
      description: { type: String },
      icon: { type: String },
      href: { type: String },
      target: { type: String },
    },
  },
  'product-grid': {
    selfClosing: true,
    render: ProductGrid,
  },
  'all-product-grid': {
    selfClosing: true,
    render: AllProductsGrid,
  },
  totem: {
    render: Totem,
  },
  'totem-accordion': {
    render: TotemAccordion,
    attributes: {
      title: { type: String },
      defaultOpen: { type: Boolean },
    },
  },
  'totem-prose': {
    render: TotemProse,
  },
  'dialect-switcher': {
    render: DialectSwitcher,
    transform: transformDialectSwitcherTag,
    attributes: {
      title: { type: String },
    },
  },
  dialect: {
    render: Dialect,
    attributes: {
      title: { type: String },
      id: { type: String },
    },
  },
  diagram: {
    render: Diagram,
    transform: transformDiagramTag,
    attributes: {
      type: { type: String },
      height: { type: String },
    },
  },
  node: {
    render: 'Node',
    transform: transformNodeTag,
    selfClosing: true,
    attributes: {
      id: { type: String },
      type: { type: String },
      label: { type: String },
      x: { type: Number },
      y: { type: Number },
      z: { type: Number },
      parent: { type: String },
      theme: { type: String },
    },
  },
  edge: {
    render: 'Edge',
    selfClosing: true,
    attributes: {
      id: { type: String },
      type: { type: String },
      label: { type: String },
      labelX: { type: Number },
      labelY: { type: Number },
      from: { type: String, required: true },
      to: { type: String, required: true },
      fromPosition: { type: String },
      toPosition: { type: String },
      path: { type: String },
      animated: { type: Boolean },
      dashed: { type: Boolean },
      arrow: { type: String },
      theme: { type: String },
    },
  },
  seperator: {
    render: Seperator,
    attributes: {
      h: { type: String },
    },
    selfClosing: true,
  },
  packagesUsed: {
    render: PackagesUsed,
    attributes: {
      packages: { type: Array },
      type: { type: String },
    },
  },
  image: {
    render: Image,
    attributes: {
      src: { type: String },
      alt: { type: String },
      classes: { type: String },
    },
    selfClosing: true,
  },
  video: {
    render: Video,
    attributes: {
      src: { type: String },
      classes: { type: String },
      embed: { type: Boolean },
    },
  },
  apiRenderer: {
    attributes: {
      method: { type: String },
    },
    render: ApiComponentWrapper,
  },
}

export default tags
