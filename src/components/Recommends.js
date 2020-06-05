import React, { useState, useEffect } from 'react'
import { useQuery, useLazyQuery } from '@apollo/client'
import { FAVORITE_GENRE, BOOKS_BY_GENRE } from '../queries'

const Recommends = ({ show }) => {
  const [booksByGenre, setBooksByGenre] = useState([])
  const [genre, setGenre] = useState(null)
  const result = useQuery(FAVORITE_GENRE)
  const [getBooksByGenre, { loading, data, called, refetch } ] = useLazyQuery(BOOKS_BY_GENRE)

  useEffect(() => {
    if (result.data) {
      setGenre(result.data.me.favoriteGenre)
    }
  }, [result.data])

  useEffect(() => {
    if (data) {
      setBooksByGenre(data.allBooks)
    }
  }, [data])

  if (!show) {
    return null
  }

  if (result.loading || loading) {
    return <div>Loading...</div>
  }

  if (genre && !called) {
    getBooksByGenre({
      variables: {
        genre
      }
    })
  }

  return (
    <div>
      <h2>recommendations</h2>
      <div>books in your favorite genre <b>{genre}</b></div>
      <button onClick={() => refetch()}>refresh list</button>
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
          {booksByGenre.map(book => (
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
