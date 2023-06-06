import { Callout } from '@/components/Callout'
import {
  Dialect,
  DialectSwitcher,
  transformDialectSwitcherTag,
} from '@/components/DialectSwitcher'
import { QuickLink, QuickLinks } from '@/components/QuickLinks'
import { Totem, TotemAccordion, TotemProse } from '@/components/Totem'
import {
  Diagram,
  transformDiagramTag,
  transformNodeTag,
} from '@/components/diagrams'

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
    },
    render: ({ src, alt = '', caption }) => (
      <figure>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} />
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
    },
  },
  totem: {
    render: Totem,
  },
  'totem-accordion': {
    render: TotemAccordion,
    attributes: {
      title: { type: String },
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
      from: { type: String, required: true },
      to: { type: String, required: true },
      fromPosition: { type: String },
      toPosition: { type: String },
      path: { type: String },
      animated: { type: Boolean },
      theme: { type: String },
    },
  },
  'node-section': {
    render: 'NodeSection',
    attributes: {
      label: { type: String },
      theme: { type: String },
    },
  },
}

export default tags
