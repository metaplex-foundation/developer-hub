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
        d="M12.1776 2.08934C10.8398 0.75156 9.02538 0 7.13347 0V0C3.19376 0 0 3.19376 0 7.13347V102C0 107.523 4.47715 112 10 112H40C44.4183 112 48 108.418 48 104V104C48 99.5817 44.4183 96 40 96H33.5C29.3579 96 26 92.6421 26 88.5V88.5C26 84.3579 29.3579 81 33.5 81H78.5C82.6421 81 86 84.3579 86 88.5V88.5C86 92.6421 82.6421 96 78.5 96H71C66.5817 96 63 99.5817 63 104V104C63 108.418 66.5817 112 71 112H102C107.523 112 112 107.523 112 102V7.25845C112 3.24972 108.75 0 104.742 0V0C102.816 0 100.97 0.764727 99.609 2.12595L62.9827 38.7523C59.0774 42.6576 52.7458 42.6576 48.8406 38.7523L12.1776 2.08934Z"
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
