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
      <circle cx="55.5" cy="56.5" r="27.5" fill={`url(#${id}-gradient)`}/>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M112 10C112 4.47715 107.523 0 102 0H10C4.47715 0 0 4.47715 0 10V102C0 107.523 4.47715 112 10 112H102C107.523 112 112 107.523 112 102V10ZM55.5 101C80.0767 101 100 80.8528 100 56C100 31.1472 80.0767 11 55.5 11C30.9233 11 11 31.1472 11 56C11 80.8528 30.9233 101 55.5 101Z"
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
