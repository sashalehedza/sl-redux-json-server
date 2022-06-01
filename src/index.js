import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { store } from './app/store'
import { Provider } from 'react-redux'
import { fetchPosts } from './features/posts/postsSlice'
import { fetchUsers } from './features/users/usersSlice'
import { fetchComments } from './features/comments/commentsSlice'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

store.dispatch(fetchPosts())
store.dispatch(fetchUsers())
store.dispatch(fetchComments())

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path='/*' element={<App />} />
        </Routes>
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)
