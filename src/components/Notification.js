import React from 'react'

const Notification = ({ message }) => {
  const style = {
    color: 'springgreen',
    background: '#333333',
    padding: '10px',
  }

  if (!message) {
    return null
  }

  return <div style={style}>{message}</div>
}

export default Notification
