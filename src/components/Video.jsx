function Video({ src, classes, embed = false }) {
  return (
    <div
      className={classes}
      style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}
    >
      {embed ? (
        <iframe
          src={src}
          className="aspect-video w-full"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
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
      )}
    </div>
  )
}

export default Video
