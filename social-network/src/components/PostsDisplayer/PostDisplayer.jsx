import { socket } from "../../socket";
import utils from "../../utils";
import NewPost from "../NewPost/NewPost"
import Post from "../Post/Post";

import { useEffect, useReducer, useState } from "react";

const PostDisplayer = () => {
  const [posts, dispatch] = useReducer(postReducer,[])
  const [isLoading, setIsLoading] = useState(true)

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
  const addComment = (postId, commentId) => {
    dispatch({
      type:"comment",
      postId,
      commentId,
    })

    const post = posts.find(el => el._id= postId)
    socket.emit("notify",post.author._id)
  }
    const postHandlers = {
    toggleLike,
    addNewPost,
    addComment,
  }

  useEffect( () => {
      const getData = async () => {
  
        const backendUrl = utils.getBackEnd() + "/users/index"
        try{
          const response = await fetch(backendUrl, {
            headers:{
              'Accept':"application/json",
              'Authorization': `Bearer ${utils.getToken()}`
            },
            method:"GET"
          })
          const responseData = await response.json()
  
          if(!response.ok) throw new Error(`the was an HTTP error : ${response.status} ${responseData.error.message}`)
          
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
      getData()
    },
  []);


  return (
    <div>
      <NewPost updatePosts={addNewPost}></NewPost>
      <div>
        <ul>
          {!isLoading && posts.map(post => <li key={post._id}><Post post={post} postHandlers={postHandlers}></Post></li>)}
        </ul>
      </div>
    </div>
  )
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