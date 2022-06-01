import PostAuthor from './PostAuthor'
import TimeAgo from './TimeAgo'
import ReactionButtons from './ReactionButtons'
import { Link } from 'react-router-dom'
import Modal from '../../components/Modal'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { deletePost } from './postsSlice'

const PostsExcerpt = ({ post }) => {
  const dispatch = useDispatch()
  const [modalActive, setModalActive] = useState(false)

  const onDeletePostClicked = () => {
    dispatch(deletePost({ id: post.id })).unwrap()
  }

  function deleteAndCloseModal(id) {
    onDeletePostClicked(id)
    setModalActive(false)
  }
  return (
    <article>
      <h2>Title - {post.title}</h2>
      <p>Count - {post.count}</p>
      <p>Id - {post.id}</p>
      <p className='excerpt'>{post.body.substring(0, 75)}...</p>
      <p className='postCredit'>
        <Link to={`post/${post.id}`}>View Post</Link>
        <PostAuthor userId={post.userId} />
        <TimeAgo timestamp={post.date} />
      </p>
      <ReactionButtons post={post} />
      <button className='deleteButton' onClick={() => setModalActive(true)}>
        Delete
      </button>
      <Modal active={modalActive} setActive={setModalActive}>
        <h2>Title - {post.title}</h2>
        <p>Count - {post.count}</p>
        <p>Id - {post.id}</p>
        <div>
          <button className='open-btn' onClick={() => setModalActive(false)}>
            Close
          </button>
          <button
            className='deleteButton'
            type='button'
            onClick={() => {
              deleteAndCloseModal(post.id)
            }}
          >
            Confirm delete
          </button>
        </div>
      </Modal>
    </article>
  )
}
export default PostsExcerpt
