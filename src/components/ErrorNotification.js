import React from 'react'

const ErrorNotification = ({ message }) => {
  const style = {
    color: 'red',
    background: '#333333',
    padding: '10px',
  }

  if (!message) {
    return null
  }

  return <div style={style}>{message}</div>
}

export default ErrorNotification
