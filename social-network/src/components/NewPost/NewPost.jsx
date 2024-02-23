import { useContext, useState } from "react"
import { UserContext } from "../DashBoard/DashBoard"
import PropTypes from 'prop-types';
import { ApiContext } from "../../main";

const NewPost = ({updatePosts}) => {
  
  const [postContent, setPostContent] = useState('')
  const [sendingPost, setSendingPost] = useState(false)
  const [errors, setErrors] = useState(null)

  const {user} = useContext(UserContext)
  const {api} = useContext(ApiContext)

  const sendPost = async (e) => {
    e.preventDefault()
    setSendingPost(true)
    try{
      const backendUrl = "/posts/" + user._id
      const newPost = {
        content:postContent
      }
      const responseData = await api.postToBackend(backendUrl, newPost)
      const savedPost = responseData.post
      savedPost.author = {
        _id: responseData.post.author._id,
        user_name:responseData.post_author
      }
      updatePosts(savedPost)
      setPostContent('')
    }
    catch(e){
      console.log(e);
      setErrors(e)
    }
    finally {
      setSendingPost(false)
    }
  }

  const showErrors = () =>{}

  return (
    <div>
      {errors && showErrors()}
      <input type="text" 
        name="postContent"
        id="postContent"
        value={postContent}
        onChange={e => setPostContent(e.target.value)}
        placeholder="What you wanna share?">  
      </input>
      {sendingPost
        ? <button onClick={e => sendPost(e)} disabled>POST!</button> 
        : <button onClick={e => sendPost(e)} >POST!</button> 
      }
    </div>
  )
}

NewPost.propTypes = {
  updatePosts:PropTypes.func
}

export default NewPost