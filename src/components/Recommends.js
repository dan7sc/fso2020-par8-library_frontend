import React, { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { FAVORITE_GENRE} from '../queries'

const Recommends = ({ show, books }) => {
  const [genre, setGenre] = useState(null)
  const result = useQuery(FAVORITE_GENRE)

  useEffect(() => {
    if (result.data) {
      setGenre(result.data.me.favoriteGenre)
    }
  }, [result])

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
          {books.filter(book => book.genres.includes(genre))
           .map(book => (
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
