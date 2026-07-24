import React, { useState } from 'react'
import TreeNode from './TreeNode'

export default function TreeView({ node, onToggle, onDrop, draggedText, onAddNode }) {
  const [dragOverId, setDragOverId] = useState(null)

  return (
    <div className="tree-drop-zone" style={{
      borderColor: dragOverId ? '#3498db' : '#bdc3c7',
      background: dragOverId ? '#e3f2fd' : '#fafafa'
    }}>
      <TreeNode
        node={node}
        onToggle={onToggle}
        onDrop={onDrop}
        draggedText={draggedText}
        setDragOverId={setDragOverId}
        onAddNode={onAddNode}
      />
    </div>
  )
}
