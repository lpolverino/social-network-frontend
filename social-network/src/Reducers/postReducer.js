const postReducer = (posts, action) => {
  switch(action.type){
    case "initial" : {
      return action.posts
    }
    case "like" : {
      const newPost = posts.map(post => {
        return (post._id === action.postId) 
          ? Object.assign(post, {likes:action.newLikes})
          :post
      })
      //console.log(newPost);
      return newPost
    }
    case "add": return [action.newPost].concat(posts)
    case "comment": {
      const newComments = posts.map(post => {
        return (post._id === action.postId)
        ?{...post, comments:post.comments.concat([action.comment])}
        :post
      })
      return newComments
    }
    default: throw new Error(`Dispatch action ${action.type} not found`)
  }
}

export default postReducer