import React, { useState } from 'react'
import CommentsList from './CommentsList'

export default function NoteCard({ note, onAddComment, onRemoveNote }) {
  const [newComment, setNewComment] = useState('')
  const [showCommentForm, setShowCommentForm] = useState(false)

  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment(note.id, newComment)
      setNewComment('')
    }
  }

  return (
    <div className="note-card">
      <div className="note-header">
        <div className="note-title">📝 บันทึก</div>
        <button
          className="note-remove-btn"
          onClick={() => onRemoveNote(note.id)}
        >
          ลบ
        </button>
      </div>
      <div className="note-content">{note.content}</div>
      <div className="note-info">
        <span className="note-node-label">📍 {note.nodeLabel}</span>
        <span style={{ fontSize: '11px', color: '#a0826d' }}>
          {note.timestamp}
        </span>
      </div>

      <div className="comments-section">
        <div className="comments-title">💬 ความเห็น ({note.comments.length})</div>

        <CommentsList comments={note.comments} />

        {!showCommentForm && (
          <button
            onClick={() => setShowCommentForm(true)}
            style={{
              background: 'transparent',
              color: '#3498db',
              border: 'none',
              cursor: 'pointer',
              fontSize: '12px',
              marginTop: '8px',
              textDecoration: 'underline'
            }}
          >
            เพิ่มความเห็น
          </button>
        )}

        {showCommentForm && (
          <div className="comment-form">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="พิมพ์ความเห็น..."
              className="comment-input"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddComment()
              }}
              autoFocus
            />
            <button
              onClick={handleAddComment}
              className="comment-btn"
            >
              ส่ง
            </button>
            <button
              onClick={() => {
                setShowCommentForm(false)
                setNewComment('')
              }}
              style={{
                background: '#95a5a6',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                padding: '6px 12px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              ยกเลิก
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
