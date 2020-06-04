import React, { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { FAVORITE_GENRE, BOOKS_BY_GENRE } from '../queries'

const Recommends = ({ show, favoriteGenre }) => {
  const [books, setBooks] = useState([])
  const [genre, setGenre] = useState(null)
  const result = useQuery(FAVORITE_GENRE)
  const response = useQuery(BOOKS_BY_GENRE, {
    variables: { genre },
    skip: !genre
  })

  useEffect(() => {
    if (result.data) {
      setGenre(result.data.me.favoriteGenre)
    }
    if (response.data) {
      setBooks(response.data.allBooks)
    }
  }, [result.data, response.data])

  if (!show) {
    return null
  }

  if (result.loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h2>recommendations</h2>
      <div>books in your favorite genre <b>{genre}</b></div>
      <br />
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {books.map(book => (
            <tr key={book.title}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))
          }
        </tbody>
      </table>
    </div>
  )
}

export default Recommends
