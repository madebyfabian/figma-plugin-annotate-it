type NodeObject = {
  width: number,
  height: number,
  x: number,
  y: number
}

interface CollidableNodeObject extends NodeObject {
  id: string
}


/**
 * Returns all the nodes that would collide with the given node.
 * @param collidableNodes Array of nodes that come in question to collide with.
 * @param nodeToCheck The given node we wan't to check if it collides with anything.
 */
export default ( collidableNodes: CollidableNodeObject[], nodeToCheck: NodeObject ) => {
  return collidableNodes.filter(collidableNode => !(
    ((collidableNode.y + collidableNode.height) < (nodeToCheck.y)) ||
    (collidableNode.y > (nodeToCheck.y + nodeToCheck.height)) ||
    ((collidableNode.x + collidableNode.width) < nodeToCheck.x) ||
    (collidableNode.x > (nodeToCheck.x + nodeToCheck.width))
  ))
}