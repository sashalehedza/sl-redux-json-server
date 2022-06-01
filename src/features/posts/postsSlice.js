import { createSlice, nanoid, createAsyncThunk } from '@reduxjs/toolkit'
import { sub } from 'date-fns'
import axios from 'axios'

const POSTS_URL = '/posts'

const initialState = {
  posts: [],
  searchedBy: '',
  filteredBy: '',
  sortBy: '',
  status: 'idle', //'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
}

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const response = await axios.get(POSTS_URL)
  return response.data
})

export const addNewPost = createAsyncThunk(
  'posts/addNewPost',
  async (initialPost) => {
    const response = await axios.post(POSTS_URL, initialPost)
    return response.data
  }
)

export const updatePost = createAsyncThunk(
  'posts/updatePost',
  async (initialPost) => {
    const { id } = initialPost
    try {
      const response = await axios.put(`${POSTS_URL}/${id}`, initialPost)
      return response.data
    } catch (err) {
      //return err.message;
      return initialPost // only for testing Redux!
    }
  }
)

export const deletePost = createAsyncThunk(
  'posts/deletePost',
  async (initialPost) => {
    const { id } = initialPost
    try {
      const response = await axios.delete(`${POSTS_URL}/${id}`)
      if (response?.status === 200) return initialPost
      return `${response?.status}: ${response?.statusText}`
    } catch (err) {
      return err.message
    }
  }
)

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    postAdded: {
      reducer(state, action) {
        state.posts.push(action.payload)
      },
      prepare(title, content, userId) {
        return {
          payload: {
            id: nanoid(),
            title,
            content,
            date: new Date().toISOString(),
            userId,
            reactions: {
              thumbsUp: 0,
              wow: 0,
              heart: 0,
              rocket: 0,
              coffee: 0,
            },
          },
        }
      },
    },
    reactionAdded(state, action) {
      const { postId, reaction } = action.payload
      const existingPost = state.posts.find((post) => post.id === postId)
      if (existingPost) {
        existingPost.reactions[reaction]++
      }
    },
    searchPosts(state, action) {
      state.searchedBy = action.payload
    },
    filterPosts(state, action) {
      state.filteredBy = action.payload
    },
    sortPosts(state, action) {
      state.sortBy = action.payload
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPosts.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        // Adding date and reactions
        let min = 1
        const loadedPosts = action.payload.map((post) => {
          post.date = sub(new Date(), { minutes: min++ }).toISOString()
          post.reactions = {
            thumbsUp: 0,
            wow: 0,
            heart: 0,
            rocket: 0,
            coffee: 0,
          }
          return post
        })

        // Add any fetched posts to the array
        state.posts = state.posts.concat(loadedPosts)
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(addNewPost.fulfilled, (state, action) => {
        action.payload.userId = Number(action.payload.userId)
        action.payload.date = new Date().toISOString()
        action.payload.reactions = {
          thumbsUp: 0,
          wow: 0,
          heart: 0,
          rocket: 0,
          coffee: 0,
        }
        console.log(action.payload)
        state.posts.push(action.payload)
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        if (!action.payload?.id) {
          console.log('Update could not complete')
          console.log(action.payload)
          return
        }
        const { id } = action.payload
        action.payload.date = new Date().toISOString()
        const posts = state.posts.filter((post) => post.id !== id)
        state.posts = [...posts, action.payload]
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        if (!action.payload?.id) {
          console.log('Delete could not complete')
          console.log(action.payload)
          return
        }
        const { id } = action.payload
        const posts = state.posts.filter((post) => post.id !== id)
        state.posts = posts
      })
  },
})

export const selectAllPosts = (state) => state.posts.posts
export const getPostsStatus = (state) => state.posts.status
export const getPostsError = (state) => state.posts.error

export const selectPostsByUser = (state, userId) =>
  state.posts.posts.filter((post) => post.userId === userId)

export const selectPostById = (state, postId) =>
  state.posts.posts.find((post) => post.id === postId)

export const selectPostsWhoseTitleStartWith = (state, namePrefix) =>
  state.posts.posts.filter((item) =>
    item.title.toLowerCase().startsWith(namePrefix.toLowerCase())
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

export const sortPostsBy = (state, sortType) => {
  const types = {
    '': '',
    title: 'title',
    id: 'id',
  }
  const sortProperty = types[sortType]
  //let sorted = [...state.users].sort((a, b) => {
  // let sorted = [...state].sort((a, b) => {
  //   if (a.title < b.title) {
  //     return -1
  //   } else if (a.title > b.title) {
  //     return 1
  //   } else {
  //     return 0
  //   }
  // })
  let sorted = [...state].sort((a, b) => {
    if (a.title < b.title) {
      return -1
    } else if (a.title > b.title) {
      return 1
    }

    if (a.count > b.count) {
      return 1
    } else if (a.count < b.count) {
      return -1
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
  const filteredData = selectPostsWhoseTitleStartWith(state, namePrefix)
  const sortedData = sortPostsBy(filteredData, sortType)
  return sortedData
}

export const { postAdded, reactionAdded, searchPosts, filterPosts, sortPosts } =
  postsSlice.actions

export default postsSlice.reducer
