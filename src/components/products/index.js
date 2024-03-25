import { bubblegum } from './bubblegum'
import { candyMachine } from './candyMachine'
import { fusion } from './fusion'
import { global } from './global'
import { hydra } from './hydra'
import { inscription } from './inscription'
import { tokenAuthRules } from './tokenAuthRules'
import { tokenMetadata } from './tokenMetadata'
import { toolbox } from './toolbox'
import { umi } from './umi'
import { amman } from './amman'
import { das } from './das-api'
import { core } from './core'
import { candyMachine4 } from './candyMachine4'


export const products = [
  global,
  tokenMetadata,
  tokenAuthRules,
  bubblegum,
  toolbox,
  candyMachine,
  fusion,
  hydra,
  inscription,
  umi,
  amman,
  das,
  core,
  // candyMachine4
].sort((a, b) => a.name.localeCompare(b.name))
