import React, { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { LOGIN } from '../queries'
import ErrorNotification from './ErrorNotification'

const LoginForm = ({ show, setToken, setPage }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      setError(error.message)
      setTimeout(() => {
        setError(null)
      }, 5000)
    }
  })

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value
      setToken(token)
      localStorage.setItem('libraryapp-user-token', token)
      setPage('authors')
    }
  }, [result.data, setToken, setPage])

  if (!show) {
    return null
  }

  const submit = (event) => {
    event.preventDefault()

    const credentials = { username, password }

    setUsername('')
    setPassword('')

    login({
      variables: { ...credentials }
    })
  }

  return (
    <div>
      <ErrorNotification message={error} />
      <form onSubmit={submit}>
        <div>
          username
          <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type='password'
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
  )
}

export default LoginForm
