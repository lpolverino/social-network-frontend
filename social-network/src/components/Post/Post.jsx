import { useState } from "react"
import utils from "../../utils"
import PropTypes from "prop-types"
import Comments from "../Comments/Comments"
import { NavLink } from "react-router-dom"
import apiRequest from "../../apiRequest"

const Post = ({post, postHandlers}) => {
  const [isLikeRequestPending , setIsLikeRequestPending] = useState(false)
  const [error, setError] = useState(null)
  const [showingComments, setShowingComments] = useState(false)

  const sendLike = async (e, postId) => {
    e.preventDefault()
    setIsLikeRequestPending(true)
    const backendUrl = "/posts/" + postId + "/likes/" + utils.getuser()
    try {
     const likesResponseData = await apiRequest.postToBackend(backendUrl,{})
     postHandlers.toggleLike(postId, likesResponseData.newLikes)
    }
    catch(e){
      console.log(e);
      setError(e);
    }
    finally{
      setIsLikeRequestPending(false)
    }
  } 

  const showComments = () => {
    return (
      <>
      <Comments postId={post._id} addComment={postHandlers.addComment} newComments = {post.comments.filter(comment => comment.author !== undefined)}></Comments>
      </>
    )
  }

  const createPost = () => {
   
   return (
   <> 
      <NavLink to={"/profile/"+post.author._id}>By: {post.author.user_name} </NavLink>
      <p> {post.content} </p>
      {isLikeRequestPending
        ? <button disabled> likes: {post.likes.total}</button>
        : <button onClick={(e) => sendLike (e,post._id) }> likes: {post.likes.total}</button>
      }
      {/*The comments are yot to be rendered correctly, this is why they dont have a unique key */}
      <button onClick={() => setShowingComments(prevState => !prevState)}>Comments</button>
      { showingComments && showComments()}
    </>
   )
  }

  return (
      <>
      {! error && createPost()}
      </>
    )
    
}

Post.propTypes = {
  post: PropTypes.object,
  postHandlers: PropTypes.objectOf(PropTypes.func)
}


export default Post