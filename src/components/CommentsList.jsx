import React from 'react'

export default function CommentsList({ comments }) {
  if (comments.length === 0) {
    return null
  }

  return (
    <div>
      {comments.map(comment => (
        <div key={comment.id} className="comment">
          <div className="comment-text">{comment.text}</div>
          <div className="comment-time">{comment.timestamp}</div>
        </div>
      ))}
    </div>
  )
}
