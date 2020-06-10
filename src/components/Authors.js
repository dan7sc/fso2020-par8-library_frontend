import React, { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_AUTHORS } from '../queries'
import NewBirthyear from './NewBirthyear'

const Authors = ({ show, token }) => {
  const [authors, setAuthors] = useState([])
  const result = useQuery(ALL_AUTHORS)

  useEffect(() => {
    if (result.data) {
      setAuthors(result.data.allAuthors)
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
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {authors.map(author => (
            author ?
              <tr key={author.name}>
                <td>{author.name}</td>
                <td>{author.born}</td>
                <td>{author.bookCount}</td>
              </tr> : null
          ))}
        </tbody>
      </table>
      {token
       ? <NewBirthyear authors={authors} />
       : null
      }
    </div>
  )
}

export default Authors
