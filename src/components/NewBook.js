import React, { useState } from 'react'
import { useMutation, useSubscription } from '@apollo/client'
import { CREATE_BOOK, ALL_AUTHORS, ALL_BOOKS, BOOK_ADDED } from '../queries'
import ErrorNotification from './ErrorNotification'
import Notification from './Notification'

const NewBook = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])
  const [error, setError] = useState(null)
  const [bookAdded, setBookAdded] = useState(null)

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const title = subscriptionData.data.bookAdded.title
      const author = subscriptionData.data.bookAdded.author.name
      const message = `Book "${title}" from "${author}" added`
      setBookAdded(message)
      setTimeout(() => {
        setBookAdded(null)
      }, 5000)
    }
  })

  const [ createBook ] = useMutation(CREATE_BOOK, {
    onError: (error) => {
      setError(error.message)
      setTimeout(() => {
        setError(null)
      }, 5000)
    },
    update: (store, response) => {
      const dataInStore = store.readQuery({ query: ALL_BOOKS })
      const authorsDataInStore = store.readQuery({ query: ALL_AUTHORS })
      store.writeQuery({
        query: ALL_BOOKS,
        data: {
          ...dataInStore,
          allBooks: [ ...dataInStore.allBooks, response.data.addBook ]
        }
      })
      store.writeQuery({
        query: ALL_AUTHORS,
        data: {
          ...authorsDataInStore,
          allAuthors: [ ...authorsDataInStore.allAuthors, response.data.addBook.author]
        }
      })
    }
  })

  if (!props.show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()

    createBook({
      variables: {
        title,
        author,
        published: parseInt(published),
        genres
      }
    })

    setTitle('')
    setAuthor('')
    setPublished('')
    setGenre('')
    setGenres([])
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <ErrorNotification message={error} />
      <Notification message={bookAdded} />
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type='number'
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          genre
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type='button'>add genre</button>
        </div>
        <div>
          genres: {genres.join(' ')}
        </div>
        <button type='submit'>create book</button>
      </form>
    </div>
  )
}

export default NewBook
