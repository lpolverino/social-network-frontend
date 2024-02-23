import { useContext, useEffect, useState } from 'react'
import NewComment from '../NewComment/NewComment'
import PropTypes from 'prop-types';
import { ApiContext } from '../../main';

const Comments = ({postId, addComment, newComments = [] }) => {

  const [isLoading, setIsLoading] = useState(true)
  const [errors, setErrors] = useState(null)
  const [comments, setComments] = useState([])

  const {api} = useContext(ApiContext)

  useEffect(() => {

    const getData = async () => {

      try{
        const backendUrl = "/posts/" + postId + "/comments"
        const responseData = await api.getFromBackend(backendUrl)
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
  },[postId,api])

  const createComment = (comment) => {
    return (
      <>
        <p>{comment.author? comment.author.user_name:"Anonimus"}</p>
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