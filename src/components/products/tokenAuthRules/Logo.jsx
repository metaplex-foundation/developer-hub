import { useId } from 'react'

export function Logo(props) {
  const id = useId()

  return (
    <svg
      width="112"
      height="112"
      viewBox="0 0 112 112"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M112 10C112 4.47715 107.523 0 102 0H10C4.47715 0 0 4.47715 0 10V20.5C0 23.5376 2.46243 26 5.5 26V26C8.53757 26 11 23.5376 11 20.5V18.5C11 14.3579 14.3579 11 18.5 11H91C96.5228 11 101 15.4772 101 21V31C101 36.5228 96.5228 41 91 41H86H11H10C4.47715 41 0 45.4772 0 51V102C0 107.523 4.47715 112 10 112H102C107.523 112 112 107.523 112 102V10ZM64 74.5C64 70.3579 60.6421 67 56.5 67V67C52.3579 67 49 70.3579 49 74.5V89.5C49 93.6421 52.3579 97 56.5 97V97C60.6421 97 64 93.6421 64 89.5V74.5Z"
        fill={`url(#${id}-gradient)`}
      />
      <defs>
        <linearGradient
          id={`${id}-gradient`}
          x1="56"
          y1="0"
          x2="56"
          y2="112"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#BEF264" />
          <stop offset="1" stopColor="#8ED022" />
        </linearGradient>
      </defs>
    </svg>
  )
}
