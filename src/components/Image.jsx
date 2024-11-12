const Image = ({ src, alt, classes }) => {
  return (
    <div className="image">
      <img className={classes} src={src} />
    </div>
  )
}

export default Image
