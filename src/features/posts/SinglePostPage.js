import { useDispatch, useSelector } from 'react-redux'
import { selectPostById } from './postsSlice'

import PostAuthor from './PostAuthor'
import TimeAgo from './TimeAgo'
import ReactionButtons from './ReactionButtons'

import { useParams, Link } from 'react-router-dom'
import {
  addNewComment,
  deleteComment,
  selectPostComments,
} from '../comments/commentsSlice'
import { useState } from 'react'

const SinglePostPage = () => {
  const dispatch = useDispatch()
  const { postId } = useParams()
  const comments = useSelector((state) =>
    selectPostComments(state, Number(postId))
  )
  // const comment = useSelector((state) =>
  //   selectCommentById(state, Number(postId))
  // )
  const [description, setDescription] = useState('')
  const [addRequestStatus, setAddRequestStatus] = useState('idle')
  const canSave = [description].every(Boolean) && addRequestStatus === 'idle'
  const onDescriptionChanged = (e) => setDescription(e.target.value)

  const post = useSelector((state) => selectPostById(state, Number(postId)))

  if (!post) {
    return (
      <section>
        <h2>Post not found!</h2>
      </section>
    )
  }

  const onSavePostClicked = () => {
    if (canSave) {
      try {
        setAddRequestStatus('pending')
        dispatch(
          addNewComment({ description, postId: Number(postId) })
        ).unwrap()

        setDescription('')
      } catch (err) {
        console.error('Failed to save the post', err)
      } finally {
        setAddRequestStatus('idle')
      }
    }
  }

  return (
    <article>
      <h2>{post.title}</h2>
      <p>{post.body}</p>
      <p className='postCredit'>
        <Link to={`/post/edit/${post.id}`}>Edit Post</Link>
        <PostAuthor userId={post.userId} />
        <TimeAgo timestamp={post.date} />
      </p>
      <ReactionButtons post={post} />
      <section>
        <h2>Add a New Comment</h2>
        <form>
          <label htmlFor='commentDescription'>Description:</label>
          <input
            type='text'
            id='commentDescription'
            name='commentDescription'
            value={description}
            onChange={onDescriptionChanged}
          />
          <button type='button' onClick={onSavePostClicked} disabled={!canSave}>
            Save Comment
          </button>
        </form>
      </section>
      {comments.map((item) => (
        <div key={item.id}>
          <h3>{item.id}</h3>
          <h3>{item.description}</h3>
          <button
            className='deleteButton'
            type='button'
            onClick={() => {
              dispatch(deleteComment({ id: item.id }))
            }}
          >
            Delete
          </button>
        </div>
      ))}
    </article>
  )
}

export default SinglePostPage
