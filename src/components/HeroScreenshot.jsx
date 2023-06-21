import Image from 'next/image'
import { IconTrafficLights } from '@/components/IconTrafficLights'

export function HeroScreenshot({ src, alt, width, height }) {
  return (
    <div className="relative -mb-16 lg:-mb-20">
      <div className="absolute -top-px left-20 right-11 h-px bg-gradient-to-r from-sky-300/0 via-sky-300/70 to-sky-300/0 opacity-10"></div>
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-sky-300 via-sky-300/70 to-blue-300 opacity-10"></div>
      <div className="relative rounded-t-2xl bg-[#0A101F]/80 ring-1 ring-white/10 backdrop-blur">
        <div className="absolute -top-px left-20 right-11 h-px bg-gradient-to-r from-sky-300/0 via-accent-300 to-sky-300/0 opacity-30"></div>
        <div className='px-4 py-3'>
          <IconTrafficLights className="h-2.5 w-auto stroke-slate-500/30" />
        </div>
        <div className='border-t border-white/10'>
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className='no-lightense'
          />
        </div>
      </div>
    </div>
  )
}
