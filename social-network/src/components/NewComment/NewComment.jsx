import { useState } from "react"
import utils from "../../utils"
import PropTypes from 'prop-types';

const NewComment = ({postId, addComment}) => {
  const [comment,setComment] = useState('')
  const [requestPending,setRequestPending] = useState(false)
  const [errors, setErrors] = useState(null)

  const handleCommentSumbit = async (e) => {
    e.preventDefault()
    setRequestPending(true)
    try{
      const backendUrl = utils.getBackEnd() + "/posts/" + postId +"/comments/" + utils.getuser()
      const respònse = await fetch(backendUrl, {
        headers:{
					'Authorization':`Bearer ${utils.getToken()}`,
					'Accept':'application/json',
					'Content-type':'application/json',
				},
        method:"POST",
        body:JSON.stringify({comment})
      })

      const responseData = await respònse.json()

      console.log(responseData);
      if(!respònse.ok){
        setErrors(responseData.errors)
        return
      }
      addComment(responseData.comment._id)
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