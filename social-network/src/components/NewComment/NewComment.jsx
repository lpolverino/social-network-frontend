import { useState } from "react"
import utils from "../../utils"
import PropTypes from 'prop-types';
import apiRequest from "../../apiRequest"

const NewComment = ({postId, addComment}) => {
  const [comment,setComment] = useState('')
  const [requestPending,setRequestPending] = useState(false)
  const [errors, setErrors] = useState(null)

  const handleCommentSumbit = async (e) => {
    e.preventDefault()
    setRequestPending(true)
    try{
      const backendUrl = "/posts/" + postId +"/comments/" + utils.getuser()
      const responseData = await apiRequest.postToBackend(backendUrl,{comment})
      console.log(responseData);
      const commentToAdd = {
        _id: responseData.comment._id,
        comment,
        author:{
          _id:responseData.comment.author,
          user_name:utils.getUserDetails().user_name
        }
      }
      console.log(commentToAdd);
      addComment(commentToAdd)
    }
    catch(e){
      console.log(e);
      setErrors(e);
    }
    finally{
      setRequestPending(false)
      setComment('')
    }
  }

  const showError = () =>{
    <p> Error ${errors}</p>
  }
  return (
    <div>
      {errors && showError()}
      <input name="comment" id={`newcomment${postId}`} value={comment} onChange={e => setComment(e.target.value)}/>
      { requestPending
        ? <button disabled>Comment! </button>
        : <button onClick={e => handleCommentSumbit(e)}>Comment!</button>
      }
    </div>
  )
}

NewComment.propTypes = {
  postId:PropTypes.string,
  addComment: PropTypes.func
}

export default NewComment