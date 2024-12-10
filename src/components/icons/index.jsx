import * as solidIcons20 from '@heroicons/react/20/solid'
import * as outlineIcons24 from '@heroicons/react/24/outline'
import clsx from 'clsx'

import { CSharpIcon } from './languages/CSharpIcon'
import { CurlIcon } from './languages/CurlIcon'
import { GoIcon } from './languages/GoIcon'
import { JavaIcon } from './languages/JavaIcon'
import { JavaScriptIcon } from './languages/JavaScriptIcon'
import { KotlinIcon } from './languages/KotlinIcon'
import { PhpIcon } from './languages/PhpIcon'
import { PythonIcon } from './languages/PythonIcon'
import { RubyIcon } from './languages/RubyIcon'
import { RustIcon } from './languages/RustIcon'
import { ShellIcon } from './languages/ShellIcon'
import { SwiftIcon } from './languages/SwiftIcon'
import { TypescriptIcon } from './languages/TypescriptIcon'

const customIcons = {
  CSharpIcon,
  CurlIcon,
  GoIcon,
  JavaIcon,
  JavaScriptIcon,
  KotlinIcon,
  PhpIcon,
  PythonIcon,
  RubyIcon,
  RustIcon,
  ShellIcon,
  SwiftIcon,
  TypescriptIcon,
}

export function Icon({ icon, className, ...props }) {
  const isSolid = icon.startsWith('Solid')
  const icons = isSolid ? solidIcons20 : outlineIcons24
  const trimmedIcon = icon.replace(/^(Solid|Outline)/, '')
  const IconComponent =
    icons[trimmedIcon] ??
    icons[trimmedIcon + 'Icon'] ??
    customIcons[trimmedIcon + 'Icon'] ??
    customIcons[trimmedIcon] ??
    icons['ExclamationCircleIcon']
  const defaultSize = isSolid ? 'h-5 w-5' : 'h-6 w-6'

  return (
    <IconComponent
      className={clsx(className, className ? '' : defaultSize)}
      {...props}
    />
  )
}
