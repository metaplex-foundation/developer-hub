import { amman } from './amman';
import { aura } from './aura';
import { bubblegum } from './bubblegum';
import { candyMachine } from './candyMachine';
import { core } from './core';
import { coreCandyMachine } from './coreCandyMachine';
import { das } from './das-api';
import { fusion } from './fusion';
import { global } from './global';
import { guides } from './guides';
import { hydra } from './hydra';
import { inscription } from './inscription';
import { legacyDocumentation } from './legacyDocumentation';
import { mplHybrid } from './mpl-hybrid';
import { sugar } from './sugar';
import { tokenAuthRules } from './tokenAuthRules';
import { tokenMetadata } from './tokenMetadata';
import { umi } from './umi';

export const productCategories = [
  // 'Aura', 
  'MPL', 
  'Dev Tools'
]

export const products = [
  global,
  tokenMetadata,
  tokenAuthRules,
  bubblegum,
  candyMachine,
  fusion,
  hydra,
  inscription,
  umi,
  amman,
  das,
  core,
  coreCandyMachine,
  legacyDocumentation,
  sugar,
  mplHybrid,
  guides,
  aura,
].sort((a, b) => a.name.localeCompare(b.name))
