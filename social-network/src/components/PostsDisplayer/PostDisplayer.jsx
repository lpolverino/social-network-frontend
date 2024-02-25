import { socket } from "../../socket";
import NewPost from "../NewPost/NewPost"
import Post from "../Post/Post";
import PropType from "prop-types"
import { useEffect, useReducer, useState } from "react";
import apiRequest from "../../apiRequest";
import utils from "../../utils";
import ErrorDisplayer from "../ErrorDisplayer/ErrorDisplayer";
import postReducer from "../../Reducers/postReducer";
import { useParams } from "react-router-dom";

const PostDisplayer = ({userPost}) => {
  
  const params = useParams()
  const [posts, dispatch] = useReducer(postReducer, userPost??[])
  const [isLoading, setIsLoading] = useState(userPost === undefined)
  const [errors, setErrors] = useState(null)

  const toggleLike = (postId, newLikes) => {
    console.log(newLikes);
    dispatch({
      type:"like",
      postId,
      newLikes,
    })
    //console.log(posts);
    const post = posts.find(el => el._id = postId)
    if(post.likes.total < newLikes.total) socket.emit("notify", post.author._id)
  }
  const addNewPost = (newPost) => {
    dispatch({
      type:"add",
      newPost
    })
  }
  const addComment = (postId,comment) => {
    dispatch({
      type:"comment",
      postId,
      comment,
    })

    const post = posts.find(el => el._id = postId)
    socket.emit("notify",post.author._id)
  }
  
  const postHandlers = {
    toggleLike,
    addNewPost,
    addComment,
  }

  useEffect( () => {
      const getData = async (backendUrl) => {
        try{
          const responseData = await apiRequest.getFromBackend(backendUrl)
          
          dispatch({
            type:"initial",
            posts: responseData.posts?? responseData.post
          })
        }
        catch(e){
          console.log(e);
          setErrors(utils.parseError(e))
        }
        finally{
          setIsLoading(false)
        }
  
      }
      if (userPost === undefined)
       params.postId ? getData("/posts/"+params.postId) : getData("/users/index")
    },
    [userPost, params]);

    const renderPosts = () => {
      if (Array.isArray(posts))      
        return posts.map(post => <li key={post._id}><Post post={post} postHandlers={postHandlers}></Post></li>)
      
      return <Post post={posts} postHandlers={postHandlers}> </Post>
    }

  return (
    <div>
      {!userPost && !params.postId && <NewPost updatePosts={addNewPost}></NewPost>}
      <div>
        <ul>
          {errors && <ErrorDisplayer errors={[errors]} > </ErrorDisplayer>}
          {!isLoading && renderPosts()}
          
        </ul>
      </div>
    </div>
  )
}

PostDisplayer.propTypes = {
  userPost: PropType.arrayOf(PropType.object)
}

export default PostDisplayer