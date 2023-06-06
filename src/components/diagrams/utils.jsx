export function LabelOrChildren({ data }) {
  if (data.label) return <>{data.label}</>
  return (
    <>
      {data.children.map((child, index) => ({
        ...child,
        key: index.toString(36),
      }))}
    </>
  )
}

export function hasLabelOrChildren(data) {
  return data.children?.length > 0 || data.label
}
