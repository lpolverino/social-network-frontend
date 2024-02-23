import { useEffect, useState } from 'react'
import NewComment from '../NewComment/NewComment'
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import apiRequest from "../../apiRequest"


const Comments = ({postId, addComment, newComments = [] }) => {

  const [isLoading, setIsLoading] = useState(true)
  const [errors, setErrors] = useState(null)
  const [comments, setComments] = useState([])


  useEffect(() => {

    const getData = async () => {

      try{
        const backendUrl = "/posts/" + postId + "/comments"
        const responseData = await apiRequest.getFromBackend(backendUrl)
        setComments(responseData.comments)
      }
      catch(e){
        console.log(e);
        setErrors(e);
      }
      finally{
        setIsLoading(false)
      }
    }
    getData()
  },[postId])

  const createComment = (comment) => {
    return (
      <>
        {
          comment.author
            ? <NavLink to={"/profile/"+comment.author._id}> {comment.author.user_name} </NavLink>
            :<p>Anonymus</p>
        }
        <p>{comment.comment}</p>
      </>
      )
  }

  const createComments = (comments) => {
    return (
      <>
      {!isLoading && !errors && comments.map(comment => <li key={comment._id}>{createComment(comment)}</li>)}
      </>
    )
  }

  return (
    <div>Comments
        <NewComment postId ={postId} addComment={(commentId) => addComment(postId, commentId)}></NewComment>
        <ul>
          { createComments(newComments) }
          { createComments(comments) }
        </ul>
    </div>
  )
}

Comments.propTypes = {
  postId:PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  addComment:PropTypes.func,
  newComments: PropTypes.array,
}

export default Comments