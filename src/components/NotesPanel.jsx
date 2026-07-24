import React from 'react'
import NoteCard from './NoteCard'

export default function NotesPanel({ notes, onAddComment, onRemoveNote }) {
  return (
    <div className="notes-section">
      <h3>📋 บันทึก ({notes.length})</h3>
      {notes.length === 0 ? (
        <div className="empty-state">
          ยังไม่มีบันทึก ลากข้อความจากพื้นที่พิมพ์ไปวางที่โหนดต้นไม้เพื่อสร้างบันทึก
        </div>
      ) : (
        <div>
          {notes.map(note => (
            <NoteCard
              key={note.id}
              note={note}
              onAddComment={onAddComment}
              onRemoveNote={onRemoveNote}
            />
          ))}
        </div>
      )}
    </div>
  )
}
