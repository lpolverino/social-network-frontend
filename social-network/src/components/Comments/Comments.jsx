import { useEffect, useState } from 'react'
import NewComment from '../NewComment/NewComment'
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import apiRequest from "../../apiRequest"
import utils from '../../utils';
import ErrorDisplayer from '../ErrorDisplayer/ErrorDisplayer';


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
        setErrors(utils.parseError(e));
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
      {!isLoading && comments.map(comment => <li key={comment._id}>{createComment(comment)}</li>)}
      </>
    )
  }

  const createAllComments = () => {

    return (
      <>
        { createComments(newComments) }      
        { createComments(comments) }
      </>
    )
  }

  return (
    <div>Comments
        <NewComment postId ={postId} addComment={(commentId) => addComment(postId, commentId)}></NewComment>
        <ul>
          {errors 
            ? <ErrorDisplayer errors={[errors]}></ErrorDisplayer>
            : createAllComments()
          }
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