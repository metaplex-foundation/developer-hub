import { Hero as BaseHero } from '@/components/Hero';

export function Hero({ page }) {
  return (
    <BaseHero page={page} light2Off light3Off>
      <svg
        role="img"
        aria-labelledby="bubblegum-v2-hero-title"
        width="380"
        height="243"
        viewBox="0 0 380 243"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full"
      >
        <title id="bubblegum-v2-hero-title">Bubblegum v2 Hero Graphic</title>
        <path d="M189.5 62L289.75 94" stroke="#1794CB" strokeWidth="1.5" />
        <line
          x1="89.2048"
          y1="129.456"
          x2="40.2048"
          y2="151.456"
          stroke="#83CC17"
          strokeOpacity="0.5"
        />
        <line
          x1="89.198"
          y1="128.541"
          x2="140.198"
          y2="150.541"
          stroke="#83CC17"
          strokeOpacity="0.5"
        />
        <line
          x1="289.205"
          y1="129.456"
          x2="240.205"
          y2="151.456"
          stroke="#83CC17"
          strokeOpacity="0.5"
        />
        <line
          x1="289.292"
          y1="129.309"
          x2="341.292"
          y2="151.309"
          stroke="#1794CB"
          strokeWidth="1.5"
        />
        <line
          x1="190.152"
          y1="62.4762"
          x2="90.1524"
          y2="94.4762"
          stroke="#83CC17"
          strokeOpacity="0.5"
        />
        <rect
          x="73"
          y="1"
          width="234"
          height="61"
          rx="19"
          fill="#043303"
          fillOpacity="0.38"
        />
        <path
          d="M99.1136 40V22.5455H105.216C106.432 22.5455 107.435 22.7557 108.224 23.1761C109.014 23.5909 109.602 24.1506 109.989 24.8551C110.375 25.554 110.568 26.3295 110.568 27.1818C110.568 27.9318 110.435 28.5511 110.168 29.0398C109.906 29.5284 109.56 29.9148 109.128 30.1989C108.702 30.483 108.239 30.6932 107.739 30.8295V31C108.273 31.0341 108.81 31.2216 109.349 31.5625C109.889 31.9034 110.341 32.392 110.705 33.0284C111.068 33.6648 111.25 34.4432 111.25 35.3636C111.25 36.2386 111.051 37.0256 110.653 37.7244C110.256 38.4233 109.628 38.9773 108.77 39.3864C107.912 39.7955 106.795 40 105.42 40H99.1136ZM101.227 38.125H105.42C106.801 38.125 107.781 37.858 108.361 37.3239C108.946 36.7841 109.239 36.1307 109.239 35.3636C109.239 34.7727 109.088 34.2273 108.787 33.7273C108.486 33.2216 108.057 32.8182 107.5 32.517C106.943 32.2102 106.284 32.0568 105.523 32.0568H101.227V38.125ZM101.227 30.2159H105.148C105.784 30.2159 106.358 30.0909 106.869 29.8409C107.386 29.5909 107.795 29.2386 108.097 28.7841C108.403 28.3295 108.557 27.7955 108.557 27.1818C108.557 26.4148 108.29 25.7642 107.756 25.2301C107.222 24.6903 106.375 24.4205 105.216 24.4205H101.227V30.2159ZM122.7 34.6477V26.9091H124.712V40H122.7V37.7841H122.564C122.257 38.4489 121.78 39.0142 121.132 39.4801C120.484 39.9403 119.666 40.1705 118.678 40.1705C117.859 40.1705 117.132 39.9915 116.496 39.6335C115.859 39.2699 115.359 38.7244 114.996 37.9972C114.632 37.2642 114.45 36.3409 114.45 35.2273V26.9091H116.462V35.0909C116.462 36.0455 116.729 36.8068 117.263 37.375C117.803 37.9432 118.49 38.2273 119.325 38.2273C119.825 38.2273 120.334 38.0994 120.851 37.8438C121.374 37.5881 121.811 37.196 122.163 36.6676C122.521 36.1392 122.7 35.4659 122.7 34.6477ZM128.668 40V22.5455H130.68V28.9886H130.85C130.998 28.7614 131.202 28.4716 131.464 28.1193C131.731 27.7614 132.112 27.4432 132.606 27.1648C133.106 26.8807 133.782 26.7386 134.634 26.7386C135.737 26.7386 136.708 27.0142 137.549 27.5653C138.39 28.1165 139.046 28.8977 139.518 29.9091C139.989 30.9205 140.225 32.1136 140.225 33.4886C140.225 34.875 139.989 36.0767 139.518 37.0938C139.046 38.1051 138.393 38.8892 137.558 39.446C136.722 39.9972 135.759 40.2727 134.668 40.2727C133.827 40.2727 133.154 40.1335 132.648 39.8551C132.143 39.571 131.754 39.25 131.481 38.892C131.208 38.5284 130.998 38.2273 130.85 37.9886H130.612V40H128.668ZM130.646 33.4545C130.646 34.4432 130.79 35.3153 131.08 36.071C131.37 36.821 131.793 37.4091 132.35 37.8352C132.907 38.2557 133.589 38.4659 134.396 38.4659C135.237 38.4659 135.938 38.2443 136.501 37.8011C137.069 37.3523 137.495 36.75 137.779 35.9943C138.069 35.233 138.214 34.3864 138.214 33.4545C138.214 32.5341 138.072 31.7045 137.788 30.9659C137.509 30.2216 137.086 29.6335 136.518 29.2017C135.955 28.7642 135.248 28.5455 134.396 28.5455C133.577 28.5455 132.89 28.7528 132.333 29.1676C131.776 29.5767 131.356 30.1506 131.072 30.8892C130.788 31.6222 130.646 32.4773 130.646 33.4545ZM143.575 40V22.5455H145.586V28.9886H145.756C145.904 28.7614 146.109 28.4716 146.37 28.1193C146.637 27.7614 147.018 27.4432 147.512 27.1648C148.012 26.8807 148.688 26.7386 149.54 26.7386C150.643 26.7386 151.614 27.0142 152.455 27.5653C153.296 28.1165 153.952 28.8977 154.424 29.9091C154.896 30.9205 155.131 32.1136 155.131 33.4886C155.131 34.875 154.896 36.0767 154.424 37.0938C153.952 38.1051 153.299 38.8892 152.464 39.446C151.629 39.9972 150.665 40.2727 149.575 40.2727C148.734 40.2727 148.06 40.1335 147.555 39.8551C147.049 39.571 146.66 39.25 146.387 38.892C146.114 38.5284 145.904 38.2273 145.756 37.9886H145.518V40H143.575ZM145.552 33.4545C145.552 34.4432 145.697 35.3153 145.987 36.071C146.276 36.821 146.7 37.4091 147.256 37.8352C147.813 38.2557 148.495 38.4659 149.302 38.4659C150.143 38.4659 150.844 38.2443 151.407 37.8011C151.975 37.3523 152.401 36.75 152.685 35.9943C152.975 35.233 153.12 34.3864 153.12 33.4545C153.12 32.5341 152.978 31.7045 152.694 30.9659C152.415 30.2216 151.992 29.6335 151.424 29.2017C150.862 28.7642 150.154 28.5455 149.302 28.5455C148.484 28.5455 147.796 28.7528 147.239 29.1676C146.683 29.5767 146.262 30.1506 145.978 30.8892C145.694 31.6222 145.552 32.4773 145.552 33.4545ZM160.219 22.5455V40H158.208V22.5455H160.219ZM169.392 40.2727C168.131 40.2727 167.043 39.9943 166.128 39.4375C165.219 38.875 164.517 38.0909 164.023 37.0852C163.534 36.0739 163.29 34.8977 163.29 33.5568C163.29 32.2159 163.534 31.0341 164.023 30.0114C164.517 28.983 165.205 28.1818 166.085 27.608C166.972 27.0284 168.006 26.7386 169.188 26.7386C169.869 26.7386 170.543 26.8523 171.207 27.0795C171.872 27.3068 172.477 27.6761 173.023 28.1875C173.568 28.6932 174.003 29.3636 174.327 30.1989C174.651 31.0341 174.812 32.0625 174.812 33.2841V34.1364H164.722V32.3977H172.767C172.767 31.6591 172.619 31 172.324 30.4205C172.034 29.8409 171.619 29.3835 171.08 29.0483C170.545 28.7131 169.915 28.5455 169.188 28.5455C168.386 28.5455 167.693 28.7443 167.108 29.142C166.528 29.5341 166.082 30.0455 165.77 30.6761C165.457 31.3068 165.301 31.983 165.301 32.7045V33.8636C165.301 34.8523 165.472 35.6903 165.812 36.3778C166.159 37.0597 166.639 37.5795 167.253 37.9375C167.866 38.2898 168.58 38.4659 169.392 38.4659C169.92 38.4659 170.398 38.392 170.824 38.2443C171.256 38.0909 171.628 37.8636 171.94 37.5625C172.253 37.2557 172.494 36.875 172.665 36.4205L174.608 36.9659C174.403 37.625 174.06 38.2045 173.577 38.7045C173.094 39.1989 172.497 39.5852 171.787 39.8636C171.077 40.1364 170.278 40.2727 169.392 40.2727ZM183.156 45.1818C182.185 45.1818 181.349 45.0568 180.651 44.8068C179.952 44.5625 179.369 44.2386 178.903 43.8352C178.443 43.4375 178.077 43.0114 177.804 42.5568L179.406 41.4318C179.588 41.6705 179.818 41.9432 180.097 42.25C180.375 42.5625 180.756 42.8324 181.239 43.0597C181.727 43.2926 182.366 43.4091 183.156 43.4091C184.213 43.4091 185.085 43.1534 185.773 42.642C186.46 42.1307 186.804 41.3295 186.804 40.2386V37.5795H186.634C186.486 37.8182 186.276 38.1136 186.003 38.4659C185.736 38.8125 185.349 39.1222 184.844 39.3949C184.344 39.6619 183.668 39.7955 182.815 39.7955C181.759 39.7955 180.81 39.5455 179.969 39.0455C179.134 38.5455 178.472 37.8182 177.983 36.8636C177.5 35.9091 177.259 34.75 177.259 33.3864C177.259 32.0455 177.494 30.8778 177.966 29.8835C178.438 28.8835 179.094 28.1108 179.935 27.5653C180.776 27.0142 181.747 26.7386 182.849 26.7386C183.702 26.7386 184.378 26.8807 184.878 27.1648C185.384 27.4432 185.77 27.7614 186.037 28.1193C186.31 28.4716 186.52 28.7614 186.668 28.9886H186.872V26.9091H188.815V40.375C188.815 41.5 188.56 42.4148 188.048 43.1193C187.543 43.8295 186.861 44.3494 186.003 44.679C185.151 45.0142 184.202 45.1818 183.156 45.1818ZM183.088 37.9886C183.895 37.9886 184.577 37.804 185.134 37.4347C185.69 37.0653 186.114 36.5341 186.403 35.8409C186.693 35.1477 186.838 34.3182 186.838 33.3523C186.838 32.4091 186.696 31.5767 186.412 30.8551C186.128 30.1335 185.707 29.5682 185.151 29.1591C184.594 28.75 183.906 28.5455 183.088 28.5455C182.236 28.5455 181.526 28.7614 180.957 29.1932C180.395 29.625 179.972 30.2045 179.688 30.9318C179.409 31.6591 179.27 32.4659 179.27 33.3523C179.27 34.2614 179.412 35.0653 179.696 35.7642C179.986 36.4574 180.412 37.0028 180.974 37.4006C181.543 37.7926 182.247 37.9886 183.088 37.9886ZM200.747 34.6477V26.9091H202.759V40H200.747V37.7841H200.611C200.304 38.4489 199.827 39.0142 199.179 39.4801C198.531 39.9403 197.713 40.1705 196.724 40.1705C195.906 40.1705 195.179 39.9915 194.543 39.6335C193.906 39.2699 193.406 38.7244 193.043 37.9972C192.679 37.2642 192.497 36.3409 192.497 35.2273V26.9091H194.509V35.0909C194.509 36.0455 194.776 36.8068 195.31 37.375C195.849 37.9432 196.537 38.2273 197.372 38.2273C197.872 38.2273 198.381 38.0994 198.898 37.8438C199.42 37.5881 199.858 37.196 200.21 36.6676C200.568 36.1392 200.747 35.4659 200.747 34.6477ZM206.442 40V26.9091H208.386V28.9545H208.556C208.829 28.2557 209.269 27.7131 209.877 27.3267C210.485 26.9347 211.215 26.7386 212.067 26.7386C212.931 26.7386 213.65 26.9347 214.224 27.3267C214.803 27.7131 215.255 28.2557 215.579 28.9545H215.715C216.05 28.2784 216.553 27.7415 217.224 27.3438C217.894 26.9403 218.698 26.7386 219.636 26.7386C220.806 26.7386 221.763 27.1051 222.508 27.8381C223.252 28.5653 223.624 29.6989 223.624 31.2386V40H221.613V31.2386C221.613 30.2727 221.349 29.5824 220.82 29.1676C220.292 28.7528 219.67 28.5455 218.954 28.5455C218.033 28.5455 217.32 28.8239 216.815 29.3807C216.309 29.9318 216.056 30.6307 216.056 31.4773V40H214.011V31.0341C214.011 30.2898 213.769 29.6903 213.286 29.2358C212.803 28.7756 212.181 28.5455 211.42 28.5455C210.897 28.5455 210.408 28.6847 209.954 28.9631C209.505 29.2415 209.141 29.6278 208.863 30.1222C208.59 30.6108 208.454 31.1761 208.454 31.8182V40H206.442ZM233.37 24.4205V22.5455H246.461V24.4205H240.972V40H238.859V24.4205H233.37ZM248.091 40V26.9091H250.034V28.8864H250.17C250.409 28.2386 250.841 27.7131 251.466 27.3097C252.091 26.9062 252.795 26.7045 253.58 26.7045C253.727 26.7045 253.912 26.7074 254.134 26.7131C254.355 26.7187 254.523 26.7273 254.636 26.7386V28.7841C254.568 28.767 254.412 28.7415 254.168 28.7074C253.929 28.6676 253.676 28.6477 253.409 28.6477C252.773 28.6477 252.205 28.7812 251.705 29.0483C251.21 29.3097 250.818 29.6733 250.528 30.1392C250.244 30.5994 250.102 31.125 250.102 31.7159V40H248.091ZM262.111 40.2727C260.849 40.2727 259.761 39.9943 258.847 39.4375C257.938 38.875 257.236 38.0909 256.741 37.0852C256.253 36.0739 256.009 34.8977 256.009 33.5568C256.009 32.2159 256.253 31.0341 256.741 30.0114C257.236 28.983 257.923 28.1818 258.804 27.608C259.69 27.0284 260.724 26.7386 261.906 26.7386C262.588 26.7386 263.261 26.8523 263.926 27.0795C264.591 27.3068 265.196 27.6761 265.741 28.1875C266.287 28.6932 266.722 29.3636 267.045 30.1989C267.369 31.0341 267.531 32.0625 267.531 33.2841V34.1364H257.44V32.3977H265.486C265.486 31.6591 265.338 31 265.043 30.4205C264.753 29.8409 264.338 29.3835 263.798 29.0483C263.264 28.7131 262.634 28.5455 261.906 28.5455C261.105 28.5455 260.412 28.7443 259.827 29.142C259.247 29.5341 258.801 30.0455 258.489 30.6761C258.176 31.3068 258.02 31.983 258.02 32.7045V33.8636C258.02 34.8523 258.19 35.6903 258.531 36.3778C258.878 37.0597 259.358 37.5795 259.972 37.9375C260.585 38.2898 261.298 38.4659 262.111 38.4659C262.639 38.4659 263.116 38.392 263.543 38.2443C263.974 38.0909 264.347 37.8636 264.659 37.5625C264.972 37.2557 265.213 36.875 265.384 36.4205L267.327 36.9659C267.122 37.625 266.778 38.2045 266.295 38.7045C265.813 39.1989 265.216 39.5852 264.506 39.8636C263.795 40.1364 262.997 40.2727 262.111 40.2727ZM276.08 40.2727C274.818 40.2727 273.73 39.9943 272.815 39.4375C271.906 38.875 271.205 38.0909 270.71 37.0852C270.222 36.0739 269.977 34.8977 269.977 33.5568C269.977 32.2159 270.222 31.0341 270.71 30.0114C271.205 28.983 271.892 28.1818 272.773 27.608C273.659 27.0284 274.693 26.7386 275.875 26.7386C276.557 26.7386 277.23 26.8523 277.895 27.0795C278.56 27.3068 279.165 27.6761 279.71 28.1875C280.256 28.6932 280.69 29.3636 281.014 30.1989C281.338 31.0341 281.5 32.0625 281.5 33.2841V34.1364H271.409V32.3977H279.455C279.455 31.6591 279.307 31 279.011 30.4205C278.722 29.8409 278.307 29.3835 277.767 29.0483C277.233 28.7131 276.602 28.5455 275.875 28.5455C275.074 28.5455 274.381 28.7443 273.795 29.142C273.216 29.5341 272.77 30.0455 272.457 30.6761C272.145 31.3068 271.989 31.983 271.989 32.7045V33.8636C271.989 34.8523 272.159 35.6903 272.5 36.3778C272.847 37.0597 273.327 37.5795 273.94 37.9375C274.554 38.2898 275.267 38.4659 276.08 38.4659C276.608 38.4659 277.085 38.392 277.511 38.2443C277.943 38.0909 278.315 37.8636 278.628 37.5625C278.94 37.2557 279.182 36.875 279.352 36.4205L281.295 36.9659C281.091 37.625 280.747 38.2045 280.264 38.7045C279.781 39.1989 279.185 39.5852 278.474 39.8636C277.764 40.1364 276.966 40.2727 276.08 40.2727Z"
          fill="#F7FEE7"
        />
        <rect
          x="73"
          y="1"
          width="234"
          height="61"
          rx="19"
          stroke="url(#paint0_linear_1209_70)"
          strokeWidth="2"
        />
        <rect
          x="51"
          y="94"
          width="78"
          height="35"
          rx="17.5"
          fill="#043303"
          fillOpacity="0.38"
        />
        <rect
          x="51"
          y="94"
          width="78"
          height="35"
          rx="17.5"
          stroke="url(#paint1_linear_1209_70)"
          strokeWidth="2"
        />
        <rect
          x="101"
          y="151"
          width="78"
          height="35"
          rx="17.5"
          fill="#043303"
          fillOpacity="0.38"
        />
        <rect
          x="101"
          y="151"
          width="78"
          height="35"
          rx="17.5"
          stroke="url(#paint2_linear_1209_70)"
          strokeWidth="2"
        />
        <rect
          x="1"
          y="151"
          width="78"
          height="35"
          rx="17.5"
          fill="#043303"
          fillOpacity="0.38"
        />
        <rect
          x="1"
          y="151"
          width="78"
          height="35"
          rx="17.5"
          stroke="url(#paint3_linear_1209_70)"
          strokeWidth="2"
        />
        <rect
          x="251"
          y="94"
          width="78"
          height="35"
          rx="17.5"
          fill="#05334D"
          fillOpacity="0.38"
        />
        <rect
          x="251"
          y="94"
          width="78"
          height="35"
          rx="17.5"
          stroke="url(#paint4_linear_1209_70)"
          strokeWidth="2"
        />
        <rect
          x="201"
          y="151"
          width="78"
          height="35"
          rx="17.5"
          fill="#05334D"
          fillOpacity="0.38"
        />
        <rect
          x="201"
          y="151"
          width="78"
          height="35"
          rx="17.5"
          stroke="url(#paint5_linear_1209_70)"
          strokeWidth="2"
        />
        <rect
          x="301"
          y="151"
          width="78"
          height="35"
          rx="17.5"
          fill="#043303"
          fillOpacity="0.38"
        />
        <rect
          x="301"
          y="151"
          width="78"
          height="35"
          rx="17.5"
          stroke="url(#paint6_linear_1209_70)"
          strokeWidth="2"
        />
        <path
          d="M217.761 176V161.455H219.523V167.932H227.278V161.455H229.04V176H227.278V169.494H219.523V176H217.761ZM235.549 176.256C234.858 176.256 234.23 176.125 233.667 175.865C233.103 175.6 232.656 175.219 232.325 174.722C231.993 174.22 231.827 173.614 231.827 172.903C231.827 172.278 231.951 171.772 232.197 171.384C232.443 170.991 232.772 170.683 233.184 170.46C233.596 170.238 234.05 170.072 234.548 169.963C235.049 169.849 235.554 169.759 236.06 169.693C236.723 169.608 237.261 169.544 237.673 169.501C238.089 169.454 238.392 169.376 238.582 169.267C238.776 169.158 238.873 168.969 238.873 168.699V168.642C238.873 167.941 238.681 167.397 238.298 167.009C237.919 166.62 237.344 166.426 236.572 166.426C235.772 166.426 235.144 166.601 234.69 166.952C234.235 167.302 233.915 167.676 233.731 168.074L232.14 167.506C232.424 166.843 232.803 166.327 233.276 165.957C233.754 165.583 234.275 165.323 234.839 165.176C235.407 165.025 235.966 164.949 236.515 164.949C236.865 164.949 237.268 164.991 237.722 165.077C238.182 165.157 238.624 165.325 239.05 165.581C239.481 165.837 239.839 166.223 240.123 166.739C240.407 167.255 240.549 167.946 240.549 168.812V176H238.873V174.523H238.788C238.674 174.759 238.485 175.013 238.219 175.283C237.954 175.553 237.602 175.782 237.161 175.972C236.721 176.161 236.183 176.256 235.549 176.256ZM235.805 174.75C236.468 174.75 237.026 174.62 237.481 174.359C237.94 174.099 238.286 173.763 238.518 173.351C238.754 172.939 238.873 172.506 238.873 172.051V170.517C238.802 170.602 238.646 170.68 238.404 170.751C238.167 170.818 237.893 170.877 237.58 170.929C237.272 170.976 236.972 171.019 236.678 171.057C236.389 171.09 236.155 171.118 235.975 171.142C235.54 171.199 235.132 171.291 234.754 171.419C234.379 171.542 234.076 171.729 233.844 171.98C233.617 172.226 233.504 172.562 233.504 172.989C233.504 173.571 233.719 174.011 234.15 174.31C234.585 174.603 235.137 174.75 235.805 174.75ZM251.336 167.534L249.83 167.96C249.735 167.709 249.596 167.465 249.411 167.229C249.231 166.987 248.985 166.788 248.672 166.632C248.36 166.476 247.96 166.398 247.472 166.398C246.804 166.398 246.248 166.552 245.803 166.859C245.363 167.162 245.142 167.548 245.142 168.017C245.142 168.434 245.294 168.763 245.597 169.004C245.9 169.246 246.373 169.447 247.017 169.608L248.637 170.006C249.612 170.242 250.339 170.605 250.817 171.092C251.295 171.575 251.534 172.198 251.534 172.96C251.534 173.585 251.355 174.144 250.995 174.636C250.64 175.129 250.142 175.517 249.503 175.801C248.864 176.085 248.121 176.227 247.273 176.227C246.16 176.227 245.239 175.986 244.51 175.503C243.781 175.02 243.319 174.314 243.125 173.386L244.716 172.989C244.868 173.576 245.154 174.016 245.576 174.31C246.002 174.603 246.558 174.75 247.245 174.75C248.026 174.75 248.646 174.584 249.105 174.253C249.569 173.917 249.801 173.514 249.801 173.045C249.801 172.667 249.669 172.349 249.404 172.094C249.139 171.833 248.731 171.639 248.182 171.511L246.364 171.085C245.365 170.848 244.631 170.482 244.162 169.984C243.698 169.482 243.466 168.855 243.466 168.102C243.466 167.487 243.639 166.942 243.985 166.469C244.335 165.995 244.811 165.624 245.412 165.354C246.018 165.084 246.705 164.949 247.472 164.949C248.551 164.949 249.399 165.186 250.015 165.659C250.635 166.133 251.075 166.758 251.336 167.534ZM255.734 169.438V176H254.058V161.455H255.734V166.795H255.876C256.131 166.232 256.515 165.785 257.026 165.453C257.542 165.117 258.229 164.949 259.086 164.949C259.829 164.949 260.48 165.098 261.039 165.396C261.598 165.69 262.031 166.142 262.339 166.753C262.651 167.359 262.808 168.131 262.808 169.068V176H261.131V169.182C261.131 168.315 260.906 167.645 260.457 167.172C260.012 166.694 259.394 166.455 258.603 166.455C258.054 166.455 257.561 166.571 257.126 166.803C256.695 167.035 256.354 167.373 256.103 167.818C255.857 168.263 255.734 168.803 255.734 169.438Z"
          fill="#F7FEE7"
        />
        <path
          d="M233.295 223.455V238H231.591L223.665 226.58H223.523V238H221.761V223.455H223.466L231.42 234.903H231.562V223.455H233.295ZM236.82 238V223.455H245.542V225.017H238.581V229.932H244.888V231.494H238.581V238H236.82ZM247.763 225.017V223.455H258.672V225.017H254.098V238H252.337V225.017H247.763Z"
          fill="#F7FEE7"
        />
        <path
          d="M240.53 192.47C240.237 192.177 239.763 192.177 239.47 192.47L234.697 197.243C234.404 197.536 234.404 198.01 234.697 198.303C234.99 198.596 235.464 198.596 235.757 198.303L240 194.061L244.243 198.303C244.536 198.596 245.01 198.596 245.303 198.303C245.596 198.01 245.596 197.536 245.303 197.243L240.53 192.47ZM239.25 193L239.25 216L240.75 216L240.75 193L239.25 193Z"
          fill="#1794CB"
        />
        <defs>
          <linearGradient
            id="paint0_linear_1209_70"
            x1="190"
            y1="0"
            x2="190"
            y2="63"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#84CC16" />
            <stop offset="1" stopColor="#16A34A" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_1209_70"
            x1="90"
            y1="93"
            x2="90"
            y2="130"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#84CC16" />
            <stop offset="1" stopColor="#16A34A" />
          </linearGradient>
          <linearGradient
            id="paint2_linear_1209_70"
            x1="140"
            y1="150"
            x2="140"
            y2="187"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#84CC16" />
            <stop offset="1" stopColor="#16A34A" />
          </linearGradient>
          <linearGradient
            id="paint3_linear_1209_70"
            x1="40"
            y1="150"
            x2="40"
            y2="187"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#84CC16" />
            <stop offset="1" stopColor="#16A34A" />
          </linearGradient>
          <linearGradient
            id="paint4_linear_1209_70"
            x1="290"
            y1="93"
            x2="290"
            y2="130"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#1695CC" />
            <stop offset="1" stopColor="#164EA3" />
          </linearGradient>
          <linearGradient
            id="paint5_linear_1209_70"
            x1="240"
            y1="150"
            x2="240"
            y2="187"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#1695CC" />
            <stop offset="1" stopColor="#164EA3" />
          </linearGradient>
          <linearGradient
            id="paint6_linear_1209_70"
            x1="340"
            y1="150"
            x2="340"
            y2="187"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#84CC16" />
            <stop offset="1" stopColor="#16A34A" />
          </linearGradient>
        </defs>
      </svg>
    </BaseHero>
  )
}
