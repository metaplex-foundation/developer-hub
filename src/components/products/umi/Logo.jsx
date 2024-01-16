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
        d="M112 10C112 4.47715 107.523 0 102 0H10C4.47715 0 0 4.47715 0 10V102C0 107.523 4.47715 112 10 112H102C107.523 112 112 107.523 112 102V10ZM86 88.5C86 84.3579 82.6421 81 78.5 81H33.5C29.3579 81 26 84.3579 26 88.5V88.5C26 92.6421 29.3579 96 33.5 96H78.5C82.6421 96 86 92.6421 86 88.5V88.5Z"
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
          <stop stopColor="#7DEDFC" />
          <stop offset="1" stopColor="#0EA5E9" />
        </linearGradient>
      </defs>
    </svg>
  )
}
