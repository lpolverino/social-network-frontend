import { useContext, useEffect, useState } from 'react'
import NewComment from '../NewComment/NewComment'
import PropTypes from 'prop-types';
import { ApiContext } from '../../main';

const Comments = ({postId, addComment}) => {

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

  return (
    <div>Comments
        <NewComment postId ={postId} addComment={(commentId) => addComment(postId, commentId)}></NewComment>
        <ul>{
          !isLoading && !errors && comments.map(comment => <li key={comment._id}>
            <p>{comment.author? comment.author.user_name:"Anonimus"}</p>
            <p>{comment.comment}</p>
            </li>)
        }
        </ul>
    </div>
  )
}

Comments.propTypes = {
  postId:PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  addComment:PropTypes.func,
}

export default Comments