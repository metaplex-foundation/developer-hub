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
        d="M0 8C0 3.58172 3.58172 0 8 0H104C108.418 0 112 3.58172 112 8V8C112 12.4183 108.382 15.9165 104.051 16.7898C85.7677 20.4762 72 36.6303 72 56C72 75.3697 85.7677 91.5238 104.051 95.2102C108.382 96.0835 112 99.5817 112 104V104C112 108.418 108.418 112 104 112H8C3.58172 112 0 108.418 0 104V104C0 99.5817 3.61781 96.0835 7.94892 95.2102C26.2323 91.5238 40 75.3697 40 56C40 36.6303 26.2323 20.4762 7.94892 16.7898C3.6178 15.9165 0 12.4183 0 8V8ZM9.7374 79.0327C4.65143 81.1856 0 76.5228 0 71V41C0 35.4772 4.65143 30.8144 9.73741 32.9673C18.7069 36.764 25 45.6471 25 56C25 66.3529 18.7069 75.236 9.7374 79.0327ZM87 56C87 45.6471 93.2931 36.764 102.263 32.9673C107.349 30.8144 112 35.4772 112 41V71C112 76.5228 107.349 81.1856 102.263 79.0327C93.2931 75.236 87 66.3529 87 56Z"
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
