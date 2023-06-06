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
        d="M112 46.5C112 52.0229 107.523 56.5 102 56.5H84.1777C75.2686 56.5 70.807 45.7286 77.1066 39.4289L94.9289 21.6066C101.229 15.307 112 19.7686 112 28.6777V46.5ZM112 71.5C112 65.9772 107.523 61.5 102 61.5H54H10C4.47715 61.5 0 65.9772 0 71.5V102C0 107.523 4.47715 112 10 112H102C107.523 112 112 107.523 112 102V71.5ZM0 46.5C0 52.0228 4.47715 56.5 10 56.5H41.5C47.0228 56.5 51.5 52.0228 51.5 46.5V10C51.5 4.47715 47.0228 0 41.5 0H10C4.47715 0 0 4.47715 0 10V46.5ZM56.5 10C56.5 4.47715 60.9772 0 66.5 0H85.3223C94.2314 0 98.693 10.7714 92.3934 17.0711L73.5711 35.8934C67.2714 42.193 56.5 37.7314 56.5 28.8223V10Z"
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
          <stop stopColor="#FCE04D" />
          <stop offset="1" stopColor="#F59E0B" />
        </linearGradient>
      </defs>
    </svg>
  )
}
