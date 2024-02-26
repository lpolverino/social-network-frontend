import { useContext, useState } from "react"
import { UserContext } from "../DashBoard/DashBoard"
import PropTypes from 'prop-types';
import apiRequest from "../../apiRequest";
import utils from "../../utils";
import ErrorDisplayer from "../ErrorDisplayer/ErrorDisplayer";

const NewPost = ({updatePosts}) => {
  
  const [postContent, setPostContent] = useState('')
  const [sendingPost, setSendingPost] = useState(false)
  const [errors, setErrors] = useState(null)
  const [postImage, setPostImage] = useState({myFile: ""})

  const {user} = useContext(UserContext)

  const sendPost = async (e) => {
    e.preventDefault()
    setSendingPost(true)
    try{
      const backendUrl = "/posts/" + user._id
      const newPost = {
        content:postContent,
        image: postImage
      }
      const responseData = await apiRequest.postToBackend(backendUrl, newPost)
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
      setErrors(utils.parseError(e))
    }
    finally {
      setSendingPost(false)
    }
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    const base64 = await utils.convertToBase64(file)
    setPostImage({...postImage, myFile:base64})
    console.log(base64);
  }

  const showErrors = () =>{
    return <ErrorDisplayer errors={[errors]}></ErrorDisplayer>
  }

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
      <label htmlFor="file-upload">
        {postImage.myFile
        ?<p>upload Image</p>
        :<img src={postImage.myFile} alt="post image"></img>
        }
      </label>
      <input
        type="file"
        label="image"
        name="myFIle"
        id="file-upload"
        accept=".jpeg, .png, .jpg"
        onChange={e => handleFileUpload(e)}
      />
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