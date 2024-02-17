import utils from "../../utils";
import NewComment from "../NewComment/NewComment";
import NewPost from "../NewPost/NewPost"
import { useReducer, useState } from "react";

const PostDisplayer = () => {
  const [posts, dispatch] = useReducer(postReducer,[])
  const [likenRequestPending, setLikeRequestPending] = useState(false)
  const [errors, setErrors] = useState(null)

  const toggleLike = (postId, newLikes) => {
    dispatch({
      type:"like",
      postId,
      newLikes,
    })
  }
  const addNewPost = (newPost) => {
    dispatch({
      type:"add",
      newPost
    })
  }

  const addComment = (postId, commentId) => {
    dispatch({
      type:"comment",
      postId,
      commentId,
    })
  }

  const sendLike = async (e, postId) => {
    e.preventDefault()
    setLikeRequestPending(true)
    const backendUrl = utils.getBackEnd() +"/posts/" + postId + "/likes/" + utils.getuser()
    try {
      const response = await fetch(backendUrl,{
        headers:{
					'Authorization':`Bearer ${utils.getToken()}`,
					'Accept':'application/json',
					'Content-type':'application/json',
        },
        method: "POST",
      })
      const responseData = await response.json();
      if(!response.ok){
        setErrors(response.errors.msg)
      }
      toggleLike(postId, responseData.newLikes)
    }
    catch(e){
      console.log(e);
      setErrors(e);
    }
    finally{
      setLikeRequestPending(false)
    }
  }

  
  const createPost = (post) => {
    const commentsToShow = [... new Set(post.comments)]
    return (
      <>
      <p> By: {post.author_name} </p>
      <p> {post.content} </p>
      {likenRequestPending
        ? <button disabled> likes: {post.likes.total}</button>
        : <button onClick={(e) => sendLike (e,post._id) }> likes: {post.likes.total}</button>
      }
      {/*The comments are yot to be rendered correctly, this is why they dont have a unique key */}
      <ul> Comments
        <NewComment postId ={post._id} addComment={(commentId) => addComment(post._id,commentId)}></NewComment>
        {
          commentsToShow.map(comment => <li key={comment}> {comment} </li>)
        }
      </ul>
      </>
    )
  }
  
  const showErrors = () => {
    return <h2> Error {errors}</h2>
  }

  return (
    <div>
      {errors && showErrors()}
      <NewPost updatePosts={addNewPost}></NewPost>
      <div>
        <ul>
          {posts.map(post => <li key={post._id}>{createPost(post)}</li>)}
        </ul>
      </div>
    </div>
  )
}

const postReducer = (posts, action) => {
  switch(action.type){
    case "like" : {
      return posts.map(post => {
        return (post._id === action.postId) 
          ? Object.assign(post, {likes:action.newLikes})
          :post
      })
    }
    case "add": return [action.newPost].concat(posts)
    case "comment": {
      console.log(`adding comment ${action.commentId} to post ${action.postId}`);
      return posts.map(post => {
        return (post._id === action.postId)
        ?Object.assign(post, {comments:post.comments.concat([action.commentId])})
        :post
      })
    }
    default: throw new Error(`Dispatch action ${action.type} not found`)
  }
} 

export default PostDisplayer