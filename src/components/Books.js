import React, { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS} from '../queries'

const Books = (props) => {
  const [books, setBooks] = useState([])
  const [genre, setGenre] = useState('all genres')
  const [topTenGenres, setTopTenGenres] = useState([])
  const result = useQuery(ALL_BOOKS)

  useEffect(() => {
    if (result.data) {
      setBooks(result.data.allBooks)
      setTopTenGenres(
        getTopTenGenres(result.data.allBooks)
      )
    }
  }, [result])

  const getTopTenGenres = (books) => {
    const allGenres = {}
    books.forEach(book => {
      book.genres.forEach(genre => {
        if (!allGenres.hasOwnProperty(genre)) {
          allGenres[genre] = 1
        } else {
          allGenres[genre] += 1
        }
      })
    })
    const sortedGenres = Object.keys(allGenres).sort((first, second) => (
      allGenres[second] - allGenres[first]
    ))
    const topTen = sortedGenres.slice(0, 10)
    topTen.push('all genres')
    return topTen
  }

  const handleGenre = (event) => {
    const genre = event.target.value
    setGenre(genre)
  }

  if (!props.show) {
    return null
  }

  if (result.loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h2>books</h2>
      <div>in genre <b>{genre}</b></div>
      <br />
      <div>
        {topTenGenres.map(genre => (
          <button
            key={genre}
            value={genre}
            onClick={handleGenre}>
            {genre}
          </button>
        ))}
      </div>
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
          {genre !== 'all genres'
           ? books.filter(book => book.genres.includes(genre))
           .map(book => (
             <tr key={book.title}>
               <td>{book.title}</td>
               <td>{book.author.name}</td>
               <td>{book.published}</td>
             </tr>
           ))
           : books.map(book => (
             <tr key={book.title}>
               <td>{book.title}</td>
               <td>{book.author.name}</td>
               <td>{book.published}</td>
             </tr>
           ))}
        </tbody>
      </table>
    </div>
  )
}

export default Books
