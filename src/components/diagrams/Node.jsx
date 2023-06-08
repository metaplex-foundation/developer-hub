import { Tag } from '@markdoc/markdoc'

export function transformNodeTag(node, config) {
  const attributes = node.transformAttributes(config)
  const allChildren = node.transformChildren(config)
  const children = allChildren.filter(
    (child) => child.name !== 'NodeSection' && child.name !== 'Node'
  )

  const sections = allChildren
    .filter((child) => child.name === 'NodeSection')
    .map((child) => ({ ...child.attributes, content: child.children }))
  const treeNodes = allChildren.filter((child) => child.name === 'Node')

  return new Tag(
    this.render,
    { ...attributes, sections, children: treeNodes },
    children
  )
}
