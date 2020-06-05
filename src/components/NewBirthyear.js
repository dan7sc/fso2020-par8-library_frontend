import React, { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { EDIT_BIRTHYEAR, ALL_AUTHORS } from '../queries'
import ErrorNotification from './ErrorNotification'

const NewBirthyear = ({ authors }) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')
  const [error, setError] = useState(null)

  const [ changeBirthyear, result ] = useMutation(EDIT_BIRTHYEAR, {
    onError: (error) => {
      setError(error.message)
      setTimeout(() => {
        setError(null)
      }, 5000)
    },
    update: (store, response) => {
      const dataInStore = store.readQuery({ query: ALL_AUTHORS })
      store.writeQuery({
        query: ALL_AUTHORS,
        data: {
          ...dataInStore,
          allAuthors: [ ...dataInStore.allAuthors, response.data.editAuthor ]
        }
      })
    }
  })

  useEffect(() => {
    if (result.data && !result.data.editAuthor) {
      setError('Author not found')
      setTimeout(() => {
        setError(null)
      }, 5000)
    }
  }, [result.data])

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
          <select value={name} onChange={({ target }) => setName(target.value)}>
            <option key='choose option' value=''>-- Please choose an option --</option>
            {authors.map(author => (
              <option key={author.name} value={author.name}>{author.name}</option>
            ))}
          </select>
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
