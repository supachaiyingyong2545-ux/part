import React, { useState } from 'react'

export default function TreeNode({ node, onToggle, onDrop, draggedText, setDragOverId, onAddNode }) {
  const [dragOver, setDragOver] = useState(false)
  const [addingNode, setAddingNode] = useState(false)
  const [newNodeLabel, setNewNodeLabel] = useState('')

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
    setDragOver(true)
    setDragOverId(node.id)
  }

  const handleDragLeave = (e) => {
    if (e.currentTarget === e.target) {
      setDragOver(false)
      setDragOverId(null)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(false)
    setDragOverId(null)

    const text = e.dataTransfer.getData('text/plain')
    if (text.trim()) {
      onDrop(node.id, text)
    }
  }

  const handleAddNode = () => {
    if (newNodeLabel.trim()) {
      onAddNode(node.id, newNodeLabel)
      setNewNodeLabel('')
      setAddingNode(false)
    }
  }

  const hasChildren = node.children && node.children.length > 0

  return (
    <div className="tree-node">
      <div
        className={`node-header ${dragOver ? 'drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          background: dragOver ? '#d4e6f1' : 'transparent'
        }}
      >
        {hasChildren && (
          <span
            className={`expand-icon ${node.expanded ? 'expanded' : ''}`}
            onClick={() => onToggle(node.id)}
          >
            ▶
          </span>
        )}
        {!hasChildren && <span style={{ width: '20px' }}></span>}
        <span className="node-label">{node.label}</span>
        <button
          onClick={() => setAddingNode(true)}
          style={{
            background: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            padding: '4px 8px',
            fontSize: '12px',
            cursor: 'pointer',
            marginLeft: 'auto'
          }}
        >
          + เพิ่ม
        </button>
      </div>

      {addingNode && (
        <div style={{
          display: 'flex',
          gap: '6px',
          marginLeft: '20px',
          marginTop: '8px',
          marginBottom: '8px'
        }}>
          <input
            type="text"
            value={newNodeLabel}
            onChange={(e) => setNewNodeLabel(e.target.value)}
            placeholder="ชื่อโหนด..."
            style={{
              flex: 1,
              padding: '6px 8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '12px'
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddNode()
              if (e.key === 'Escape') setAddingNode(false)
            }}
            autoFocus
          />
          <button
            onClick={handleAddNode}
            style={{
              background: '#27ae60',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              padding: '6px 12px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            บันทึก
          </button>
          <button
            onClick={() => {
              setAddingNode(false)
              setNewNodeLabel('')
            }}
            style={{
              background: '#95a5a6',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              padding: '6px 12px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            ยกเลิก
          </button>
        </div>
      )}

      {node.expanded && hasChildren && (
        <div className="node-children">
          {node.children.map(child => (
            <TreeNode
              key={child.id}
              node={child}
              onToggle={onToggle}
              onDrop={onDrop}
              draggedText={draggedText}
              setDragOverId={setDragOverId}
              onAddNode={onAddNode}
            />
          ))}
        </div>
      )}
    </div>
  )
}
