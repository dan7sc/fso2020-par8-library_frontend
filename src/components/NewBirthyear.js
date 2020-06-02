import React, { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { EDIT_BIRTHYEAR, ALL_AUTHORS } from '../queries'
import ErrorNotification from './ErrorNotification'

const NewBirthyear = (props) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')
  const [error, setError] = useState(null)

  const [ changeBirthyear, result ] = useMutation(EDIT_BIRTHYEAR, {
    refetchQueries: [ { query: ALL_AUTHORS } ]
  })

  useEffect(() => {
    if (result.data && !result.data.editAuthor) {
      setError('Author not found')
      setTimeout(() => {
        setError(null)
      }, 5000)
    }
  }, [result.data])

  if (!props.show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()

    changeBirthyear({
      variables: {
        name,
        setBornTo: parseInt(born)
      }
    })

    setName('')
    setBorn('')
  }

  return (
    <div>
      <h2>Set birthyear</h2>
      <ErrorNotification message={error} />
      <form onSubmit={submit}>
        <div>
          name
          <input
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
        </div>
        <div>
          born
          <input
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type='submit'>update author</button>
      </form>
    </div>
  )
}

export default NewBirthyear
