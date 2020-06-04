import React, { useState, useEffect } from 'react'
import { useApolloClient } from '@apollo/client'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Recommends from './components/Recommends'

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const [books, setBooks] = useState([])
  const client = useApolloClient()

  useEffect(() => {
    const token = localStorage.getItem('libraryapp-user-token')
    if (token) {
      setToken(token)
    }
  }, [setToken])

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
    setPage('authors')
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token
         ? <span>
             <button onClick={() => setPage('add')}>add book</button>
             <button onClick={() => setPage('recommend')}>recommend</button>
             <button onClick={logout}>logout</button>
           </span>
         : <button onClick={() => setPage('login')}>login</button>
        }
      </div>

      <Authors
        show={page === 'authors'}
        token={token}
      />

      <Books
        show={page === 'books'}
        books={books}
        setBooks={setBooks}
      />

      {token
       ? <div>
           <NewBook show={page === 'add'} />
           <Recommends
             show={page === 'recommend'}
             books={books}
           />
         </div>
       : <LoginForm
           show={page === 'login'}
           setToken={setToken}
           setPage={setPage}
         />
      }
    </div>
  )
}

export default App;
