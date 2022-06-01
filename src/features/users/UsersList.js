import { useSelector } from 'react-redux'
import {
  //   selectAllUsers,
  selectUsersWhoseNamesStartWith,
  sortUsersBy,
  ExampleComplexComponent,
} from './usersSlice'
import { Link } from 'react-router-dom'
import { useState } from 'react'

const UsersList = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortType, setSortType] = useState('')
  const postsForUser = useSelector((state) =>
    ExampleComplexComponent(state, searchTerm, sortType)
  )

  const renderedUsers = postsForUser.map((user) => (
    <li key={user.id}>
      <Link to={`/user/${user.id}`}>
        {user.name} - {user.username} - {user.id}
      </Link>
    </li>
  ))

  return (
    <section>
      <input
        type='text'
        placeholder='seach...'
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <select onChange={(e) => setSortType(e.target.value)}>
        <option value=''>Sort Method</option>
        <option value='username'>username</option>
        <option value='id'>id</option>
      </select>
      <h2>Users</h2>

      <ul>{renderedUsers}</ul>
    </section>
  )
}

export default UsersList
