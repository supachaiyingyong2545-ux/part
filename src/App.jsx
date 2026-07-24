import React, { useState } from 'react'
import TreeView from './components/TreeView'
import TextInput from './components/TextInput'
import NotesPanel from './components/NotesPanel'

export default function App() {
  const [textInput, setTextInput] = useState('')
  const [draggedText, setDraggedText] = useState('')

  const [treeData, setTreeData] = useState({
    id: 'root',
    label: 'ต้นไม้',
    expanded: true,
    children: [
      {
        id: 'branch1',
        label: 'กิ่งที่ 1',
        expanded: false,
        children: [
          { id: 'leaf1', label: 'ใบไม้ 1', expanded: false, children: [] },
          { id: 'leaf2', label: 'ใบไม้ 2', expanded: false, children: [] }
        ]
      },
      {
        id: 'branch2',
        label: 'กิ่งที่ 2',
        expanded: false,
        children: [
          { id: 'leaf3', label: 'ใบไม้ 3', expanded: false, children: [] }
        ]
      }
    ]
  })

  const [notes, setNotes] = useState([])

  const handleAddNode = (parentId, label) => {
    setTreeData(prev => addNodeToTree(prev, parentId, label))
  }

  const addNodeToTree = (node, parentId, label) => {
    if (node.id === parentId) {
      return {
        ...node,
        children: [...node.children, {
          id: `node-${Date.now()}`,
          label,
          expanded: false,
          children: []
        }]
      }
    }
    return {
      ...node,
      children: node.children.map(child => addNodeToTree(child, parentId, label))
    }
  }

  const handleToggleNode = (nodeId) => {
    setTreeData(prev => toggleNodeExpanded(prev, nodeId))
  }

  const toggleNodeExpanded = (node, nodeId) => {
    if (node.id === nodeId) {
      return { ...node, expanded: !node.expanded }
    }
    return {
      ...node,
      children: node.children.map(child => toggleNodeExpanded(child, nodeId))
    }
  }

  const handleDropOnNode = (nodeId, text) => {
    if (!text.trim()) return

    const node = findNodeInTree(treeData, nodeId)
    if (node) {
      const newNote = {
        id: `note-${Date.now()}`,
        nodeId,
        nodeLabel: node.label,
        content: text,
        timestamp: new Date().toLocaleString('th-TH'),
        comments: []
      }
      setNotes(prev => [newNote, ...prev])
      setTextInput('')
    }
  }

  const findNodeInTree = (node, nodeId) => {
    if (node.id === nodeId) return node
    for (let child of node.children) {
      const found = findNodeInTree(child, nodeId)
      if (found) return found
    }
    return null
  }

  const handleAddComment = (noteId, comment) => {
    setNotes(prev => prev.map(note => {
      if (note.id === noteId) {
        return {
          ...note,
          comments: [...note.comments, {
            id: `comment-${Date.now()}`,
            text: comment,
            timestamp: new Date().toLocaleString('th-TH')
          }]
        }
      }
      return note
    }))
  }

  const handleRemoveNote = (noteId) => {
    setNotes(prev => prev.filter(note => note.id !== noteId))
  }

  return (
    <div className="app-container">
      <div className="left-panel">
        <TextInput
          value={textInput}
          onChange={setTextInput}
          onDragStart={(text) => setDraggedText(text)}
        />
        <div className="tree-section">
          <h3>🌳 ต้นไม้</h3>
          <TreeView
            node={treeData}
            onToggle={handleToggleNode}
            onDrop={handleDropOnNode}
            draggedText={draggedText}
            onAddNode={handleAddNode}
          />
        </div>
      </div>
      <div className="right-panel">
        <NotesPanel
          notes={notes}
          onAddComment={handleAddComment}
          onRemoveNote={handleRemoveNote}
        />
      </div>
    </div>
  )
}
