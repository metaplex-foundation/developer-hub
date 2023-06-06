import { Tag } from '@markdoc/markdoc'

export function transformNodeTag(node, config) {
  const attributes = node.transformAttributes(config)
  const allChildren = node.transformChildren(config)
  const children = allChildren.filter((child) => child.name !== 'NodeSection')

  const sections = allChildren
    .filter((child) => child.name === 'NodeSection')
    .map((child) => ({ ...child.attributes, children: child.children }))

  return new Tag(this.render, { ...attributes, sections }, children)
}
