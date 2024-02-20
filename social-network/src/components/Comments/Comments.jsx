import { useEffect, useState } from 'react'
import NewComment from '../NewComment/NewComment'
import utils from '../../utils';
import PropTypes from 'prop-types';

const Comments = ({postId, addComment}) => {

  const [isLoading, setIsLoading] = useState(true)
  const [errors, setErrors] = useState(null)
  const [comments, setComments] = useState([])

  useEffect(() => {

    const getData = async () => {

      try{
        const backendUrl = utils.getBackEnd() + "/posts/" + postId + "/comments"
        const response = await fetch(backendUrl, {
          headers:{
            'Authorization' : `Bearer ${utils.getToken()}`,
            'Accept': `application/json`,
          },
          method:"GET",
        })
  
        const responseData = await response.json()

        if(!response.ok) throw new Error(`there was a HTTP error ${response.status} ${responseData.error.msg}`)
      
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
  },[])
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