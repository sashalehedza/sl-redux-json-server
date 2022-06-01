import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const COMMENTS_URL = '/comments'

const initialState = {
  comments: [],
  status: 'idle', //'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
}

// export const fetchComments = createAsyncThunk(
//   'comments/fetchComments',
//   async (postId) => {
//     const response = await axios.get(`${COMMENTS_URL}/?postId=${postId}`)
//     return response.data
//   }
// )

export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async () => {
    const response = await axios.get(COMMENTS_URL)
    return response.data
  }
)

export const addNewComment = createAsyncThunk(
  'comments/addNewComment',
  async (initialComment) => {
    const response = await axios.post(COMMENTS_URL, initialComment)
    return response.data
  }
)

export const deleteComment = createAsyncThunk(
  'comments/deleteComment',
  async (initialComment) => {
    const { id } = initialComment
    try {
      const response = await axios.delete(`${COMMENTS_URL}/${id}`)
      if (response?.status === 200) return initialComment
      return `${response?.status}: ${response?.statusText}`
    } catch (err) {
      return err.message
    }
  }
)

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchComments.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.status = 'succeeded'
        // Adding date and reactions
        //let min = 1
        const loadedComments = action.payload.map((comment) => {
          //comment.date = sub(new Date(), { minutes: min++ }).toISOString()
          return comment
        })
        // Add any fetched posts to the array
        state.comments = state.comments.concat(loadedComments)
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(addNewComment.fulfilled, (state, action) => {
        action.payload.postId = Number(action.payload.postId)
        action.payload.date = new Date().toISOString()

        console.log(action.payload)
        state.comments.push(action.payload)
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        if (!action.payload?.id) {
          console.log('Delete could not complete')
          console.log(action.payload)
          return
        }
        const { id } = action.payload
        const comments = state.comments.filter((comment) => comment.id !== id)
        state.comments = comments
      })
  },
})

//export const selectAllComments = (state) => state.comments.comments
export const getCommentsStatus = (state) => state.comments.status
export const getCommentsError = (state) => state.comments.error

export const selectPostComments = (state, postId) =>
  state.comments.comments.filter((comment) => comment.postId === postId)

export default commentsSlice.reducer
