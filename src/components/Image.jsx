import { useRouter } from 'next/router'

const Image = ({ src, alt, classes }) => {
  const { basePath } = useRouter()
  const resolvedSrc = src.startsWith('/') ? `${basePath}${src}` : src
  return (
    <div className="image">
      <img className={classes} src={resolvedSrc} alt={alt} />
    </div>
  )
}

export default Image
