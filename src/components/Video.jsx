function Video({ src, classes }) {
  return (
    <div
      className={classes}
      style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}
    >
      <video
        src={src}
        className="aspect-video w-full"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
        }}
        controls
        playsInline
        preload="metadata"
      />
    </div>
  )
}

export default Video
