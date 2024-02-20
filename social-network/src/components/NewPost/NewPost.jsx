import { useContext, useState } from "react"
import { UserContext } from "../DashBoard/DashBoard"
import utils from "../../utils"
import PropTypes from 'prop-types';

const NewPost = ({updatePosts}) => {
  
  const [postContent, setPostContent] = useState('')
  const [sendingPost, setSendingPost] = useState(false)
  const [errors, setErrors] = useState(null)

  const {user} = useContext(UserContext)

  const sendPost = async (e) => {
    e.preventDefault()
    setSendingPost(true)
    try{
      const backendUrl = utils.getBackEnd() + "/posts/" + user._id
      const newPost = {
        content:postContent
      }
      const response = await fetch(backendUrl, {
        headers:{
					'Authorization':`Bearer ${utils.getToken()}`,
          'Accept':'application/json',
					'Content-type':'application/json',
				},
				method:"POST",
        body:JSON.stringify(newPost)
      })
      const responseData = await response.json()

      if(!response.ok){
        console.log(responseData.errors);
        setErrors(responseData.errors)
        return
      }
      const savedPost = responseData.post
      savedPost.author_name = responseData.post_author
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