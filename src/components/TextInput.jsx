import React from 'react'

export default function TextInput({ value, onChange, onDragStart }) {
  const handleDragStart = (e) => {
    const selectedText = window.getSelection().toString() || value
    if (selectedText.trim()) {
      e.dataTransfer.effectAllowed = 'copy'
      e.dataTransfer.setData('text/plain', selectedText)
      onDragStart(selectedText)
    }
  }

  return (
    <div className="text-input-section">
      <h3>✏️ พิมพ์ข้อความ</h3>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onDragStart={handleDragStart}
        draggable
        placeholder="พิมพ์ข้อความที่นี่ แล้วลากไปวางที่โหนดต้นไม้"
      />
      <div className="drag-hint">
        💡 ลากข้อความจากที่นี่ไปวางที่โหนดต้นไม้เพื่อสร้างบันทึก
      </div>
    </div>
  )
}
