import { amman } from './amman';
import { aura } from './aura';
import { bubblegum } from './bubblegum';
import { bubblegumv2 } from './bubblegum-v2';
import { candyMachine } from './candyMachine';
import { cli } from './cli';
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
import { shank } from './shank';
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
  bubblegumv2,
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
  shank,
  sugar,
  mplHybrid,
  guides,
  aura,
  cli
].sort((a, b) => a.name.localeCompare(b.name))
