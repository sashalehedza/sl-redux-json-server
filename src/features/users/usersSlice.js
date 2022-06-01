import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const USERS_URL = '/users'

const initialState = []

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await axios.get(USERS_URL)
  return response.data
})

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      return action.payload
    })
  },
})

export const selectAllUsers = (state) => state.users

export const selectUserById = (state, userId) =>
  state.users.find((user) => user.id === userId)

export const selectUsersWhoseNamesStartWith = (state, namePrefix) =>
  state.users.filter((item) =>
    item.name.toLowerCase().startsWith(namePrefix.toLowerCase())
  )

// export const sortUsersBy = (state, sortType) =>
//   [...state.users].sort((a, b) => {
//     if (a[sortType] < b[sortType]) {
//       return -1
//     } else if (a[sortType] > b[sortType]) {
//       return 1
//     } else {
//       return 0
//     }
//   })

export const sortUsersBy = (state, sortType) => {
  const types = {
    '': '',
    username: 'username',
    id: 'id',
  }
  const sortProperty = types[sortType]
  //let sorted = [...state.users].sort((a, b) => {
  let sorted = [...state].sort((a, b) => {
    if (a.name < b.name) {
      return -1
    } else if (a.name > b.name) {
      return 1
    } else {
      return 0
    }
  })
  if (sortType) {
    sorted = [...sorted].sort((a, b) => {
      var tA = typeof a[sortProperty]
      var tB = typeof b[sortProperty]
      if (tA === tB && tA === 'string') {
        return a[sortProperty].localeCompare(b[sortProperty])
      } else if (tA === tB && tA === 'number') {
        return a[sortProperty] - b[sortProperty]
      } else {
        return tA === 'string' ? -1 : 1
      }
    })
  }
  return sorted
}

export function ExampleComplexComponent(state, namePrefix, sortType) {
  const filteredData = selectUsersWhoseNamesStartWith(state, namePrefix)
  const sortedData = sortUsersBy(filteredData, sortType)
  return sortedData
}

export default usersSlice.reducer
