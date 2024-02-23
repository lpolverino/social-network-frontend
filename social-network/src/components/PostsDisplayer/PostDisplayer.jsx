import { ApiContext } from "../../main";
import { socket } from "../../socket";
import NewPost from "../NewPost/NewPost"
import Post from "../Post/Post";
import PropType from "prop-types"

import { useContext, useEffect, useReducer, useState } from "react";

const PostDisplayer = ({userPost}) => {
  const [posts, dispatch] = useReducer(postReducer, userPost ??[])
  const [isLoading, setIsLoading] = useState(userPost === undefined)

  const {api} = useContext(ApiContext)

  const toggleLike = (postId, newLikes) => {
    dispatch({
      type:"like",
      postId,
      newLikes,
    })
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
      const getData = async () => {
  
        const backendUrl = "/users/index"
        try{
          const responseData = await api.getFromBackend(backendUrl)
          
          dispatch({
            type:"initial",
            posts: responseData.posts
          })
        }
        catch(e){
          console.log(e);
        }
        finally{
          setIsLoading(false)
        }
  
      }
      if (userPost === undefined) getData()
    },
  [userPost,api]);

  return (
    <div>
      {!userPost && <NewPost updatePosts={addNewPost}></NewPost>}
      <div>
        <ul>
          {!isLoading && posts.map(post => <li key={post._id}><Post post={post} postHandlers={postHandlers}></Post></li>)}
        </ul>
      </div>
    </div>
  )
}

PostDisplayer.propTypes = {
  userPost: PropType.arrayOf(PropType.object)
}

const postReducer = (posts, action) => {
  switch(action.type){
    case "initial" : {
      return action.posts
    }
    case "like" : {
      return posts.map(post => {
        return (post._id === action.postId) 
          ? Object.assign(post, {likes:action.newLikes})
          :post
      })
    }
    case "add": return [action.newPost].concat(posts)
    case "comment": {
      console.log(`adding comment ${action.comment._id} to post ${action.postId}`);
      const newComments = posts.map(post => {
        return (post._id === action.postId)
        ?{...post, comments:post.comments.concat([action.comment])}
        :post
      })
      console.log(newComments);
      return newComments
    }
    default: throw new Error(`Dispatch action ${action.type} not found`)
  }
} 

export default PostDisplayer