import { useDispatch, useSelector } from 'react-redux'
import { getPostsStatus, getPostsError } from './postsSlice'
import PostsExcerpt from './PostsExcerpt'
import { useState } from 'react'
import { searchPosts, sortPosts } from './postsSlice'

const PostsList = () => {
  let posts = useSelector((state) => state.posts.posts)
  const searchedBy = useSelector((state) => state.posts.searchedBy)
  const sortBy = useSelector((state) => state.posts.sortBy)
  const [search, setSearch] = useState(searchedBy)
  const [sort, setSort] = useState(sortBy)

  const dispatch = useDispatch()

  if (searchedBy !== '' && sortBy === '') {
    posts = posts.filter((post) =>
      post.title.toLowerCase().startsWith(searchedBy.toLowerCase())
    )
  } else if (searchedBy === '' && sortBy !== '') {
    const types = {
      '': '',
      title: 'title',
      count: 'count',
    }
    const sortProperty = types[sortBy]
    posts = [...posts].sort((a, b) => {
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
  } else if (searchedBy === '' && sortBy === '') {
  } else {
    const types = {
      '': '',
      title: 'title',
      count: 'count',
    }
    const sortProperty = types[sortBy]
    posts = posts.filter((post) =>
      post.title.toLowerCase().startsWith(searchedBy.toLowerCase())
    )
    posts = [...posts].sort((a, b) => {
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

  // const submitHandler = (event) => {
  //   event.preventDefault()
  //   setSearch('')
  // }

  const inputChangeHandler = (event) => {
    setSearch(event.target.value)
    dispatch(searchPosts(event.target.value))
  }

  const selectChangeHandler = (event) => {
    setSort(event.target.value)
    dispatch(sortPosts(event.target.value))
  }

  const postStatus = useSelector(getPostsStatus)
  const error = useSelector(getPostsError)

  let content
  if (postStatus === 'loading') {
    content = <p>"Loading..."</p>
  } else if (postStatus === 'succeeded') {
    content = posts.map((post) => <PostsExcerpt key={post.id} post={post} />)
  } else if (postStatus === 'failed') {
    content = <p>{error}</p>
  }

  return (
    <section>
      <div>
        {/* <form onSubmit={submitHandler}>
          <input
            type='text'
            onChange={inputChangeHandler}
            value={search}
            placeholder='Search for a post...'
          />
        </form> */}

        <input
          type='text'
          onChange={inputChangeHandler}
          value={search}
          placeholder='Search for a post...'
        />
      </div>
      <div>
        <select value={sort} onChange={selectChangeHandler}>
          <option value=''>Sort Method</option>
          <option value='title'>title</option>
          <option value='count'>count</option>
        </select>
      </div>
      {content}
    </section>
  )
}
export default PostsList
