import NewPost from "../NewPost/NewPost"
import { useState } from "react";

const PostDisplayer = () => {
  const [posts, setPosts] = useState([])

  const createPost = (post) => {
    return (
      <>
      <p> By: {post.author} </p>
      <p> {post.content} </p>
      </>
    )
  }
  
  return (
    <div>
      <NewPost updatePosts={setPosts}></NewPost>
      <div>
        <ul>
          {posts.map(post => <li key={post._id}>{createPost(post)}</li>)}
        </ul>
      </div>
    </div>
  )
}



export default PostDisplayer